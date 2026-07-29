import { access, readFile } from "fs/promises";
import type { SuiteConfig } from "../types";

export async function loadConfig(
	adapterDir: string,
): Promise<SuiteConfig | undefined> {
	const configPath = `${adapterDir}/config.json`;

	try {
		await access(configPath);
	} catch {
		return undefined;
	}

	try {
		const text = await readFile(configPath, "utf-8");
		const config = JSON.parse(text) as SuiteConfig;
		return config;
	} catch (err: any) {
		console.error(`Error: Failed to load config file: ${configPath}`);
		console.error(`  ${err.message ?? err}`);
		process.exit(1);
	}
}
