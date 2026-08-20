import { ValtheraClass } from "@wxn0brp/db-core";
import type { TestDefinition } from "../types";

export const advancedEventsTests: TestDefinition[] = [
	{
		domain: "events",
		name: "events-payload-correctness",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");

			let capturedQuery: any = null;
			let capturedResult: any = null;

			const unsubscribe = db.emitter.on("add", (query, result) => {
				capturedQuery = query;
				capturedResult = result;
			});

			await db.add({
				collection: "items",
				data: {
					val: 42,
				},
			});

			if (!capturedQuery) throw new Error("Event query payload missing");
			if (capturedQuery.collection !== "items")
				throw new Error("Event query collection mismatch");
			if (!capturedResult || capturedResult.val !== 42)
				throw new Error("Event result payload mismatch");

			unsubscribe();
		},
	},
	{
		domain: "events",
		name: "events-order-for-updateOneOrAdd",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");

			const events: string[] = [];

			const unsubscribe = db.emitter.on("*", op => {
				events.push(op);
			});

			await db.updateOneOrAdd({
				collection: "items",
				search: {
					_id: "new",
				},
				updater: {
					val: 1,
				},
				add_arg: {
					_id: "new",
					val: 1,
				},
			});

			if (!events.includes("add") && !events.includes("updateOneOrAdd"))
				throw new Error("updateOneOrAdd should fire appropriate event");

			unsubscribe();
		},
	},
	{
		domain: "events",
		name: "events-unsubscribe-works",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");

			let callCount = 0;

			const unsubscribe = db.emitter.on("add", () => {
				callCount++;
			});

			await db.add({
				collection: "items",
				data: {
					val: 1,
				},
			});
			unsubscribe();
			await db.add({
				collection: "items",
				data: {
					val: 2,
				},
			});

			if (callCount !== 1)
				throw new Error("Unsubscribe should stop event listener");
		},
	},
	{
		domain: "events",
		name: "wildcard-event-captures-all",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");

			const capturedOps: string[] = [];

			const unsubscribe = db.emitter.on("*", op => {
				capturedOps.push(op);
			});

			await db.add({
				collection: "items",
				data: {
					val: 1,
				},
			});
			await db.find({
				collection: "items",
			});
			await db.updateOne({
				collection: "items",
				search: {
					val: 1,
				},
				updater: {
					val: 2,
				},
			});
			await db.removeOne({
				collection: "items",
				search: {
					val: 2,
				},
			});

			const expectedOps = [
				"add",
				"find",
				"updateOne",
				"removeOne",
			];
			for (const op of expectedOps) {
				if (!capturedOps.includes(op))
					throw new Error(`Wildcard should capture ${op}`);
			}

			unsubscribe();
		},
	},
	{
		domain: "events",
		name: "multiple-listeners-same-event",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");

			let count1 = 0;
			let count2 = 0;

			const unsub1 = db.emitter.on("add", () => {
				count1++;
			});
			const unsub2 = db.emitter.on("add", () => {
				count2++;
			});

			await db.add({
				collection: "items",
				data: {
					val: 1,
				},
			});

			if (count1 !== 1 || count2 !== 1)
				throw new Error("Multiple listeners should all fire");

			unsub1();
			unsub2();
		},
	},
];
