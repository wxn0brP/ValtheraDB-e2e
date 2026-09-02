import { ValtheraClass } from "@wxn0brp/db-core";
import type { TestDefinition } from "../types";

export const findOpTests: TestDefinition[] = [
	{
		domain: "find-options",
		name: "dbFindOpts-limit",
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
			const results = await db.find({
				collection: "items",
				dbFindOpts: {
					limit: 2,
				},
			});
			if (results.length !== 2)
				throw new Error("limit: expected 2 results, got: " + results.length);
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-sortBy",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					val: 3,
				},
			});
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
				dbFindOpts: {
					sortBy: "val",
					sortAsc: true,
				},
			});
			if (
				results[0].val !== 1 ||
				results[1].val !== 2 ||
				results[2].val !== 3
			) {
				throw new Error("sortBy: results not sorted ascending");
			}
		},
	},
	{
		domain: "find-options",
		name: "findOpts-select",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					a: 1,
					b: 2,
					c: 3,
				},
			});
			const results = await db.find({
				collection: "items",
				findOpts: {
					select: [
						"a",
						"b",
					],
				},
			});
			if (results.length !== 1) throw new Error("select: expected 1 result");
			if (!("a" in results[0]) || !("b" in results[0]) || "c" in results[0]) {
				throw new Error("select: should only include a and b");
			}
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-offset",
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
			const results = await db.find({
				collection: "items",
				dbFindOpts: {
					offset: 1,
				},
			});
			if (results.length !== 2)
				throw new Error("offset: expected 2 results, got: " + results.length);
			if (results[0].val !== 2)
				throw new Error("offset: expected first result to have val=2");
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-reverse",
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
			const results = await db.find({
				collection: "items",
				dbFindOpts: {
					reverse: true,
				},
			});
			if (results.length !== 3) throw new Error("reverse: expected 3 results");
			if (results[0].val !== 3 || results[2].val !== 1)
				throw new Error("reverse: order should be reversed");
		},
	},
	{
		domain: "find-options",
		name: "findOpts-exclude",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					a: 1,
					b: 2,
					c: 3,
				},
			});
			const results = await db.find<any>({
				collection: "items",
				findOpts: {
					exclude: [
						"c",
					],
				},
			});
			if (results.length !== 1) throw new Error("exclude: expected 1 result");
			if ("c" in results[0]) throw new Error("exclude: c should be excluded");
			if (results[0].a !== 1 || results[0].b !== 2)
				throw new Error("exclude: a and b should be present");
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-limit-with-offset",
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
			await db.add({
				collection: "items",
				data: {
					val: 4,
				},
			});
			const results = await db.find({
				collection: "items",
				dbFindOpts: {
					offset: 1,
					limit: 2,
				},
			});
			if (results.length !== 2)
				throw new Error(
					"limit+offset: expected 2 results, got: " + results.length,
				);
			if (results[0].val !== 2 || results[1].val !== 3)
				throw new Error("limit+offset: wrong results");
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-aggregation-min",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					group: "a",
					val: 10,
				},
			});
			await db.add({
				collection: "items",
				data: {
					group: "a",
					val: 20,
				},
			});
			await db.add({
				collection: "items",
				data: {
					group: "b",
					val: 5,
				},
			});
			const results = await db.find<any>({
				collection: "items",
				dbFindOpts: {
					groupBy: "group",
					min: {
						minVal: "val",
					},
				},
			});
			if (results.length !== 2)
				throw new Error("min: expected 2 groups, got: " + results.length);
			const a = results.find((r: any) => r.group === "a");
			const b = results.find((r: any) => r.group === "b");
			if (!a || a.minVal !== 10)
				throw new Error("min: group a expected 10, got: " + a?.minVal);
			if (!b || b.minVal !== 5)
				throw new Error("min: group b expected 5, got: " + b?.minVal);
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-aggregation-max",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					group: "a",
					val: 10,
				},
			});
			await db.add({
				collection: "items",
				data: {
					group: "a",
					val: 20,
				},
			});
			await db.add({
				collection: "items",
				data: {
					group: "b",
					val: 5,
				},
			});
			const results = await db.find<any>({
				collection: "items",
				dbFindOpts: {
					groupBy: "group",
					max: {
						maxVal: "val",
					},
				},
			});
			if (results.length !== 2)
				throw new Error("max: expected 2 groups, got: " + results.length);
			const a = results.find((r: any) => r.group === "a");
			const b = results.find((r: any) => r.group === "b");
			if (!a || a.maxVal !== 20)
				throw new Error("max: group a expected 20, got: " + a?.maxVal);
			if (!b || b.maxVal !== 5)
				throw new Error("max: group b expected 5, got: " + b?.maxVal);
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-aggregation-avg",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					group: "a",
					val: 10,
				},
			});
			await db.add({
				collection: "items",
				data: {
					group: "a",
					val: 20,
				},
			});
			await db.add({
				collection: "items",
				data: {
					group: "b",
					val: 6,
				},
			});
			const results = await db.find<any>({
				collection: "items",
				dbFindOpts: {
					groupBy: "group",
					avg: {
						avgVal: "val",
					},
				},
			});
			if (results.length !== 2)
				throw new Error("avg: expected 2 groups, got: " + results.length);
			const a = results.find((r: any) => r.group === "a");
			const b = results.find((r: any) => r.group === "b");
			if (!a || a.avgVal !== 15)
				throw new Error("avg: group a expected 15, got: " + a?.avgVal);
			if (!b || b.avgVal !== 6)
				throw new Error("avg: group b expected 6, got: " + b?.avgVal);
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-aggregation-count",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					group: "a",
					val: 1,
				},
			});
			await db.add({
				collection: "items",
				data: {
					group: "a",
					val: 2,
				},
			});
			await db.add({
				collection: "items",
				data: {
					group: "b",
					val: 3,
				},
			});
			const results = await db.find<any>({
				collection: "items",
				dbFindOpts: {
					groupBy: "group",
					count: {
						count: "val",
					},
				},
			});
			if (results.length !== 2)
				throw new Error("count: expected 2 groups, got: " + results.length);
			const a = results.find((r: any) => r.group === "a");
			const b = results.find((r: any) => r.group === "b");
			if (!a || a.count !== 2)
				throw new Error("count: group a expected 2, got: " + a?.count);
			if (!b || b.count !== 1)
				throw new Error("count: group b expected 1, got: " + b?.count);
		},
	},
	{
		domain: "find-options",
		name: "findOpts-transform",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					val: 10,
					label: "x",
				},
			});
			const results = await db.find({
				collection: "items",
				findOpts: {
					transform: (doc: any) => ({
						...doc,
						transformed: true,
					}),
				},
			});
			if (results.length !== 1) throw new Error("transform: expected 1 result");
			if (results[0].transformed !== true)
				throw new Error("transform: transform function not applied");
			if (results[0].val !== 10)
				throw new Error("transform: original data should be preserved");
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-distinct",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					category: "A",
					val: 1,
				},
			});
			await db.add({
				collection: "items",
				data: {
					category: "A",
					val: 2,
				},
			});
			await db.add({
				collection: "items",
				data: {
					category: "B",
					val: 3,
				},
			});

			const results = await db.find({
				collection: "items",
				dbFindOpts: {
					distinct: "category",
				},
			});

			if (results.length !== 2)
				throw new Error("distinct: expected 2 unique categories");
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-aggregation-sum",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					group: "a",
					val: 10,
				},
			});
			await db.add({
				collection: "items",
				data: {
					group: "a",
					val: 20,
				},
			});

			const results = await db.find<any>({
				collection: "items",
				dbFindOpts: {
					groupBy: "group",
					sum: {
						totalVal: "val",
					},
				},
			});

			if (results[0].totalVal !== 30) throw new Error("sum: expected 30");
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-multi-field-sort",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					lastName: "Smith",
					age: 30,
				},
			});
			await db.add({
				collection: "items",
				data: {
					lastName: "Smith",
					age: 20,
				},
			});
			await db.add({
				collection: "items",
				data: {
					lastName: "Doe",
					age: 40,
				},
			});

			const results = await db.find({
				collection: "items",
				dbFindOpts: {
					sortBy: [
						{
							field: "lastName",
							asc: true,
						},
						{
							field: "age",
							asc: false,
						},
					],
				},
			});

			if (results[0].age !== 40 || results[1].age !== 30)
				throw new Error("multi-sort: secondary sort failed");
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-random-sort",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			for (let i = 0; i < 10; i++)
				await db.add({
					collection: "items",
					data: {
						val: i,
					},
				});

			const results = await db.find({
				collection: "items",
				dbFindOpts: {
					sortBy: "random()",
					limit: 5,
				},
			});

			if (results.length !== 5) throw new Error("random sort: limit failed");
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-offset-beyond-data",
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
				dbFindOpts: {
					offset: 10,
				},
			});
			if (results.length !== 0)
				throw new Error(
					"offset beyond data: expected 0 results, got: " + results.length,
				);
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-limit-zero",
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
				dbFindOpts: {
					limit: 0,
				},
			});
			if (results.length !== 0)
				throw new Error("limit 0: expected 0 results, got: " + results.length);
		},
	},
	{
		domain: "find-options",
		name: "findOpts-select-on-findOne",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					a: 1,
					b: 2,
					c: 3,
				},
			});
			const result = await db.findOne({
				collection: "items",
				search: {
					a: 1,
				},
				findOpts: {
					select: [
						"a",
						"b",
					],
				},
			});
			if (!result) throw new Error("findOne with select: expected a result");
			if (!("a" in result) || !("b" in result))
				throw new Error("findOne with select: missing fields");
			if ("c" in result)
				throw new Error("findOne with select: should not contain c");
		},
	},
	{
		domain: "find-options",
		name: "findOpts-exclude-on-findOne",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					a: 1,
					b: 2,
					c: 3,
				},
			});
			const result = await db.findOne<any>({
				collection: "items",
				search: {
					a: 1,
				},
				findOpts: {
					exclude: [
						"c",
					],
				},
			});
			if (!result) throw new Error("findOne with exclude: expected a result");
			if ("c" in result)
				throw new Error("findOne with exclude: c should be excluded");
			if (result.a !== 1 || result.b !== 2)
				throw new Error("findOne with exclude: a and b should be present");
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-distinct-with-sort",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					category: "B",
					val: 1,
				},
			});
			await db.add({
				collection: "items",
				data: {
					category: "A",
					val: 2,
				},
			});
			await db.add({
				collection: "items",
				data: {
					category: "B",
					val: 3,
				},
			});
			await db.add({
				collection: "items",
				data: {
					category: "A",
					val: 4,
				},
			});
			const results = await db.find({
				collection: "items",
				dbFindOpts: {
					distinct: "category",
					sortBy: "category",
					sortAsc: true,
				},
			});
			if (results.length !== 2)
				throw new Error("distinct+sort: expected 2 results");
			if (results[0].category !== "A")
				throw new Error("distinct+sort: should be sorted ascending");
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-groupBy-null-key",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					group: "a",
					val: 1,
				},
			});
			await db.add({
				collection: "items",
				data: {
					group: null,
					val: 2,
				},
			});
			await db.add({
				collection: "items",
				data: {
					group: "a",
					val: 3,
				},
			});
			const results = await db.find<any>({
				collection: "items",
				dbFindOpts: {
					groupBy: "group",
					sum: {
						total: "val",
					},
				},
			});
			const groupA = results.find((r: any) => r.group === "a");
			if (!groupA || groupA.total !== 4)
				throw new Error("groupBy null: group a should sum to 4");
		},
	},
	{
		domain: "find-options",
		name: "dbFindOpts-aggregation-with-search",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					type: "x",
					val: 10,
				},
			});
			await db.add({
				collection: "items",
				data: {
					type: "x",
					val: 20,
				},
			});
			await db.add({
				collection: "items",
				data: {
					type: "y",
					val: 5,
				},
			});
			const results = await db.find<any>({
				collection: "items",
				search: {
					type: "x",
				},
				dbFindOpts: {
					groupBy: "type",
					sum: {
						total: "val",
					},
				},
			});
			if (results.length !== 1)
				throw new Error("aggregation+search: expected 1 group");
			if (results[0].total !== 30)
				throw new Error(
					"aggregation+search: expected sum 30, got: " + results[0].total,
				);
		},
	},
];
