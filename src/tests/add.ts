import type { TestDefinition } from "../types";

export const addTests: TestDefinition[] = [
    {
        domain: "crud-add",
        name: "add-with-auto-string-id",
        fn: async (db: any) => {
            await db.ensureCollection("users");
            const doc = await db.add({ collection: "users", data: { name: "John" } });
            if (!doc._id) throw new Error("Document should have auto-generated _id");
            if (typeof doc._id !== "string") throw new Error("Auto-generated _id should be a string");
            if (doc.name !== "John") throw new Error("Document data mismatch");
        },
    },
    {
        domain: "crud-add",
        name: "add-with-id-gen-false",
        fn: async (db: any) => {
            await db.ensureCollection("test");
            const doc = await db.add({ collection: "test", data: { name: "NoId" }, id_gen: false });
            if (doc._id !== undefined) throw new Error("Document should not have _id when id_gen: false");
        },
    },
    {
        domain: "crud-add",
        name: "add-with-manual-id",
        fn: async (db: any) => {
            await db.ensureCollection("test");
            const doc = await db.add({ collection: "test", data: { _id: "custom-id", name: "Manual" } });
            if (doc._id !== "custom-id") throw new Error("Document should have manual _id");
        },
    },

    // === 4. Basic CRUD - Read ===
    {
        domain: "crud-read",
        name: "find-all-documents",
        fn: async (db: any) => {
            await db.ensureCollection("users");
            await db.add({ collection: "users", data: { name: "A" } });
            await db.add({ collection: "users", data: { name: "B" } });
            const results = await db.find({ collection: "users" });
            if (results.length !== 2) throw new Error("Expected 2 documents, got: " + results.length);
        },
    },
    {
        domain: "crud-read",
        name: "find-with-exact-match",
        fn: async (db: any) => {
            await db.ensureCollection("users");
            await db.add({ collection: "users", data: { name: "Alice" } });
            await db.add({ collection: "users", data: { name: "Bob" } });
            const results = await db.find({ collection: "users", search: { name: "Alice" } });
            if (results.length !== 1) throw new Error("Expected 1 document");
            if (results[0].name !== "Alice") throw new Error("Wrong document returned");
        },
    },
    {
        domain: "crud-read",
        name: "find-with-no-matches",
        fn: async (db: any) => {
            await db.ensureCollection("users");
            const results = await db.find({ collection: "users", search: { name: "Nobody" } });
            if (!Array.isArray(results)) throw new Error("find must return an array");
            if (results.length !== 0) throw new Error("Expected empty array");
        },
    },
    {
        domain: "crud-read",
        name: "findOne-with-match",
        fn: async (db: any) => {
            await db.ensureCollection("users");
            await db.add({ collection: "users", data: { name: "Alice" } });
            const result = await db.findOne({ collection: "users", search: { name: "Alice" } });
            if (!result) throw new Error("findOne should return a document");
            if (result.name !== "Alice") throw new Error("Wrong document returned");
        },
    },
    {
        domain: "crud-read",
        name: "findOne-without-match-returns-null",
        fn: async (db: any) => {
            await db.ensureCollection("users");
            const result = await db.findOne({ collection: "users", search: { name: "Nobody" } });
            if (result !== null) throw new Error("findOne should return null when no match");
        },
    },
];
