import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3001";
const IS_REMOTE_TARGET = Boolean(process.env.PLAYWRIGHT_BASE_URL);

export default defineConfig({
	testDir: "./e2e",
	timeout: 60_000,
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: [["list"], ["html", { open: "never" }]],
	use: {
		baseURL: BASE_URL,
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "e2e",
			testMatch: /.*\.e2e\.spec\.ts/,
			use: {
				...devices["Desktop Chrome"],
				channel: process.env.CI ? undefined : "chrome",
			},
		},
		{
			name: "perf",
			testMatch: /.*\.perf\.spec\.ts/,
			use: {
				...devices["Desktop Chrome"],
				channel: process.env.CI ? undefined : "chrome",
			},
		},
	],
	webServer: IS_REMOTE_TARGET
		? undefined
		: {
				command: process.env.CI ? "npm run start" : "npm run dev",
				url: BASE_URL,
				reuseExistingServer: !process.env.CI,
				timeout: 120_000,
			},
});

