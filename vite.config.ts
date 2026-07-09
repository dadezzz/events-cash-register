import adapter from "@sveltejs/adapter-node";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    enhancedImages(),
    sveltekit({
      compilerOptions: { experimental: { async: true } },
      experimental: { remoteFunctions: true, explicitEnvironmentVariables: true },
      adapter: adapter({ out: "dist" }),
    }),
    tailwindcss(),
  ],
  build: {
    rolldownOptions: {
      // NAPI modules don't work well with bundling.
      external: ["@workspace/cups"],
    },
  },
});
