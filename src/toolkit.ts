import { createHooks } from "@css-hooks/solid";
import { buildHooksSystem } from "@css-hooks/core";
import { basic as createBasic } from "css-hooks-basic";
import { createSignal } from "solid-js";

/****************************************************************************************
 * Loops
 *****************************************************************************************/

export function update(callback: Function) {
  let alive = true;
  const handler = (delta) => {
    if (!alive) return;
    requestAnimationFrame(handler);
    callback(delta);
  };
  requestAnimationFrame(handler);
  return () => alive = false;
}

export function fixedUpdate(callback: Function, fps = 50) {
  let t = performance.now();
  const update = () => {
    const delta = performance.now() - t;
    t = performance.now();
    callback(delta);
  };
  const interval = setInterval(update, 1000 / fps);
  return () => clearInterval(interval);
}

export function createDisposable() {
  const disposables: Function[] = [];
  return {
    dispose() {
      for (const disposable of disposables) {
        try {
          disposable();
        } catch {}
      }
    },
    cleanup(...d: Function[]) {
      disposables.push(...d);
    },
    disposableEvent(
      target: { addEventListener: Function; removeEventListener: Function },
      type: string,
      listener: Function,
      options: any,
    ) {
      target.addEventListener(type, listener, options);
      disposables.push(() =>
        target.removeEventListener(type, listener, options)
      );
    },
  };
}

/****************************************************************************************
 * CSS Hooks
 *****************************************************************************************/

export const { css: _css, styleSheet } = createHooks({
  hooks: {
    xs: `@media (min-width: 520px)`,
    sm: `@media (min-width: 768px)`,
    md: `@media (min-width: 1024px)`,
    lg: `@media (min-width: 1280px)`,
    xl: `@media (min-width: 1576px)`,
    "&:hover": `&:hover`,
    "&:focus": `&:focus`,
    "&:active": `&:active`,
  },
});

const basic = createBasic(_css);

// @ts-expect-error
const css: typeof basic & { advanced: typeof _css } = basic;
css.advanced = _css;
export { css };

export function defineStyles<
  T extends Record<string, Parameters<typeof css>[0]>,
>(styles: T): T {
  return styles;
}

export const cx = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export const color = (color: string, opacity = 100) =>
  `color-mix(in srgb, ${color}, transparent ${opacity}%)`;

/****************************************************************************************
 * Reactive
 *****************************************************************************************/

export function reactive<T extends any>(initial: T) {
  const [value, setValue] = createSignal<T>(initial);
  return {
    get value() {
      return value();
    },
    set value(v: T) {
      // @ts-expect-error
      setValue(v);
    },
  };
}
