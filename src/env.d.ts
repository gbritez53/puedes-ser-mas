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

/** API que expone CookieBanner para leer y cambiar el consentimiento de cookies. */
interface PsmCookiesApi {
  readonly current: 'accepted' | 'rejected' | null;
  accept(): void;
  reject(): void;
  /** Borra la decisión y vuelve a mostrar el banner. */
  reopen(): void;
}

interface Window {
  psmCookies?: PsmCookiesApi;
  /** Carga Google Analytics. Solo la define BaseLayout si hay PUBLIC_GA_ID. */
  __psmLoadAnalytics?: () => void;
}
