import { ValtheraClass } from "@wxn0brp/db-core";
import type { TestDefinition } from "../types";

export const edgeTests: TestDefinition[] = [
	{
		domain: "edge-cases",
		name: "empty-search-matches-all",
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
			const results = await db.find({
				collection: "items",
				search: {},
			});
			if (results.length !== 2)
				throw new Error("Empty search should match all documents");
		},
	},
	{
		domain: "edge-cases",
		name: "special-characters-in-data",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			const special = 'Hello "World" <>&\'';
			await db.add({
				collection: "items",
				data: {
					text: special,
				},
			});
			const result = await db.findOne({
				collection: "items",
				search: {
					text: special,
				},
			});
			if (!result || result.text !== special)
				throw new Error("Special characters not preserved");
		},
	},
	{
		domain: "edge-cases",
		name: "deeply-nested-objects",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			const nested = {
				a: {
					b: {
						c: {
							d: 42,
						},
					},
				},
			};
			await db.add({
				collection: "items",
				data: {
					_id: "n1",
					...nested,
				},
			});
			const result = await db.findOne<any>({
				collection: "items",
				search: {
					_id: "n1",
				},
			});
			if (!result || result.a?.b?.c?.d !== 42)
				throw new Error("Nested object not preserved");
		},
	},
	{
		domain: "edge-cases",
		name: "push-to-nonExistent-field",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					_id: "e1",
					name: "Test",
				},
			});

			const result = await db.updateOne<any>({
				collection: "items",
				search: {
					_id: "e1",
				},
				updater: {
					$push: {
						tags: "new-tag",
					},
				},
			});

			if (
				!result ||
				!Array.isArray(result.tags) ||
				result.tags[0] !== "new-tag"
			)
				throw new Error("$push should create array if field doesn't exist");
		},
	},
	{
		domain: "edge-cases",
		name: "update-to-null-and-undefined",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					_id: "e2",
					val: "data",
					opt: "yes",
				},
			});

			const result = await db.updateOne<any>({
				collection: "items",
				search: {
					_id: "e2",
				},
				updater: {
					val: null,
					opt: undefined,
				},
			});

			if (result.val !== null) throw new Error("Update to null failed");
			if (result.opt !== undefined && "opt" in result)
				throw new Error("Update to undefined should remove or nullify field");
		},
	},
	{
		domain: "edge-cases",
		name: "search-by-null-value",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					val: null,
				},
			});
			await db.add({
				collection: "items",
				data: {
					val: "text",
				},
			});

			const results = await db.find({
				collection: "items",
				search: {
					val: null,
				},
			});

			if (results.length !== 1) throw new Error("Search by null failed");
		},
	},
];
