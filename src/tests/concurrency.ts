import { ValtheraClass } from "@wxn0brp/db-core";
import type { TestDefinition } from "../types";

export const concurrencyTests: TestDefinition[] = [
	{
		domain: "edge-cases",
		name: "concurrent-adds-same-collection",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");

			const promises = [];
			for (let i = 0; i < 100; i++) {
				promises.push(
					db.add({
						collection: "items",
						data: {
							val: i,
						},
					}),
				);
			}

			const results = await Promise.all(promises);

			if (results.length !== 100) throw new Error("Concurrent adds failed");

			const ids = results.map((r: any) => r._id);
			const uniqueIds = new Set(ids);
			if (uniqueIds.size !== 100)
				throw new Error("Duplicate IDs generated in concurrent adds");
		},
	},
	{
		domain: "edge-cases",
		name: "concurrent-updates-same-document",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					_id: "counter",
					val: 0,
				},
			});

			const promises = [];
			for (let i = 0; i < 10; i++) {
				promises.push(
					db.updateOne({
						collection: "items",
						search: {
							_id: "counter",
						},
						updater: {
							$inc: {
								val: 1,
							},
						},
					}),
				);
			}

			await Promise.all(promises);

			const result = await db.findOne<any>({
				collection: "items",
				search: {
					_id: "counter",
				},
			});

			if (result.val !== 10)
				throw new Error(
					`Concurrent updates lost: expected 10, got ${result.val}`,
				);
		},
	},
	{
		domain: "edge-cases",
		name: "mixed-concurrent-operations",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");

			const addPromises = [];
			const findPromises = [];

			for (let i = 0; i < 20; i++) {
				addPromises.push(
					db.add({
						collection: "items",
						data: {
							val: i,
						},
					}),
				);

				findPromises.push(
					db.find({
						collection: "items",
					}),
				);
			}

			await Promise.all([
				...addPromises,
				...findPromises,
			]);

			const finalResults = await db.find({
				collection: "items",
			});

			if (finalResults.length !== 20)
				throw new Error("Mixed concurrent operations failed");
		},
	},
	{
		domain: "edge-cases",
		name: "concurrent-remove-and-find",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");

			for (let i = 0; i < 50; i++) {
				await db.add({
					collection: "items",
					data: {
						val: i,
					},
				});
			}

			const removePromises = [];
			const findPromises = [];

			for (let i = 0; i < 10; i++) {
				removePromises.push(
					db.remove({
						collection: "items",
						search: {
							val: i,
						},
					}),
				);

				findPromises.push(
					db.find({
						collection: "items",
					}),
				);
			}

			await Promise.all([
				...removePromises,
				...findPromises,
			]);

			const finalResults = await db.find({
				collection: "items",
			});

			if (finalResults.length !== 40)
				throw new Error("Concurrent remove/find failed");
		},
	},
];
