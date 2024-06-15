import vono, { CloudflareAdaptor } from "@vonojs/core";
import tailwindcss from "@tailwindcss/vite";
import solid from "vite-plugin-solid";
import { defineConfig } from "vite";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

export default defineConfig({
  plugins: [
    {
      ...mdx({
        jsx: true,
        jsxImportSource: "solid-js",
        providerImportSource: "solid-mdx",
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      }), 
      enforce: "pre" 
    },
    solid({ ssr: true, babel: { minified: false, comments: true }, extensions: [".mdx"]}),
    tailwindcss(),
    vono({
      clientEntry: "src/client",
      serverEntry: "src/server",
      adaptor: new CloudflareAdaptor(),
    }),
  ]
});
 