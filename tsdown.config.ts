import { defineConfig } from "tsdown";

export default defineConfig([
  { entry: ["src/index.ts"], dts: true },
  { entry: ["src/node.ts"], platform: "node", dts: true },
]);
