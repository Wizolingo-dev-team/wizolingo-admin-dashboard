import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src"),
			"@src": path.resolve(import.meta.dirname, "./src"),
			"@layouts": path.resolve(import.meta.dirname, "./src/layouts"),
			"@app": path.resolve(import.meta.dirname, "./src/app"),
			"@components": path.resolve(import.meta.dirname, "./src/components"),
			"@hooks": path.resolve(import.meta.dirname, "./src/hooks"),
			"@utils": path.resolve(import.meta.dirname, "./src/utils"),
			"@constants": path.resolve(import.meta.dirname, "./src/constants"),
			"@types": path.resolve(import.meta.dirname, "./src/types"),
		},
	},
	test: {
		environment: "jsdom",
		globals: false,
		css: false,
		setupFiles: ["./vitest.setup.ts"],
		pool: "threads",
		testTimeout: 30000,
		exclude: ["node_modules/**", "e2e/**", ".next/**"],
		env: {
			TZ: "UTC",
		},
	},
});

