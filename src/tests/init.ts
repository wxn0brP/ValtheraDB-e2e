import { ValtheraClass } from "@wxn0brp/db-core";
import type { TestDefinition } from "../types";

export const initTests: TestDefinition[] = [
	{
		domain: "init",
		name: "adapter-instantiation",
		fn: async (db: ValtheraClass) => {
			if (!db) throw new Error("ValtheraClass instance is null");
			if (typeof db.add !== "function") throw new Error("Missing add method");
			if (typeof db.find !== "function") throw new Error("Missing find method");
		},
	},
];
