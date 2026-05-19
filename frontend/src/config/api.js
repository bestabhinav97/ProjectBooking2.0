/** Backend API base (Vite: set VITE_API_URL in .env if needed). */
export const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";
