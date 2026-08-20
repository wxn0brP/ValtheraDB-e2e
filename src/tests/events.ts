import { ValtheraClass } from "@wxn0brp/db-core";
import type { TestDefinition } from "../types";

export const eventsTests: TestDefinition[] = [
	{
		domain: "events",
		name: "events-fire-on-add",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			let eventFired = false;
			db.emitter.on("*", () => {
				eventFired = true;
			});
			await db.add({
				collection: "items",
				data: {
					val: 1,
				},
			});
			if (!eventFired) throw new Error("Event should fire after add");
		},
	},
	{
		domain: "events",
		name: "events-payload-verification",
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
					val: 99,
				},
			});

			if (!capturedQuery || capturedQuery.collection !== "items")
				throw new Error("Event query payload mismatch");
			if (!capturedResult || capturedResult.val !== 99)
				throw new Error("Event result payload mismatch");

			unsubscribe();
		},
	},
	{
		domain: "events",
		name: "events-wildcard-fires-for-all",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			const firedOps: string[] = [];

			const unsubscribe = db.emitter.on("*", op => {
				firedOps.push(op);
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

			if (!firedOps.includes("add") || !firedOps.includes("find"))
				throw new Error("Wildcard event did not capture all operations");

			unsubscribe();
		},
	},
];
