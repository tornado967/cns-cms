import { test } from "node:test";
import assert from "node:assert/strict";
import { validateDeployment } from "./render-preflight.mjs";
const valid = () => ({
  PUBLIC_URL: "https://cns-test.onrender.com", SECRET: "x".repeat(48),
  ADMIN_EMAIL: "owner@example.com", ADMIN_PASSWORD: "x".repeat(24),
  DB_CLIENT: "pg", DB_HOST: "aws-0-eu-central-1.pooler.supabase.com",
  DB_PORT: "5432", DB_USER: "cns_cms.akukwsxssjhuvcuvonhq", DB_PASSWORD: "test-only",
  DB_SEARCH_PATH: "cns_cms", DB_SSL: "true", DB_SSL__REJECT_UNAUTHORIZED: "true",
  DB_SSL__CA: "test-only-certificate-placeholder",
  STORAGE_LOCATIONS: "supabase", STORAGE_SUPABASE_DRIVER: "s3",
  STORAGE_SUPABASE_BUCKET: "cns-media", STORAGE_SUPABASE_REGION: "eu-central-1",
  STORAGE_SUPABASE_ENDPOINT: "https://akukwsxssjhuvcuvonhq.storage.supabase.co/storage/v1/s3",
  STORAGE_SUPABASE_FORCE_PATH_STYLE: "true", STORAGE_SUPABASE_KEY: "test-only",
  STORAGE_SUPABASE_SECRET: "test-only", CORS_CREDENTIALS: "false", CORS_ORIGIN: "https://example.com",
});
test("accepts the intended private-storage, verified-TLS configuration", () => {
  assert.doesNotThrow(() => validateDeployment(valid()));
});
test("rejects absent secrets without including secret values in errors", () => {
  const env = valid(); delete env.DB_PASSWORD;
  assert.throws(() => validateDeployment(env), /Missing server setting: DB_PASSWORD/);
});
test("rejects insecure or unintended deployment settings", () => {
  for (const [key, value] of Object.entries({
    PUBLIC_URL: "http://example.com", DB_USER: "postgres.akukwsxssjhuvcuvonhq",
    DB_SEARCH_PATH: "public", DB_PORT: "6543", DB_SSL__REJECT_UNAUTHORIZED: "false",
    STORAGE_LOCATIONS: "local", STORAGE_SUPABASE_BUCKET: "public",
    CORS_ORIGIN: "*", CORS_CREDENTIALS: "true",
  })) assert.throws(() => validateDeployment({ ...valid(), [key]: value }), key);
});
