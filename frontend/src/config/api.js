/**
 * API base URL for fetch().
 *
 * In Vite dev, default to same-origin (empty string) so requests go to
 * `http://localhost:5173/auth/...` and the dev server proxies to the backend.
 * That keeps the session cookie on the page origin so PATCH/profile and /me
 * always send credentials (cross-port :5173 → :3000 often does not).
 *
 * Set VITE_API_URL when the API is on another host (e.g. staging/production).
 */
const trimmed = import.meta.env.VITE_API_URL?.toString().trim();
const explicit =
  trimmed && trimmed.length > 0 ? trimmed.replace(/\/$/, "") : null;

const isLocalPort3000 =
  explicit &&
  /^https?:\/\/(localhost|127\.0\.0\.1):3000$/i.test(explicit);

export const API_BASE = import.meta.env.DEV
  ? isLocalPort3000 || explicit === null
    ? ""
    : explicit
  : explicit ?? "http://localhost:3000";
