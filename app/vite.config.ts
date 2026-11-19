import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit({
      // Plain static files: no server, fonts never leave the browser
      adapter: adapter(),
      // Production lives at tools.jmsole.cl/proof/; `npm run build` sets this
      paths: { base: (process.env.BASE_PATH ?? "") as "" | `/${string}` },
    }),
  ],
  // The Latin 2 test content is one ~550 kB chunk, loaded only on that page
  build: { chunkSizeWarningLimit: 600 },
});
