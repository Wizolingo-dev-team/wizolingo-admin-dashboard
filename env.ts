import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
		NEXTAUTH_SECRET: z.string().default("wizolingo-admin-secret-key"),
		NEXTAUTH_URL: z.string().url().default("http://localhost:3001"),
	},

	client: {
		NEXT_PUBLIC_ADMIN_API_BASE_URL: z
			.string()
			.regex(/^https?:\/\/.+/, "Invalid API base URL")
			.default("http://localhost:6000/api"),
	},

	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		NEXT_PUBLIC_ADMIN_API_BASE_URL:
			process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ?? "http://localhost:6000/api",
	},

	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});

export default env;
