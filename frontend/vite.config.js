import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Same-origin `/auth/*` in dev so the httpOnly session cookie (set on this origin)
    // is sent on PATCH /auth/profile and GET /auth/me. Direct :5173 → :3000 fetches
    // often omit the cookie (cross-site), which yields 401 "LOGIN TO CONTINUE".
    proxy: {
      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
