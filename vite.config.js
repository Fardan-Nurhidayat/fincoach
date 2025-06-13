import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: process.env.HOST_FE || "localhost",
    port: Number(process.env.PORT_FE) || 4000,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: process.env.HOST_FE || 'localhost',
      port: Number(process.env.PORT_FE) || 4000,
    },
  },
});
