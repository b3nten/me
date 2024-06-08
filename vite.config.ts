import vono, { CloudflareAdaptor } from "@vonojs/core";
import tailwindcss from "@tailwindcss/vite";
import solid from "vite-plugin-solid";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    solid({ ssr: true, babel: { minified: false, comments: true } }),
    tailwindcss(),
    vono({
      clientEntry: "src/client",
      serverEntry: "src/server",
      adaptor: new CloudflareAdaptor(),
      includeIndexHtml: true,
    }),
  ],
  build: {
    minify: false,
    cssMinify: true,
    target: "es2022",
    rollupOptions: {
      output: {
        format: "es",
        manualChunks: (id) => {
          if (id.includes("src/settings.tsx")) return "settings";
          if (id.endsWith("src/toolkit.ts")) return "toolkit";
          if (id.endsWith("src/webgl/background.js")) return "background";
        },
      },
    },
  },
});
