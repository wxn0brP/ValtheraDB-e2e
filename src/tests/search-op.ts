import type { TestDefinition } from "../types";

export const searchOpTests: TestDefinition[] = [
    {
        domain: "search-operators",
        name: "comparison-gt",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { val: 5 } });
            await db.add({ collection: "items", data: { val: 10 } });
            await db.add({ collection: "items", data: { val: 15 } });
            const results = await db.find({ collection: "items", search: { $gt: { val: 7 } } });
            if (results.length !== 2) throw new Error("$gt: expected 2 results, got: " + results.length);
        },
    },
    {
        domain: "search-operators",
        name: "comparison-lt",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { val: 5 } });
            await db.add({ collection: "items", data: { val: 10 } });
            await db.add({ collection: "items", data: { val: 15 } });
            const results = await db.find({ collection: "items", search: { $lt: { val: 12 } } });
            if (results.length !== 2) throw new Error("$lt: expected 2 results, got: " + results.length);
        },
    },
    {
        domain: "search-operators",
        name: "comparison-in",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { status: "a" } });
            await db.add({ collection: "items", data: { status: "b" } });
            await db.add({ collection: "items", data: { status: "c" } });
            const results = await db.find({ collection: "items", search: { $in: { status: ["a", "c"] } } });
            if (results.length !== 2) throw new Error("$in: expected 2 results, got: " + results.length);
        },
    },
    {
        domain: "search-operators",
        name: "exists-true",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { name: "A", extra: 1 } });
            await db.add({ collection: "items", data: { name: "B" } });
            const results = await db.find({ collection: "items", search: { $exists: { extra: true } } });
            if (results.length !== 1) throw new Error("$exists: expected 1 result");
        },
    },
    {
        domain: "search-operators",
        name: "exists-false",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { name: "A", extra: 1 } });
            await db.add({ collection: "items", data: { name: "B" } });
            const results = await db.find({ collection: "items", search: { $exists: { extra: false } } });
            if (results.length !== 1) throw new Error("$exists false: expected 1 result");
        },
    },
    {
        domain: "search-operators",
        name: "and-operator",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { a: 1, b: 2 } });
            await db.add({ collection: "items", data: { a: 1, b: 3 } });
            await db.add({ collection: "items", data: { a: 2, b: 2 } });
            const results = await db.find({
                collection: "items",
                search: { $and: [{ a: 1 }, { b: 2 }] },
            });
            if (results.length !== 1) throw new Error("$and: expected 1 result, got: " + results.length);
        },
    },
    {
        domain: "search-operators",
        name: "search-via-function",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { val: 5 } });
            await db.add({ collection: "items", data: { val: 15 } });
            const searchFn = (doc: any) => doc.val > 10;
            const results = await db.find({ collection: "items", search: searchFn });
            if (results.length !== 1) throw new Error("Function search: expected 1 result");
            if (results[0].val !== 15) throw new Error("Function search: wrong document returned");
        },
    },
];
