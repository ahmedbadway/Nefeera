import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages serves a project repo from https://<user>.github.io/Nefeera/,
  // so every built URL needs that prefix. Overridable for hosts that serve from
  // the domain root (Vercel, Netlify, a custom domain): BASE_PATH=/ npm run build
  //
  // Runtime asset paths from Content.js are joined to this at render time by
  // src/utils/ResolveAssetPath.js.
  base: process.env.BASE_PATH || "/Nefeera/",
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
  },
});
