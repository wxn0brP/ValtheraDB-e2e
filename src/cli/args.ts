import { parseArgs } from "node:util";
import type { TestDomain } from "../types";
import { VALID_DOMAINS } from "./constants";

export interface ParsedArgs {
	adapterPath: string;
	domains?: TestDomain[];
}

export function printHelp(): void {
	console.log(`
Usage: valthera-e2e [options] [adapter-path]

Options:
  -h, --help     		Show this help message
  -d, --domain <d>   	Run only specified domains (comma-separated)
	 Valid: ${VALID_DOMAINS.join(", ")}
  -e, --exclude <e> 	Exclude specified domains (comma-separated)

Examples:
  valthera-e2e ./valthera-e2e/index.ts
  valthera-e2e -d crud-add,crud-read ./valthera-e2e/index.ts
  valthera-e2e -h
`.trim());
}

export function getArgs(): ParsedArgs {
	const args = Bun.argv.slice(2);

	const { values, positionals } = parseArgs({
		args,
		options: {
			domain: {
				type: "string",
				short: "d",
			},
			help: {
				type: "boolean",
				short: "h",
			},
			exclude: {
				type: "string",
				short: "e",
			}
		},
		strict: true,
		allowPositionals: true,
	});

	if (values.help) {
		printHelp();
		process.exit(0);
	}

	let adapterPath = "./valthera-e2e/index.ts";
	let domains: TestDomain[] | undefined;

	if (positionals.length > 0)
		adapterPath = positionals[0] as string;

	if (values.domain) {
		const domainValues = values.domain.split(",");
		const parsed: TestDomain[] = [];
		for (const d of domainValues) {
			const trimmed = d.trim() as TestDomain;
			if (!VALID_DOMAINS.includes(trimmed)) {
				console.error(`Error: Unknown domain "${trimmed}". Valid domains: ${VALID_DOMAINS.join(", ")}`);
				process.exit(1);
			}
			parsed.push(trimmed);
		}
		domains = parsed;
	}

	if (values.exclude) {
		const excludeValues = values.exclude.split(",");
		const parsed: TestDomain[] = [];
		for (const d of excludeValues) {
			const trimmed = d.trim() as TestDomain;
			if (!VALID_DOMAINS.includes(trimmed)) {
				console.error(`Error: Unknown domain "${trimmed}". Valid domains: ${VALID_DOMAINS.join(", ")}`);
				process.exit(1);
			}
			parsed.push(trimmed);
		}
		domains = (domains?.length ? domains : VALID_DOMAINS).filter((d) => !parsed.includes(d));
	}

	return { adapterPath, domains };
}
