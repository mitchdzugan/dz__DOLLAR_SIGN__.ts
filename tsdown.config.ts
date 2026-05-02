import { defineConfig } from "tsdown";

export default defineConfig([
  { entry: ["src/index.ts"], dts: true, format: ['esm'], fixedExtension: true },
  { entry: ["src/YoutubeClip.tsx"], dts: true, format: ['esm'], fixedExtension: true },
  { entry: ["src/node.ts"], platform: "node", dts: true, format: ['esm'], fixedExtension: true },
]);
