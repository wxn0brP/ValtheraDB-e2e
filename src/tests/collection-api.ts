import type { TestDefinition } from "../types";

export const collectionApiTests: TestDefinition[] = [
    {
        domain: "collection-api",
        name: "collection-add",
        fn: async (db: any) => {
            const coll = db.c("items");
            const doc = await coll.add({ val: 1 });
            if (!doc._id) throw new Error("Collection.add should return document with _id");
            if (doc.val !== 1) throw new Error("Collection.add: data mismatch");
        },
    },
    {
        domain: "collection-api",
        name: "collection-find",
        fn: async (db: any) => {
            const coll = db.c("items");
            await coll.add({ val: 1 });
            await coll.add({ val: 2 });
            const results = await coll.find();
            if (results.length !== 2) throw new Error("Collection.find: expected 2 results");
        },
    },
    {
        domain: "collection-api",
        name: "collection-findOne",
        fn: async (db: any) => {
            const coll = db.c("items");
            await coll.add({ _id: "c1", val: 1 });
            const result = await coll.findOne({ _id: "c1" });
            if (!result || result.val !== 1) throw new Error("Collection.findOne: wrong result");
        },
    },
    {
        domain: "collection-api",
        name: "collection-updateOne",
        fn: async (db: any) => {
            const coll = db.c("items");
            await coll.add({ _id: "c1", val: 10 });
            const result = await coll.updateOne({ _id: "c1" }, { val: 20 });
            if (!result || result.val !== 20) throw new Error("Collection.updateOne: update failed");
        },
    },
    {
        domain: "collection-api",
        name: "collection-removeOne",
        fn: async (db: any) => {
            const coll = db.c("items");
            await coll.add({ _id: "c1", val: 1 });
            const removed = await coll.removeOne({ _id: "c1" });
            if (!removed) throw new Error("Collection.removeOne: should return document");
            const remaining = await coll.find();
            if (remaining.length !== 0) throw new Error("Collection.removeOne: document not removed");
        },
    },
];
