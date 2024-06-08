import { createEffect, createRoot } from "solid-js";
import chroma from "chroma-js";
import { reactive } from "./toolkit";

export const webglLoaded = reactive(false);

export const showMobileNavMenu = reactive(false);

export const timeFactor = reactive(1.0);

export const showUi = reactive(true);

export const primaryColor = reactive({ r: 22, g: 71, b: 140 });

if (
  typeof localStorage !== "undefined" && localStorage?.getItem("primaryColor")
) {
  primaryColor.value = JSON.parse(localStorage.getItem("primaryColor"));
}

createEffect(() => {
  try {
    localStorage.setItem("primaryColor", JSON.stringify(primaryColor.value));
    const p = chroma.rgb(
      primaryColor.value.r,
      primaryColor.value.g,
      primaryColor.value.b,
    );
    const color = chroma.scale([
      chroma.rgb(255, 255, 255),
      p,
      chroma.rgb(0, 0, 0),
    ]).gamma(2).colors(11, "rgb");
    for (let i = 0; i < color.length; i++) {
      document.documentElement.style.setProperty(
        `--primary-${i === 0 ? "50" : i === 10 ? "950" : i + "00"}`,
        `rgb(${color[i]})`,
      );
    }
  } catch (e) {
    console.error(e);
  }
});
