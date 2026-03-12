import { z } from "zod";

const envSchema = z.object({
	CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
	CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1),
	CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1),

	VERCEL_PROJECT_PRODUCTION_URL: z.url(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
	const result = envSchema.safeParse(env);

	if (!result.success) {
		const formatted = result.error.issues
			.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
			.join("\n");

		console.error(`\n❌ Invalid environment variables:\n${formatted}\n`);
		process.exit(1);
	}

	return result.data;
}

export const env = validateEnv();
