import type { TestDefinition } from "../types";

export const removeTests: TestDefinition[] = [
    {
        domain: "crud-remove",
        name: "remove-all-matching",
        fn: async (db: any) => {
            await db.ensureCollection("users");
            await db.add({ collection: "users", data: { name: "A" } });
            await db.add({ collection: "users", data: { name: "A" } });
            await db.add({ collection: "users", data: { name: "B" } });
            const removed = await db.remove({ collection: "users", search: { name: "A" } });
            if (removed.length !== 2) throw new Error("Expected 2 removed documents, got: " + removed.length);
            const remaining = await db.find({ collection: "users" });
            if (remaining.length !== 1) throw new Error("Expected 1 remaining document");
        },
    },
    {
        domain: "crud-remove",
        name: "remove-no-matches-returns-empty",
        fn: async (db: any) => {
            await db.ensureCollection("users");
            const removed = await db.remove({ collection: "users", search: { name: "Nobody" } });
            if (!Array.isArray(removed)) throw new Error("remove must return an array");
            if (removed.length !== 0) throw new Error("Expected empty array");
        },
    },
    {
        domain: "crud-remove",
        name: "removeOne-with-match",
        fn: async (db: any) => {
            await db.ensureCollection("users");
            await db.add({ collection: "users", data: { _id: "u1", name: "Alice" } });
            const result = await db.removeOne({ collection: "users", search: { _id: "u1" } });
            if (!result) throw new Error("removeOne should return the document");
            if (result.name !== "Alice") throw new Error("Wrong document removed");
            const remaining = await db.find({ collection: "users" });
            if (remaining.length !== 0) throw new Error("Document should be removed");
        },
    },
    {
        domain: "crud-remove",
        name: "removeOne-without-match-returns-null",
        fn: async (db: any) => {
            await db.ensureCollection("users");
            const result = await db.removeOne({ collection: "users", search: { _id: "nonexistent" } });
            if (result !== null) throw new Error("removeOne should return null when no match");
        },
    },
];
