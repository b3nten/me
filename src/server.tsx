import { getModuleInfo } from "#vono/assets";
import { Hono } from "hono";
import { renderToString } from "solid-js/web";
import SolidApp from "./app";

const fonts = [
  <link
    rel="preload"
    as="font"
    type="font/woff2"
    crossOrigin="anonymous"
    href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhiI2B.woff2"
  />,
  <link
    rel="preload"
    as="font"
    type="font/woff2"
    crossOrigin="anonymous"
    href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
  />,
  <link
    rel="preload"
    as="font"
    type="font/woff2"
    crossOrigin="anonymous"
    href="https://fonts.gstatic.com/s/play/v19/6aez4K2oVqwIvtg2H68T.woff2"
  />,
  <link
    rel="preload"
    as="font"
    type="font/woff2"
    crossOrigin="anonymous"
    href="https://fonts.gstatic.com/s/play/v19/6aez4K2oVqwIvtU2Hw.woff2"
  />,
];

const resources = getModuleInfo("src/client.jsx");

const app = new Hono();

app.get("/posts/why-server-side-rendering-is-superior", c => {

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Why Server Side Rendering is Superior</title>`);
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/html",
    },
  });

})

app.get("*", async (c) => {
  const r = await resources;

  const head = [<script type="module" src={`/${r.file}`} />, ...fonts];

  if (r.css?.length > 0) {
    head.push(
      ...r.css.map((href) => (
        <link rel="stylesheet" href={`/${href}`} />
      )),
    );
  }

  if (r.assets?.length > 0) {
    head.push(
      ...r.assets.map((href) => (
        <script type="module" src={`/${href}`} />
      )),
    );
  }

  if (r.imports?.length > 0) {
    for await (const href of r.imports) {
      head.push(
        <script type="module" src={`/${(await getModuleInfo(href))?.file}`} />,
      );
    }
  }

  return c.html(
    renderToString(() => <SolidApp path={c.req.path} head={head} />),
  );
});

export default app.fetch;
