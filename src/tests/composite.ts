import type { TestDefinition } from "../types";

export const compositeTests: TestDefinition[] = [
    {
        domain: "composite-operations",
        name: "updateOneOrAdd-update-existing",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { _id: "i1", val: 10 } });
            const result = await db.updateOneOrAdd({
                collection: "items",
                search: { _id: "i1" },
                updater: { val: 20 },
            });
            if (result.type !== "updated") throw new Error("updateOneOrAdd: expected type=updated");
            if (result.data.val !== 20) throw new Error("updateOneOrAdd: document not updated");
        },
    },
    {
        domain: "composite-operations",
        name: "updateOneOrAdd-add-new",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            const result = await db.updateOneOrAdd({
                collection: "items",
                search: { _id: "new" },
                updater: { val: 100 },
                add_arg: { _id: "new", val: 100 },
            });
            if (result.type !== "added") throw new Error("updateOneOrAdd: expected type=added");
        },
    },
    {
        domain: "composite-operations",
        name: "toggleOne-remove-existing",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { _id: "i1" } });
            const result = await db.toggleOne({ collection: "items", search: { _id: "i1" } });
            if (result.type !== "removed") throw new Error("toggleOne: expected type=removed for existing doc");
        },
    },
    {
        domain: "composite-operations",
        name: "toggleOne-add-new",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            const result = await db.toggleOne({
                collection: "items",
                search: { _id: "new" },
                data: { _id: "new", val: 1 },
            });
            if (result.type !== "added") throw new Error("toggleOne: expected type=added for new doc");
        },
    },
];
