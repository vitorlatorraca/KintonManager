import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

// Only load dotenv in development (Vercel provides env vars automatically)
// Vercel automatically provides environment variables, so we skip dotenv there
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  // Load dotenv asynchronously to avoid blocking
  import("dotenv").then((dotenv) => {
    dotenv.default.config();
  }).catch(() => {
    // dotenv not available, that's ok - Vercel provides env vars
  });
}

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
