import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.ts",
  dts: true,
  platform: 'node',
  format: ['cjs', 'esm'],
  clean: true,
  sourcemap: true,
})