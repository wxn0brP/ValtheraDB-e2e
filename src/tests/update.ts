import type { TestDefinition } from "../types";

export const updateTests: TestDefinition[] = [
    {
        domain: "crud-update",
        name: "update-all-matching",
        fn: async (db: any) => {
            await db.ensureCollection("users");
            await db.add({ collection: "users", data: { name: "A", age: 10 } });
            await db.add({ collection: "users", data: { name: "A", age: 20 } });
            await db.add({ collection: "users", data: { name: "B", age: 30 } });
            const updated = await db.update({
                collection: "users",
                search: { name: "A" },
                updater: { age: 100 },
            });
            if (updated.length !== 2) throw new Error("Expected 2 updated documents, got: " + updated.length);
            if (updated.some((d: any) => d.age !== 100)) throw new Error("Update did not change all documents");
        },
    },
    {
        domain: "crud-update",
        name: "update-no-matches-returns-empty",
        fn: async (db: any) => {
            await db.ensureCollection("users");
            const updated = await db.update({
                collection: "users",
                search: { name: "Nobody" },
                updater: { age: 100 },
            });
            if (!Array.isArray(updated)) throw new Error("update must return an array");
            if (updated.length !== 0) throw new Error("Expected empty array");
        },
    },
    {
        domain: "crud-update",
        name: "updateOne-with-match",
        fn: async (db: any) => {
            await db.ensureCollection("users");
            await db.add({ collection: "users", data: { _id: "u1", name: "Alice" } });
            const result = await db.updateOne({
                collection: "users",
                search: { _id: "u1" },
                updater: { name: "Bob" },
            });
            if (!result) throw new Error("updateOne should return the document");
            if (result.name !== "Bob") throw new Error("Document not updated");
        },
    },
    {
        domain: "crud-update",
        name: "updateOne-without-match-returns-null",
        fn: async (db: any) => {
            await db.ensureCollection("users");
            const result = await db.updateOne({
                collection: "users",
                search: { _id: "nonexistent" },
                updater: { name: "Bob" },
            });
            if (result !== null) throw new Error("updateOne should return null when no match");
        },
    },
];
