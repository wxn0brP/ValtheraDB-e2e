import { ValtheraClass } from "@wxn0brp/db-core";
import type { TestDefinition } from "../types";

export const findAdvancedTests: TestDefinition[] = [
	{
		domain: "find-options",
		name: "select-exclude-combined",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					a: 1,
					b: 2,
					c: 3,
					d: 4,
				},
			});
			const results = await db.find<any>({
				collection: "items",
				findOpts: {
					select: [
						"a",
						"b",
						"c",
					],
					exclude: [
						"b",
					],
				},
			});
			if (results.length !== 1)
				throw new Error("select+exclude: expected 1 result");
			if (!("a" in results[0]))
				throw new Error("select+exclude: 'a' should be present");
			if ("b" in results[0])
				throw new Error("select+exclude: 'b' should be excluded");
			if ("d" in results[0])
				throw new Error("select+exclude: 'd' should not be present");
		},
	},
	{
		domain: "find-options",
		name: "transform-with-select",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					name: "test",
					val: 42,
				},
			});
			const results = await db.find({
				collection: "items",
				findOpts: {
					select: [
						"name",
					],
					transform: (doc: any) => ({
						...doc,
						extra: true,
					}),
				},
			});
			if (results.length !== 1)
				throw new Error("transform+select: expected 1 result");
			if (results[0].name !== "test")
				throw new Error("transform+select: name should be present");
			if ((results[0] as any).val !== undefined)
				throw new Error("transform+select: val should be excluded by select");
			if ((results[0] as any).extra !== undefined)
				throw new Error(
					"transform+select: extra added by transform should be removed by select",
				);
		},
	},
	{
		domain: "find-options",
		name: "reverse-with-sortBy",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					val: 1,
				},
			});
			await db.add({
				collection: "items",
				data: {
					val: 2,
				},
			});
			await db.add({
				collection: "items",
				data: {
					val: 3,
				},
			});
			const resultsAsc = await db.find({
				collection: "items",
				dbFindOpts: {
					sortBy: "val",
					sortAsc: true,
				},
			});
			const resultsDesc = await db.find({
				collection: "items",
				dbFindOpts: {
					sortBy: "val",
					sortAsc: false,
				},
			});
			if (resultsAsc[0].val !== 1 || resultsAsc[2].val !== 3)
				throw new Error("sortBy asc: wrong order");
			if (resultsDesc[0].val !== 3 || resultsDesc[2].val !== 1)
				throw new Error("sortBy desc: wrong order");
		},
	},
	{
		domain: "find-options",
		name: "find-empty-collection",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("empty_coll");
			const results = await db.find({
				collection: "empty_coll",
			});
			if (!Array.isArray(results))
				throw new Error("find empty: should return array");
			if (results.length !== 0)
				throw new Error("find empty: expected 0 results");
		},
	},
];
