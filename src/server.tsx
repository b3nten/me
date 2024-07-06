import { getModuleInfo } from "#vono/assets";
import { Hono } from "hono";
import { stream } from 'hono/streaming'
import { renderToString } from "solid-js/web";
import SolidApp from "./app";

const fonts = [
  <link
    rel="preload"
    as="font"
    type="font/ttf"
    crossOrigin="anonymous"
    href="/Domine.ttf"
  />,
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

  return stream(c, async (stream) => {
    await stream.writeln('<title>Why Server-Side Rendering is Superior</title>')
    await stream.writeln(`<meta property="og:type" content="article">
<meta property="og:title" content="Why SSR is better than SPA">
<meta property="og:url" content="https://benten.garden/posts/why-server-side-rendering-is-superior">
<meta property="og:image" content="https://miro.medium.com/v2/resize:fit:720/format:webp/1*CgrMqqxMCltl4BVjGgFRKA.png">
<meta property="og:description" content="My argument for why SSR is better than SPA's.">`)
    await stream.sleep(10000)
    await stream.writeln(`<pre>Parse error: SYNTAX_ERROR, unexpected H_CLOSE_BRACKET, expecting H_CLOSE_BRACKET. 
in C:\\xampp\\htdocs\\laravel\\public\\index.php on line 50`)
  })
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
