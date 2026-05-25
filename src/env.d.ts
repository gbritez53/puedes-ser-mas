/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly TURSO_DATABASE_URL: string;
  readonly TURSO_AUTH_TOKEN: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_GA_ID: string | undefined;
  readonly ADMISSION_RATE_LIMIT_PER_HOUR: string | undefined;
  readonly IP_HASH_SALT: string | undefined;
  readonly NODE_ENV: 'development' | 'production' | 'test';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
