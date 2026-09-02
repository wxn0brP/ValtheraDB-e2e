import { ValtheraClass } from "@wxn0brp/db-core";
import type { TestDefinition } from "../types";

export const lifecycleTests: TestDefinition[] = [
	{
		domain: "lifecycle",
		name: "init-is-idempotent",
		fn: async (db: ValtheraClass) => {
			await db.init();
			await db.init();
			await db.add({
				collection: "test",
				data: {
					val: 1,
				},
			});
			const results = await db.find({
				collection: "test",
			});
			if (results.length !== 1)
				throw new Error("init idempotent: expected 1 result after double init");
		},
	},
	{
		domain: "lifecycle",
		name: "close-and-reinit",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("test");
			await db.add({
				collection: "test",
				data: {
					val: 1,
				},
			});
			await db.close();
			await db.init();
			const results = await db.find({
				collection: "test",
			});
			if (results.length !== 1)
				throw new Error("reinit: expected 1 result after close+reinit");
		},
	},
	{
		domain: "lifecycle",
		name: "version-exists",
		fn: async (db: ValtheraClass) => {
			if (typeof db.version !== "string")
				throw new Error("version: should be a string");
			if (db.version.length === 0)
				throw new Error("version: should not be empty");
		},
	},
	{
		domain: "lifecycle",
		name: "db-has-all-methods",
		fn: async (db: ValtheraClass) => {
			const required = [
				"add",
				"find",
				"findOne",
				"update",
				"updateOne",
				"remove",
				"removeOne",
				"updateOneOrAdd",
				"toggleOne",
				"getCollections",
				"ensureCollection",
				"issetCollection",
				"removeCollection",
			];
			for (const method of required) {
				if (typeof (db as any)[method] !== "function")
					throw new Error(`Missing method: ${method}`);
			}
		},
	},
	{
		domain: "lifecycle",
		name: "emitter-exists",
		fn: async (db: ValtheraClass) => {
			if (!db.emitter)
				throw new Error("emitter: should exist on ValtheraClass");
		},
	},
];
