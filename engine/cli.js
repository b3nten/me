import * as esbuild from "esbuild";
import * as fs from "fs/promises";
import { dtsPlugin } from "esbuild-plugin-d.ts";

async function dev(){
	const ctx = await esbuild.context({
		entryPoints: ["./mod.ts"],
		outdir: "./.build",
		minify: false,
		target: "es2020",
		format: "esm",
		plugins: [dtsPlugin()],
		logLevel: "debug",
	});
	await ctx.watch();
}

async function build(){
	await fs.rm("./.build", { recursive: true }).catch(() => {});
	console.log("Building...");
	const t = performance.now();
	await esbuild.build({
		entryPoints: ["./mod.ts"],
		outdir: "./.build",
		minify: false,
		target: "es2020",
		format: "esm",
		plugins: [dtsPlugin()],
	});
	console.log("Build completed in", (performance.now() - t).toFixed(0), "ms");
}

if(process.argv[2] === 'build'){
	build()
}else {
	dev()
}
