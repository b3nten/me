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
  ]
});
