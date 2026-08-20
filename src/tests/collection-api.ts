import { ValtheraClass } from "@wxn0brp/db-core";
import type { TestDefinition } from "../types";

export const collectionApiTests: TestDefinition[] = [
	{
		domain: "collection-api",
		name: "collection-add",
		fn: async (db: ValtheraClass) => {
			const coll = db.c("items");
			const doc = await coll.add({
				val: 1,
			});
			if (!doc._id)
				throw new Error("Collection.add should return document with _id");
			if (doc.val !== 1) throw new Error("Collection.add: data mismatch");
		},
	},
	{
		domain: "collection-api",
		name: "collection-find",
		fn: async (db: ValtheraClass) => {
			const coll = db.c("items");
			await coll.add({
				val: 1,
			});
			await coll.add({
				val: 2,
			});
			const results = await coll.find();
			if (results.length !== 2)
				throw new Error("Collection.find: expected 2 results");
		},
	},
	{
		domain: "collection-api",
		name: "collection-findOne",
		fn: async (db: ValtheraClass) => {
			const coll = db.c("items");
			await coll.add({
				_id: "c1",
				val: 1,
			});
			const result = await coll.findOne({
				_id: "c1",
			});
			if (!result || result.val !== 1)
				throw new Error("Collection.findOne: wrong result");
		},
	},
	{
		domain: "collection-api",
		name: "collection-updateOne",
		fn: async (db: ValtheraClass) => {
			const coll = db.c("items");
			await coll.add({
				_id: "c1",
				val: 10,
			});
			const result = await coll.updateOne(
				{
					_id: "c1",
				},
				{
					val: 20,
				},
			);
			if (!result || result.val !== 20)
				throw new Error("Collection.updateOne: update failed");
		},
	},
	{
		domain: "collection-api",
		name: "collection-removeOne",
		fn: async (db: ValtheraClass) => {
			const coll = db.c("items");
			await coll.add({
				_id: "c1",
				val: 1,
			});
			const removed = await coll.removeOne({
				_id: "c1",
			});
			if (!removed)
				throw new Error("Collection.removeOne: should return document");
			const remaining = await coll.find();
			if (remaining.length !== 0)
				throw new Error("Collection.removeOne: document not removed");
		},
	},
	{
		domain: "collection-api",
		name: "collection-update-multiple",
		fn: async (db: ValtheraClass) => {
			const coll = db.c("items");
			await coll.add({
				type: "A",
				val: 1,
			});
			await coll.add({
				type: "A",
				val: 2,
			});

			const updated = await coll.update(
				{
					type: "A",
				},
				{
					val: 99,
				},
			);
			if (updated.length !== 2)
				throw new Error("Collection.update: expected 2 docs");
		},
	},
	{
		domain: "collection-api",
		name: "collection-remove-multiple",
		fn: async (db: ValtheraClass) => {
			const coll = db.c("items");
			await coll.add({
				type: "B",
				val: 1,
			});
			await coll.add({
				type: "B",
				val: 2,
			});

			const removed = await coll.remove({
				type: "B",
			});
			if (removed.length !== 2)
				throw new Error("Collection.remove: expected 2 docs");
		},
	},
	{
		domain: "collection-api",
		name: "collection-updateOneOrAdd",
		fn: async (db: ValtheraClass) => {
			const coll = db.c("items");
			const res = await coll.updateOneOrAdd(
				{
					_id: "proxy-upsert",
				},
				{
					val: 10,
				},
				{
					add_arg: {
						_id: "proxy-upsert",
						val: 10,
					},
				},
			);
			if (res.type !== "added")
				throw new Error("Collection.updateOneOrAdd failed");
		},
	},
];
