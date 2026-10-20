/**
 * Curated realistic sample configuration for the "Try sample" button.
 * Demonstrates mixed formats: standard dotenv, DevOps JSON lines, quoted secrets,
 * export prefix, YAML-style, and inline comments.
 */
export const SAMPLE_ENV_INPUT = `# Application configuration
PORT=8080
NODE_ENV=production
HOST = localhost # local bind

# DevOps exported credentials (quotes to clean)
"gemin_api_key ": "088w9eoundn"
"AWS_SECRET_ACCESS_KEY": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
"SENTRY_DSN": "https://examplePublicKey@o0.ingest.sentry.io/0"

# Service endpoints & databases
DATABASE_URL="postgresql://postgres:p@ssword123@db.prod.internal:5432/main?sslmode=require"
REDIS_URI='redis://default:s3cr3t_token@cache.internal:6379/0'

# Shell exports
export STRIPE_API_KEY=sk_live_51NzABC123XYZ
export JWT_SECRET="super-secure-jwt-secret-key-do-not-leak"

# Flag to verify hash inside quotes is kept
WEBHOOK_SECRET="whsec_abc123#def" # production webhook
`;
