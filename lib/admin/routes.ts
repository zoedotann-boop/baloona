/**
 * Admin route constants. Kept out of `access.ts` — which is `server-only` —
 * so client components can link to the login page without dragging the auth and
 * database modules into the browser bundle.
 */
export const ADMIN_LOGIN_PATH = "/admin/login"
