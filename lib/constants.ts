import { env } from "./env";

const rawUrl = env.VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL = rawUrl ? `https://${rawUrl}` : "https://adrianlam.sh";
