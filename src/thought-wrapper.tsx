import { Title } from "@solidjs/meta";
import { For, ParentProps } from "solid-js";

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

type Meta = {
  title: string;
  date: string;
  tags: string[];
};

export function Thought(props: ParentProps<{ meta: Meta }>) {
  return (
    <div class="text-white max-w-3xl mx-auto">
      <Title>{props.meta.title}</Title>
      <a
        class="text-lg opacity-50 hover:opacity-100 hover:bg-gray/50 transition rounded-md p-2 font-display inline-flex items-center space-x-2"
        href="/thoughts"
      >
        <LeftArrow size={18} /> back
      </a>
      <h1 class="text-4xl md:text-7xl font-bold leading-tight">
        {props.meta.title}
      </h1>
      <div class="mt-12 md:text-lg font-display flex items-center space-x-2">
        <p class="opacity-50">{props.meta.date}</p>
        <ul class="flex items-center space-x-2">
          <For each={props.meta.tags}>
            {(tag) => (
              <li class=" bg-primary-700 saturate-50 text-white px-2 py-1 rounded">
                {tag}
              </li>
            )}
          </For>
        </ul>
      </div>
      <article class="mt-20 text-lg font-serif">
        {props.children}
      </article>
    </div>
  );
}

export function defineMeta(meta: Meta) {
  return meta;
}
