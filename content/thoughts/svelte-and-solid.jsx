import { defineMeta, Thought } from "../../src/thought-wrapper";

export const meta = defineMeta({
  title: "Svelte and Solid",
  date: "2024-06-30",
  tags: ["svelte", "solid", "frameworks"],
});

export default () => (
  <Thought meta={meta}>
    <p>
      I want to like Svelte. I started my career in web development with it and
      I come back to it every few months to use it on a project. My experience
      is always the same: I love the templates. It's so easy, Sveltekit is so
      easy, wow! But inevitably the LSP breaks on an import, I have to pull out
      a small but duplicated component into a separate single file component for
      the nth time, I have to resort to some weird hack due to the lack of
      composition, amd I pull my hair out searching for the right `+page.svelte`
      file in a sea of nested `+page.svelte`, `+layouts.svelte`, or
      `+page.server.ts` files. I inevitably give up on Svelte and tell myself
      it's the last time. It won't be the last time.
    </p>
    <p>
      There is simply too much magic that distracts me. I've found that I am the
      most productive when the tools I am using are extremely explicit and
      follow standard {"{language}"}{" "}
      semantics. Compiler transforms and non-standard syntax eventually slow me
      down despite early the early productivity boost. Dealing with bugs in
      tooling or weird edge case behaviours completely kills my motivation to
      write code and knocks me out of flow state if I manage to achieve it. And
      I think it's dubious they increase developer productivity overall. Golang
      is a hilariously explicit language with almost no magic - and it's
      extremely productive; It turns out that it's easier to reason with long
      explicit boilerplate than short implicit magic. I think it's partially to
      do with mental fatigue -- as a developer we are constantly thinking about
      the problem domain and solutions, leaving little mental capacity for
      syntax or language features. When you can skim code and comprehend it with
      little mental effort it leaves more bandwidth to focus on the what
      actually matters. It's not just a matter of experience either. I like
      Typescript and consider myself experienced with it, yet I still find plain
      Javascript to be more readable and easier to parse. This is partially
      because of syntax, and partially because types are usually implicitly
      inferred rather than explicitly declared. I'm not sure implicit typing is
      a net win: it's certainly easier to write code when you don't need to
      explicitly declare types on values, but we spend far more time reading
      code compared to writing it so optimizing for the writing experience seems
      nonsensical. And implicit types don't help guide us to writing correct
      code, they just describe what we've written. This is useful for catching
      errors but not for describing correctness. Of course you can explicitly
      define types if you wish but it's not enforced and almost unidiomatic in
      the ecosystem.
    </p>
  </Thought>
);
