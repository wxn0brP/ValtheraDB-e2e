import { ValtheraClass } from "@wxn0brp/db-core";
import type { TestDefinition } from "../types";

export const advancedAggregationsTests: TestDefinition[] = [
	{
		domain: "find-options",
		name: "aggregation-with-null-values",
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
					val: null,
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
					avg: {
						avgVal: "val",
					},
				},
			});

			if (results[0].avgVal !== 15)
				throw new Error("Aggregation should ignore null values");
		},
	},
	{
		domain: "find-options",
		name: "aggregation-empty-collection",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");

			const results = await db.find({
				collection: "items",
				dbFindOpts: {
					count: {
						total: "_id",
					},
				},
			});

			if (results.length !== 0)
				throw new Error("Aggregation on empty collection should return empty");
		},
	},
	{
		domain: "find-options",
		name: "multi-field-groupBy",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					category: "A",
					status: "active",
					val: 10,
				},
			});
			await db.add({
				collection: "items",
				data: {
					category: "A",
					status: "active",
					val: 20,
				},
			});
			await db.add({
				collection: "items",
				data: {
					category: "A",
					status: "inactive",
					val: 30,
				},
			});
			await db.add({
				collection: "items",
				data: {
					category: "B",
					status: "active",
					val: 40,
				},
			});

			const results = await db.find<any>({
				collection: "items",
				dbFindOpts: {
					groupBy: [
						"category",
						"status",
					],
					count: {
						count: "val",
					},
				},
			});

			if (results.length !== 3) throw new Error("Multi-field groupBy failed");

			const aActive = results.find(
				(r: any) => r.category === "A" && r.status === "active",
			);
			if (!aActive || aActive.count !== 2)
				throw new Error("Multi-field grouping count wrong");
		},
	},
	{
		domain: "find-options",
		name: "distinct-with-sort",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					category: "C",
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

			if (results.length !== 3) throw new Error("Distinct failed");
			if (results[0].category !== "A")
				throw new Error("Distinct + sort order wrong");
		},
	},
	{
		domain: "find-options",
		name: "aggregation-with-mixed-types",
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
					val: "20",
				},
			});
			await db.add({
				collection: "items",
				data: {
					group: "a",
					val: 30,
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

			if (typeof results[0].total !== "number")
				throw new Error("Aggregation should handle mixed types");
		},
	},
	{
		domain: "find-options",
		name: "random-sort-consistency",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			for (let i = 0; i < 100; i++) {
				await db.add({
					collection: "items",
					data: {
						val: i,
					},
				});
			}

			const results1 = await db.find({
				collection: "items",
				dbFindOpts: {
					sortBy: "random()",
					limit: 10,
				},
			});

			const results2 = await db.find({
				collection: "items",
				dbFindOpts: {
					sortBy: "random()",
					limit: 10,
				},
			});

			const ids1 = results1.map((r: any) => r._id).join(",");
			const ids2 = results2.map((r: any) => r._id).join(",");

			if (ids1 === ids2)
				throw new Error("Random sort should produce different results");
		},
	},
];
