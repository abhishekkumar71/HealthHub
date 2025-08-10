import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/me": "http://localhost:8080",
      "/my-sessions": "http://localhost:8080",
      "/login": "http://localhost:8080",
      "/register": "http://localhost:8080",
      "/newsession": "http://localhost:8080",
      "/drafts": "http://localhost:8080",
    },
  },
});
