import { addTests } from "./add";
import { collectionApiTests } from "./collection-api";
import { collectionMgmtTests } from "./collection-mgmt";
import { compositeTests } from "./composite";
import { edgeTests } from "./edge";
import { eventsTests } from "./events";
import { findOpTests } from "./find-op";
import { initTests } from "./init";
import { removeTests } from "./remove";
import { searchOpTests } from "./search-op";
import { updateTests } from "./update";
import { updateOpTests } from "./update-op";
import type { TestDefinition } from "../types";

export const tests: TestDefinition[] = [
	...initTests,
	...collectionMgmtTests,
	...addTests,
	...updateTests,
	...removeTests,
	...searchOpTests,
	...updateOpTests,
	...findOpTests,
	...compositeTests,
	...edgeTests,
	...eventsTests,
	...collectionApiTests,
];
