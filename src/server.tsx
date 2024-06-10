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

const app = new Hono();

app.get("*", async (c) => {
  const resources = await getModuleInfo("src/client.jsx");

  const head = [<script type="module" src={`/${resources.file}`} />, ...fonts];

  if (resources.css?.length > 0) {
    head.push(
      ...resources.css.map((href) => (
        <link rel="stylesheet" href={`/${href}`} />
      )),
    );
  }

  if (resources.assets?.length > 0) {
    head.push(
      ...resources.assets.map((href) => (
        <script type="module" src={`/${href}`} />
      )),
    );
  }

  if (resources.imports?.length > 0) {
    for await (const href of resources.imports) {
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
