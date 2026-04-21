import type { TestDefinition } from "../types";

export const initTests: TestDefinition[] = [
    {
        domain: "init",
        name: "adapter-instantiation",
        fn: async (db: any) => {
            if (!db) throw new Error("ValtheraClass instance is null");
            if (typeof db.add !== "function") throw new Error("Missing add method");
            if (typeof db.find !== "function") throw new Error("Missing find method");
        },
    },
];
