import type { TestDomain } from "../types";
import type { runTests } from "../runner";

function formatDuration(ms: number): string {
	if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
	if (ms < 100) return `${ms.toFixed(2)}ms`;
	return `${ms.toFixed(1)}ms`;
}

export function printResults(result: Awaited<ReturnType<typeof runTests>>): void {
	console.log("");
	console.log("=".repeat(60));
	console.log(" E2E Test Results");
	console.log("=".repeat(60));
	console.log("");

	// Group by domain
	const byDomain = new Map<TestDomain, typeof result.results>();
	for (const r of result.results) {
		if (!byDomain.has(r.domain)) byDomain.set(r.domain, []);
		byDomain.get(r.domain)!.push(r);
	}

	for (const [domain, domainResults] of byDomain) {
		console.log(` 📁 ${domain}`);

		for (const r of domainResults) {
			const icon = r.status === "passed" ? "  💜" : r.status === "failed" ? "  ❌" : "  ⚙️";
			const color = r.status === "passed" ? "\x1b[32m" : r.status === "failed" ? "\x1b[31m" : "\x1b[33m";
			const reset = "\x1b[0m";

			console.log(`  ${color}${icon} ${r.name}${reset} (${formatDuration(r.duration)})`);

			if (r.status === "failed" && r.error)
				console.log(`    \x1b[31m${r.error}\x1b[0m`);
		}

		console.log("");
	}

	console.log("=".repeat(60));
	console.log(`
Total: ${result.total} |
\x1b[32mPassed: ${result.passed}\x1b[0m |
\x1b[31mFailed: ${result.failed}\x1b[0m |
\x1b[33mSkipped: ${result.skipped}\x1b[0m`
		.replaceAll("\n", " "));
	console.log("=".repeat(60));
	console.log("");
}
