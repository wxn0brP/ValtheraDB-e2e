import type { TestDefinition } from "../types";

export const eventsTests: TestDefinition[] = [
    {
        domain: "events",
        name: "events-fire-on-add",
        fn: async (db: any) => {
            await db.ensureCollection("items");
            let eventFired = false;
            db.emiter.on("*", () => {
                eventFired = true;
            });
            await db.add({ collection: "items", data: { val: 1 } });
            if (!eventFired) throw new Error("Event should fire after add");
        },
    },
];
