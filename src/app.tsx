import { HydrationScript, NoHydration } from "solid-js/web";
import { createBackgroundEffect } from "./background";
import { Route, Router, useLocation } from "@solidjs/router";
import { css, defineStyles, styleSheet } from "./toolkit";
import { showUi, timeFactor, webglLoaded } from "./globals";
import { TransitionGroup } from "solid-transition-group";
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
  import.meta.glob("../content/thoughts/**.mdx", { eager: true }),
);

const posts = postImports.map(([path, content]) => ({
  // @ts-ignore
  Component: content.default,
  slug: path.split("/").pop().split(".")[0],
  ...content.frontmatter,
}))
  .sort((a, b) =>
    new Date(b.date).getMilliseconds() - new Date(a.date).getMilliseconds()
  ) as Array<{
    Component: Component;
    slug: string;
    title: string;
    date: string;
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
                        <Route 
                          path={post.slug} 
                          component={() => <Thought Component={post.Component} title={post.title} date={post.date} />} 
                        />
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


const LeftArrow = (props: { size?: number }) => (
  <svg
    width={props.size ?? 24}
    height={props.size ?? 24}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 330.002 330.002"
  >
    <path d="M233.25,306.001L127.5,165.005L233.25,24.001c4.971-6.628,3.627-16.03-3-21c-6.627-4.971-16.03-3.626-21,3  L96.75,156.005c-4,5.333-4,12.667,0,18l112.5,149.996c2.947,3.93,7.451,6.001,12.012,6.001c3.131,0,6.29-0.978,8.988-3.001  C236.878,322.03,238.221,312.628,233.25,306.001z" />
  </svg>
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
              <div class="text-white/60">{formatDate(post.date)}</div>
              <a
                class="text-lg md:text-2xl text-white"
                href={`/thoughts/${post.slug}`}
              >
                {post.title}
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

export function Thought(props: ParentProps<{ Component: Component, title: string, date: string }>) {
  return (
    <div class="text-white max-w-3xl mx-auto mb-32">
      <Title>{props.title}</Title>
      <a
        class="text-lg opacity-50 hover:opacity-100 hover:bg-gray/50 transition rounded-md p-2 font-display inline-flex items-center -translate-x-3 space-x-2"
        href="/thoughts"
      >
        <LeftArrow size={18} /> back
      </a>
      <h1 class="text-4xl md:text-7xl font-bold leading-tight">
        {props.title}
      </h1>
      <div class="mt-2 md:text-lg font-display flex items-center space-x-2">
        <p class="opacity-50">{props.date}</p>
      </div>
      <article class="mt-20 text-lg font-serif space-y-4">
        <props.Component components={{
          p: (props) => <p class="text-white text-xl font-serif" {...props} />,
          code: (props) => <code class="text-primary-300 font-mono" {...props} />,
        }} />
      </article>
    </div>
  );
}