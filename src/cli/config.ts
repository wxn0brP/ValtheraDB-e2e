import type { SuiteConfig } from "../types";

export async function loadConfig(adapterDir: string): Promise<SuiteConfig | undefined> {
	const configPath = `${adapterDir}/valthera-e2e/config.json`;

	try {
		const file = Bun.file(configPath);
		if (!(await file.exists()))
			return undefined;

		const text = await file.text();
		const config = JSON.parse(text) as SuiteConfig;
		return config;
	} catch (err: any) {
		console.error(`Error: Failed to load config file: ${configPath}`);
		console.error(`  ${err.message ?? err}`);
		process.exit(1);
	}
}
