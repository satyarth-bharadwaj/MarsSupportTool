/// <reference types="vitest" />
/// <reference types="vite/client" />
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import reactRefresh from "@vitejs/plugin-react-refresh";

installGlobals();

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./setup.ts", "whatwg-fetch"],
    env: loadEnv("test", process.cwd(), ""),
    coverage: {
      include: ["**/*.tsx", "**/*.ts"],
      exclude: [
        "**/node_modules/**",
        "**/e2e/**",
        "**/utils/**",
        "**/*.config.ts",
        "**/*.server.ts",
      ],
    },
    exclude: ["**/node_modules/**", "**/e2e/**"],
  },
  plugins: [
    !process.env.VITEST &&
      remix({
        ignoredRouteFiles: ["**/*.css"],
      }),
    tsconfigPaths(),
    reactRefresh(), // Add the react-refresh plugin
  ],
  server: {
    hmr: {
      overlay: true, // Adjust as needed
    },
  },
});
