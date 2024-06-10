import { HydrationScript, NoHydration } from "solid-js/web";
import { createBackgroundEffect } from "./webgl/background";
import { Route, Router, useLocation } from "@solidjs/router";
import { color, css, cx, defineStyles, styleSheet } from "./toolkit";
import { showMobileNavMenu, showUi, timeFactor, webglLoaded } from "./globals";
import { Transition, TransitionGroup } from "solid-transition-group";
import {
  Component,
  createEffect,
  createSignal,
  ErrorBoundary,
  For,
  lazy,
  onMount,
  ParentProps,
  Show,
  Suspense,
} from "solid-js";
import { MetaProvider, Title } from "@solidjs/meta";

const Settings = lazy(() => import("./settings"));

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
 * Icons
 *****************************************************************************************/

const DEFAULT_ICON_SIZE = 24;

const Artstation = (props: { size?: number }) => (
  <svg
    class={hoverClasses}
    width={props.size ?? DEFAULT_ICON_SIZE}
    height={props.size ?? DEFAULT_ICON_SIZE}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.142-1.289H9.419L21.598 22.54l1.92-3.325c.378-.637.482-.919.482-1.467zm-11.129-3.462L7.428 4.858l-5.444 9.428h10.887z" />
  </svg>
);

const Github = (props: { size?: number }) => (
  <svg
    class={hoverClasses}
    width={props.size ?? DEFAULT_ICON_SIZE}
    height={props.size ?? DEFAULT_ICON_SIZE}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.6,5,2.5,9.3,6.9,10.7v-2.3c0,0-0.4,0.1-0.9,0.1c-1.4,0-2-1.2-2.1-1.9 c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1c0.4,0,0.7-0.1,0.9-0.2 c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6c0,0,1.4,0,2.8,1.3 C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3 c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v3.3c4.1-1.3,7-5.1,7-9.5C22,6.1,16.9,1.4,10.9,2.1z" />
  </svg>
);

/****************************************************************************************
 * Navigation
 *****************************************************************************************/

const navStyles = defineStyles({
  root: {
    "position": "absolute",
    "display": "flex",
    "justify-content": "space-between",
    "align-items": "center",

    "padding": ".5rem 2rem",
    "height": "4rem",
    "width": "100%",
    "max-width": "min(80%, 1500px)",
    "z-index": 50,

    "background-color": color("var(--gray-500)", 50),
    "backdrop-filter": "blur(12px)",

    "top": "1rem",
    "left": "50%",
    "transform": "translateX(-50%)",

    "font-family": "var(--font-family-display)",
    "font-weight": 900,

    border: `1px solid ${color("var(--primary-100)", 50)}`,
    "border-radius": "9999px",
  },
});

const hoverClasses =
  `text-primary-300 hover:text-primary-500 fill-primary-300 hover:fill-primary-500 stroke-primary-300 hover:stroke-primary-500 transition-colors`;

const Nav = () => {
  const closeMobileNav = () => showMobileNavMenu.value = false;

  const [mounted, setMounted] = createSignal();
  onMount(() => setMounted(true));

  return (
    <Show when={mounted()}>
      <nav style={css(navStyles.root)}>
        <ul class="hidden md:flex items-center gap-4">
          <li class={cx(hoverClasses, "flex items-center")}>
            <a
              href="https://github.com/b3nten"
              target="_blank"
              aria-label="github"
            >
              <Github size={30} />
            </a>
          </li>
          <li class={cx(hoverClasses, "flex items-center")}>
            <a
              href="https://www.artstation.com/benten28"
              target="_blank"
              aria-label="artstation"
            >
              <Artstation />
            </a>
          </li>
          <li class={cx(hoverClasses, "flex items-center")}>
            <Settings />
          </li>
        </ul>
        <a
          href="/"
          class={cx(hoverClasses, "text-3xl")}
          aria-label="home"
        >
          B<span class="flip">E</span>NT<span class="flip">E</span>N
        </a>
        <ul class="hidden md:flex items-center gap-4 text-lg">
          <li>
            <a
              href="/thoughts"
              aria-label="thoughts"
              class={cx(hoverClasses)}
            >
              TH0UGHTS
            </a>
          </li>
          <li>
            <a
              href="/bio"
              aria-label="bio"
              class={cx(hoverClasses)}
            >
              BI0
            </a>
          </li>
        </ul>
        <button
          class={cx(hoverClasses, "md:hidden cursor-pointer")}
          onClick={() => showMobileNavMenu.value = true}
        >
          M<span class="flip">E</span>NU
        </button>
      </nav>
      <div
        class="fixed z-50 inset-4"
        style={{
          perspective: "1000px",
          "pointer-events": showMobileNavMenu.value ? "all" : "none",
        }}
      >
        <Transition name="flip">
          <Show when={showMobileNavMenu.value}>
            <div class="absolute inset-0 rounded-xl bg-gray/70 backdrop-blur-lg border border-primary-100/50 p-8">
              <div class="flex items-center justify-between">
                <a
                  href="/"
                  class={cx(hoverClasses, "text-3xl cursor-pointer")}
                  aria-label="home"
                  onclick={closeMobileNav}
                >
                  B<span class="flip">E</span>NT<span class="flip">E</span>N
                </a>
                <button
                  class={cx(hoverClasses, "text-2xl font-bold font-display")}
                  onclick={closeMobileNav}
                >
                  CLOS<span class="flip">E</span>
                </button>
              </div>
              <ul
                class={cx(
                  hoverClasses,
                  "flex flex-col items-start gap-4 text-2xl mt-1",
                )}
              >
                <li>
                  <a
                    href="/thoughts"
                    aria-label="thoughts"
                    onclick={closeMobileNav}
                  >
                    TH0UGHTS
                  </a>
                </li>
                <li>
                  <a href="/bio" aria-label="bio" onclick={closeMobileNav}>
                    BI0
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/b3nten"
                    target="_blank"
                    aria-label="github"
                  >
                    GITHUB
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.artstation.com/benten28"
                    target="_blank"
                    aria-label="artstation"
                  >
                    ARTSTATION
                  </a>
                </li>
              </ul>
            </div>
          </Show>
        </Transition>
      </div>
    </Show>
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
