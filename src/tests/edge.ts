import type { TestDefinition } from "../types";

export const edgeTests: TestDefinition[] = [
    {
        domain: "edge-cases",
        name: "empty-search-matches-all",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { val: 1 } });
            await db.add({ collection: "items", data: { val: 2 } });
            const results = await db.find({ collection: "items", search: {} });
            if (results.length !== 2) throw new Error("Empty search should match all documents");
        },
    },
    {
        domain: "edge-cases",
        name: "special-characters-in-data",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            const special = "Hello \"World\" <>&'";
            await db.add({ collection: "items", data: { text: special } });
            const result = await db.findOne({ collection: "items", search: { text: special } });
            if (!result || result.text !== special) throw new Error("Special characters not preserved");
        },
    },
    {
        domain: "edge-cases",
        name: "deeply-nested-objects",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            const nested = { a: { b: { c: { d: 42 } } } };
            await db.add({ collection: "items", data: { _id: "n1", ...nested } });
            const result = await db.findOne({ collection: "items", search: { _id: "n1" } });
            if (!result || result.a?.b?.c?.d !== 42) throw new Error("Nested object not preserved");
        },
    },
];
