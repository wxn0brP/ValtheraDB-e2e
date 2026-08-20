import { ValtheraClass } from "@wxn0brp/db-core";
import type { TestDefinition } from "../types";

export const dataTypesTests: TestDefinition[] = [
	{
		domain: "edge-cases",
		name: "null-values-in-search",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					_id: "1",
					val: null,
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "2",
					val: "text",
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "3",
					val: 0,
				},
			});

			const results = await db.find<any>({
				collection: "items",
				search: {
					val: null,
				},
			});

			if (results.length !== 1) throw new Error("Search for null failed");
			if (results[0]._id !== "1")
				throw new Error("Wrong document matched for null");
		},
	},
	{
		domain: "edge-cases",
		name: "undefined-vs-null-distinction",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					_id: "1",
					val: null,
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "2",
				},
			});

			const nullResults = await db.find({
				collection: "items",
				search: {
					val: null,
				},
			});

			const existsResults = await db.find({
				collection: "items",
				search: {
					$exists: {
						val: false,
					},
				},
			});

			if (nullResults.length !== 1)
				throw new Error("null search should match only null");
			if (existsResults.length !== 1)
				throw new Error("$exists false should match undefined");
		},
	},
	{
		domain: "edge-cases",
		name: "boolean-type-coercion",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					_id: "1",
					active: true,
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "2",
					active: false,
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "3",
					active: 1,
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "4",
					active: 0,
				},
			});

			const boolResults = await db.find<any>({
				collection: "items",
				search: {
					active: true,
				},
			});

			if (boolResults.length !== 1)
				throw new Error("Boolean search should not match numbers");
			if (boolResults[0]._id !== "1")
				throw new Error("Wrong document matched for boolean");
		},
	},
	{
		domain: "edge-cases",
		name: "empty-string-vs-null",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					_id: "1",
					name: "",
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "2",
					name: null,
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "3",
				},
			});

			const emptyResults = await db.find<any>({
				collection: "items",
				search: {
					name: "",
				},
			});

			if (emptyResults.length !== 1)
				throw new Error("Empty string search should match only empty strings");
			if (emptyResults[0]._id !== "1")
				throw new Error("Wrong document matched for empty string");
		},
	},
	{
		domain: "edge-cases",
		name: "number-string-comparison",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					_id: "1",
					val: 10,
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "2",
					val: "10",
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "3",
					val: 5,
				},
			});

			const numResults = await db.find<any>({
				collection: "items",
				search: {
					$gt: {
						val: 7,
					},
				},
			});

			if (numResults.length !== 1)
				throw new Error("Numeric comparison should not match strings");
			if (numResults[0]._id !== "1")
				throw new Error("Wrong document matched for numeric comparison");
		},
	},
	{
		domain: "edge-cases",
		name: "array-with-null-elements",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					_id: "1",
					tags: [
						"a",
						null,
						"b",
					],
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "2",
					tags: [
						"a",
						"b",
					],
				},
			});

			const results = await db.find({
				collection: "items",
				search: {
					$arrinc: {
						tags: [
							"a",
						],
					},
				},
			});

			if (results.length !== 2)
				throw new Error("$arrinc should match arrays with null elements");
		},
	},
	{
		domain: "edge-cases",
		name: "nested-null-in-objects",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					_id: "1",
					user: {
						name: "John",
						email: null,
					},
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "2",
					user: {
						name: "Jane",
					},
				},
			});

			const results = await db.find<any>({
				collection: "items",
				search: {
					user: {
						email: null,
					},
				},
			});

			if (results.length !== 1) throw new Error("Nested null search failed");
			if (results[0]._id !== "1")
				throw new Error("Wrong document matched for nested null");
		},
	},
	{
		domain: "edge-cases",
		name: "zero-vs-falsy-values",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					_id: "1",
					count: 0,
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "2",
					count: null,
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "3",
				},
			});

			const zeroResults = await db.find<any>({
				collection: "items",
				search: {
					count: 0,
				},
			});

			if (zeroResults.length !== 1)
				throw new Error("Zero search should match only 0, not null/undefined");
			if (zeroResults[0]._id !== "1")
				throw new Error("Wrong document matched for zero");
		},
	},
];
