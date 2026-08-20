import { ValtheraClass } from "@wxn0brp/db-core";
import type { TestDefinition } from "../types";
import { addTests } from "./add";
import { advancedAggregationsTests } from "./advanced-aggregations";
import { advancedEventsTests } from "./advanced-events";
import { collectionApiTests } from "./collection-api";
import { collectionMgmtTests } from "./collection-mgmt";
import { compositeTests } from "./composite";
import { concurrencyTests } from "./concurrency";
import { dataTypesTests } from "./data-types";
import { edgeTests } from "./edge";
import { eventsTests } from "./events";
import { findOpTests } from "./find-op";
import { initTests } from "./init";
import { operatorInteractionsTests } from "./operator-interactions";
import { removeTests } from "./remove";
import { searchOpTests } from "./search-op";
import { sortingEdgeCasesTests } from "./sorting-edge-cases";
import { updateTests } from "./update";
import { updateOpTests } from "./update-op";

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
	...dataTypesTests,
	...concurrencyTests,
	...advancedEventsTests,
	...operatorInteractionsTests,
	...advancedAggregationsTests,
	...sortingEdgeCasesTests,
];
