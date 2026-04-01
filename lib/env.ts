import { z } from "zod";

const envSchema = z.object({
	// R2 credentials — optional so builds succeed without them (CI, local dev without photos)
	CLOUDFLARE_ACCOUNT_ID: z.string().min(1).optional(),
	CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1).optional(),
	CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),

	// Strava API — optional so builds succeed without them (local dev, CI)
	STRAVA_CLIENT_ID: z.string().min(1).optional(),
	STRAVA_CLIENT_SECRET: z.string().min(1).optional(),
	STRAVA_REFRESH_TOKEN: z.string().min(1).optional(),

	// Mapbox — public token for client-side map rendering
	NEXT_PUBLIC_MAPBOX_TOKEN: z.string().min(1).optional(),

	// Automatically set by Vercel — optional for local dev and CI
	VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
	const result = envSchema.safeParse(process.env);

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
