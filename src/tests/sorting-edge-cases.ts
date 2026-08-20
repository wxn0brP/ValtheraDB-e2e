import { ValtheraClass } from "@wxn0brp/db-core";
import type { TestDefinition } from "../types";

export const sortingEdgeCasesTests: TestDefinition[] = [
	{
		domain: "find-options",
		name: "sort-with-null-values",
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
					val: null,
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "3",
					val: 5,
				},
			});

			const results = await db.find({
				collection: "items",
				dbFindOpts: {
					sortBy: "val",
					sortAsc: true,
				},
			});

			if (results.length !== 3) throw new Error("Sort with null failed");
		},
	},
	{
		domain: "find-options",
		name: "sort-mixed-types",
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
					val: "5",
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "3",
					val: 20,
				},
			});

			const results = await db.find({
				collection: "items",
				dbFindOpts: {
					sortBy: "val",
					sortAsc: true,
				},
			});

			if (results.length !== 3) throw new Error("Sort with mixed types failed");
		},
	},
	{
		domain: "find-options",
		name: "sort-case-sensitivity",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					_id: "1",
					name: "alice",
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "2",
					name: "Bob",
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "3",
					name: "charlie",
				},
			});

			const results = await db.find({
				collection: "items",
				dbFindOpts: {
					sortBy: "name",
					sortAsc: true,
				},
			});

			if (results.length !== 3) throw new Error("Case-sensitive sort failed");
		},
	},
	{
		domain: "find-options",
		name: "sort-with-undefined-field",
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
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "3",
					val: 5,
				},
			});

			const results = await db.find({
				collection: "items",
				dbFindOpts: {
					sortBy: "val",
					sortAsc: true,
				},
			});

			if (results.length !== 3)
				throw new Error("Sort with undefined field failed");
		},
	},
	{
		domain: "find-options",
		name: "multi-sort-with-ties",
		fn: async (db: ValtheraClass) => {
			await db.ensureCollection("items");
			await db.add({
				collection: "items",
				data: {
					_id: "1",
					lastName: "Smith",
					age: 30,
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "2",
					lastName: "Smith",
					age: 25,
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "3",
					lastName: "Smith",
					age: 35,
				},
			});
			await db.add({
				collection: "items",
				data: {
					_id: "4",
					lastName: "Doe",
					age: 40,
				},
			});

			const results = await db.find({
				collection: "items",
				dbFindOpts: {
					sortBy: [
						{
							field: "lastName",
							asc: true,
						},
						{
							field: "age",
							asc: false,
						},
					],
				},
			});

			const smiths = results.filter((r: any) => r.lastName === "Smith");
			if (smiths[0].age !== 35 || smiths[1].age !== 30 || smiths[2].age !== 25)
				throw new Error("Multi-sort with ties failed");
		},
	},
];
