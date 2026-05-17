#!/usr/bin/env bun

import { loadAdapter, validateAdapterFactory } from "./cli/adapter";
import { getArgs } from "./cli/args";
import { loadConfig } from "./cli/config";
import { printResults } from "./cli/reporter";
import { runTests } from "./runner";
import type { RunnerOptions } from "./types";

async function main() {
	const { adapterPath, domains, tests } = getArgs();

	console.log("");
	console.log("/==========================================================\\");
	console.log("|               Valthera E2E Test Runner                    |");
	console.log("\\==========================================================/");
	console.log("");
	console.log(`  Adapter: ${adapterPath}`);
	if (domains)
		console.log(`  Domains: ${domains.join(", ")}`);
	else
		console.log("  Domains: all");

	if (tests)
		console.log(`  Tests: ${tests.join(", ")}`);

	const adapterFactory = await loadAdapter(adapterPath);

	// Determine adapter directory for config resolution
	const resolved = adapterPath.startsWith(".") ? `${process.cwd()}/${adapterPath}` : adapterPath;
	const adapterDir = resolved.substring(0, resolved.lastIndexOf("/"));

	const config = await loadConfig(adapterDir);

	if (config?.skip?.domains)
		console.log(`  Skipped domains: ${config.skip.domains.join(", ")}`);

	if (config?.skip?.tests)
		console.log(`  Skipped tests: ${config.skip.tests.join(", ")}`);

	console.log("");
	console.log("  Running tests...");

	await validateAdapterFactory(adapterFactory);

	const opts: RunnerOptions = {
		domains,
		tests,
		config,
	};

	const result = await runTests(adapterFactory, opts);

	printResults(result);

	if (result.failed > 0) {
		console.log("\x1b[31m  ❌ Some tests failed\x1b[0m\n");
		process.exit(1);
	} else {
		console.log("\x1b[32m  ✅ All tests passed\x1b[0m\n");
		process.exit(0);
	}
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
