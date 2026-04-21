import type { TestDefinition } from "../types";

export const findOpTests: TestDefinition[] = [
    {
        domain: "find-options",
        name: "dbFindOpts-limit",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { val: 1 } });
            await db.add({ collection: "items", data: { val: 2 } });
            await db.add({ collection: "items", data: { val: 3 } });
            const results = await db.find({ collection: "items", dbFindOpts: { limit: 2 } });
            if (results.length !== 2) throw new Error("limit: expected 2 results, got: " + results.length);
        },
    },
    {
        domain: "find-options",
        name: "dbFindOpts-sortBy",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { val: 3 } });
            await db.add({ collection: "items", data: { val: 1 } });
            await db.add({ collection: "items", data: { val: 2 } });
            const results = await db.find({ collection: "items", dbFindOpts: { sortBy: "val", sortAsc: true } });
            if (results[0].val !== 1 || results[1].val !== 2 || results[2].val !== 3) {
                throw new Error("sortBy: results not sorted ascending");
            }
        },
    },
    {
        domain: "find-options",
        name: "findOpts-select",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { a: 1, b: 2, c: 3 } });
            const results = await db.find({ collection: "items", findOpts: { select: ["a", "b"] } });
            if (results.length !== 1) throw new Error("select: expected 1 result");
            if (!("a" in results[0]) || !("b" in results[0]) || "c" in results[0]) {
                throw new Error("select: should only include a and b");
            }
        },
    },
];
