/// <reference types="vite/client" />

declare module "#vono/assets" {
  export const manifest: import("vite").Manifest;
  export function getModuleInfo(
    path: string,
  ): Promise<import("vite").ManifestChunk | undefined>;
}

declare module "#vono/request" {
  export function getRequest(): Request | null;
}
