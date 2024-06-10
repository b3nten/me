import { HydrationScript, NoHydration } from "solid-js/web";
import { createBackgroundEffect } from "./webgl/background";
import { Route, Router, useLocation } from "@solidjs/router";
import { color, css, cx, defineStyles, styleSheet } from "./toolkit";
import { showMobileNavMenu, showUi, timeFactor, webglLoaded } from "./globals";
import { Transition, TransitionGroup } from "solid-transition-group";
import {
  Component,
  createEffect,
  ErrorBoundary,
  For,
  onMount,
  ParentProps,
  Show,
  Suspense,
} from "solid-js";
import { MetaProvider, Title } from "@solidjs/meta";
import { Nav } from "./nav";

/****************************************************************************************
 * Post Import
 *****************************************************************************************/

const postImports = Object.entries(
  import.meta.glob("../content/thoughts/**.*", { eager: true }),
);
const posts = postImports.map(([path, content]) => ({
  // @ts-ignore
  ...content,
  slug: path.split("/").pop().split(".")[0],
}))
  .sort((a, b) =>
    new Date(b.date).getMilliseconds() - new Date(a.date).getMilliseconds()
  ) as Array<{
    default: Component;
    slug: string;
    meta: any;
  }>;

/****************************************************************************************
 * Page Shell
 *****************************************************************************************/

export default function App(props) {
  return (
    <html lang="en">
      <head>
        <NoHydration>
          <HydrationScript />
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <style data-css-hooks innerHTML={styleSheet()} />
          {props.head}
        </NoHydration>
      </head>
      <body
        class="transition-opacity duration-500 delay-500"
        style={{ opacity: webglLoaded.value ? 1 : 0 }}
      >
        <MetaProvider>
          <ErrorBoundary fallback={"Error"}>
            <Suspense>
              <Router url={props.path} root={RootLayout}>
                <Route path="/" component={Home} />
                <Route component={PageLayout}>
                  <Route path="/bio" component={Bio} />
                  <Route path="/thoughts" component={BlurredBackground}>
                    <Route path="/" component={ThoughtList} />
                    <For each={posts}>
                      {(post) => (
                        <Route path={post.slug} component={post.default} />
                      )}
                    </For>
                  </Route>
                </Route>
              </Router>
            </Suspense>
          </ErrorBoundary>
        </MetaProvider>
      </body>
    </html>
  );
}

/****************************************************************************************
 * Mount Background
 *****************************************************************************************/

const Background = () => {
  let background: HTMLDivElement | null = null;

  onMount(() => {
    createBackgroundEffect(background);
  });

  const loc = useLocation();

  createEffect(() => {
    if (loc.pathname === "/") {
      timeFactor.value = 1.0;
    } else {
      timeFactor.value = 0.3;
    }
  });

  return (
    <div ref={background} class="fixed top-0 left-0 w-full h-screen -z-50" />
  );
};


/****************************************************************************************
 * Layout
 *****************************************************************************************/

const PageTransition = (props: ParentProps) => (
  <div class="transition-container">
    <TransitionGroup name="fade">
      {props.children}
    </TransitionGroup>
  </div>
);

const RootLayout = (props: ParentProps) => {
  return (
    <>
      <Nav />
      <main>
        <PageTransition>
          <Show when={showUi.value}>
            {props.children}
          </Show>
        </PageTransition>
      </main>
      <Background />
    </>
  );
};

const PageLayout = (props: ParentProps) => (
  <div class="mt-[10rem] p-4 w-full max-w-[1024px] mx-auto">
    <PageTransition>
      {props.children}
    </PageTransition>
  </div>
);

const BlurredBackground = (props: ParentProps) => (
  <>
    {props.children}
    <div class="-z-20 fixed inset-0 bg-primary-900/60 backdrop-blur-lg" />
  </>
);

/****************************************************************************************
 * Routes
 *****************************************************************************************/

const homeStyles = defineStyles({
  benten: {
    "position": "absolute",
    "pointer-events": "none",
    "cursor": "default",
    "font-size": "min(max(25vw, 50px), 400px)",
    "color": "transparent",
    "font-weight": "900",
    "user-select": "none",
  },
  ben: {
    "top": "max(5vw, 10rem)",
    "background":
      "linear-gradient(90deg, color-mix(in srgb, var(--primary-300), transparent 75%), rgba(255, 255, 255, 0.85))",
    "background-clip": "text",
  },
  ten: {
    "background":
      "linear-gradient(90deg, rgba(255, 255, 255, 0.85), color-mix(in srgb, var(--primary-300), transparent 75%))",
    "background-clip": "text",
  },
  blurb: {
    "position": "absolute",
    "bottom": "35vh",
    "color": "transparent",
    "background":
      "linear-gradient(90deg, color-mix(in srgb, var(--primary-600), transparent 20%), rgba(255, 255, 255, 0.96))",
    "background-clip": "text",
    "font-weight": "700",
  },
});

const Home = () => {
  return (
    <>
      <Title>
        BƎNTƎN
      </Title>
      <div class="fixed inset-0 z-10 overflow-hidden">
        <p
          style={css(homeStyles.benten, homeStyles.ben)}
          class="left-3vw leading-[.8] font-sans"
        >
          BƎN
        </p>
        <p
          style={css(homeStyles.benten, homeStyles.ten)}
          class="bottom-[5vw] right-[3vw] leading-[.8] font-sans"
        >
          TƎN
        </p>
        <p
          style={css(homeStyles.blurb)}
          class="left-8 sm:left-12 xl:left-48 text-xl sm:text-2xl"
        >
          Software developer and 3d artist.
          <br />
          Building experences for the modern web.
          <br />
        </p>
      </div>
    </>
  );
};

const ThoughtList = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function formatDate(date: string) {
    const d = new Date(date);
    return `${months[d.getMonth()]} ${d.getDate()}`;
  }

  return (
    <div>
      <Title>BƎNTƎN - Thoughts</Title>
      <h1 class="text-5xl md:text-8xl font-display text-white">Thoughts</h1>
      <div class="py-4"></div>
      <ul>
        <For each={posts}>
          {(post) => (
            <li>
              <div class="text-white/60">{formatDate(post.meta.date)}</div>
              <a
                class="text-lg md:text-2xl text-white"
                href={`/thoughts/${post.slug}`}
              >
                {post.meta.title}
              </a>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

const Bio = () => {
  return (
    <div>
      <Title>BƎNTƎN - Bio</Title>
      <div class="w-full max-w-4xl mx-auto min-h-90 rounded-xl border border-primary-100/50 bg-gray-500/50 backdrop-blur-lg p-8 text-primary-100">
        <h1 class="text-4xl md:text-7xl font-display mb-8 -translate-x-[6px]">
          BIO
        </h1>
        <p>
          Hey, thanks for dropping by. My name is Benton and I am a software
          developer and 3d artist.
          <br />
        </p>
      </div>
    </div>
  );
};
