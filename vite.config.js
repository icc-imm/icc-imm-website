import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(rootDir, "index.html"),
        management: resolve(rootDir, "library/new-reality-management/index.html"),
        aiMarketing: resolve(rootDir, "library/ai-marketing-competitiveness/index.html"),
        policyNote: resolve(rootDir, "library/business-experience-policy-note/index.html"),
      },
    },
  },
});
