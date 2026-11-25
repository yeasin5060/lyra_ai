import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  WEB_URL: z.string().url(),
  GEMINI_API_KEY: z.string().optional().default(""),
  ANTHROPIC_API_KEY: z.string().optional().default(""),
  DEFAULT_AI_MODEL: z.string().default("gemini-2.0-flash")
});

export const env = schema.parse(process.env);
