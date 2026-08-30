/**
 * Clave de localStorage donde se guarda la decisión del usuario sobre cookies.
 *
 * Vive en un módulo propio porque la usan tres lugares que no se conocen entre sí:
 * el cargador de analytics en BaseLayout, el banner y la página de Política de
 * Cookies. Si estuviera escrita a mano en cada uno, un typo rompería el gating
 * en silencio y Analytics cargaría sin consentimiento.
 */
export const COOKIE_CONSENT_KEY = 'psm-cookie-consent';

export type CookieConsent = 'accepted' | 'rejected';
