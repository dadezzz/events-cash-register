import adapter from "@sveltejs/adapter-node";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rolldownOptions: {
      // NAPI modules don't work well with the bundler.
      external: ["@workspace/cups"],
    },
  },
  plugins: [
    enhancedImages(),
    sveltekit({
      adapter: adapter({ out: "dist" }),
      compilerOptions: { experimental: { async: true } },
      experimental: { remoteFunctions: true },
    }),
    tailwindcss(),
  ],
});
