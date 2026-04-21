import type { TestDefinition } from "../types";

export const updateOpTests: TestDefinition[] = [
    {
        domain: "update-operators",
        name: "inc-operator",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { _id: "i1", count: 10 } });
            const result = await db.updateOne({
                collection: "items",
                search: { _id: "i1" },
                updater: { $inc: { count: 5 } },
            });
            if (!result || result.count !== 15) throw new Error("$inc: expected count to be 15, got: " + result?.count);
        },
    },
    {
        domain: "update-operators",
        name: "unset-operator",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { _id: "i1", temp: "value" } });
            const result = await db.updateOne({
                collection: "items",
                search: { _id: "i1" },
                updater: { $unset: { temp: 1 } },
            });
            if (!result || "temp" in result) throw new Error("$unset: field should be removed");
        },
    },
    {
        domain: "update-operators",
        name: "push-operator",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { _id: "i1", tags: ["a"] } });
            const result = await db.updateOne({
                collection: "items",
                search: { _id: "i1" },
                updater: { $push: { tags: "b" } },
            });
            if (!result || !Array.isArray(result.tags) || result.tags.length !== 2) {
                throw new Error("$push: expected 2 tags, got: " + JSON.stringify(result?.tags));
            }
        },
    },
    {
        domain: "update-operators",
        name: "merge-operator",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { _id: "i1", settings: { theme: "light", lang: "en" } } });
            const result = await db.updateOne({
                collection: "items",
                search: { _id: "i1" },
                updater: { $merge: { settings: { theme: "dark" } } },
            });
            if (!result || result.settings.theme !== "dark" || result.settings.lang !== "en") {
                throw new Error("$merge: expected theme=dark, lang=en, got: " + JSON.stringify(result?.settings));
            }
        },
    },
    {
        domain: "update-operators",
        name: "update-via-function",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            await db.add({ collection: "items", data: { _id: "i1", val: 10 } });
            const updateFn = (doc: any) => {
                doc.val = doc.val * 2;
                return doc;
            };
            const result = await db.updateOne({
                collection: "items",
                search: { _id: "i1" },
                updater: updateFn,
            });
            if (!result || result.val !== 20) throw new Error("Function update: expected val=20, got: " + result?.val);
        },
    },
];
