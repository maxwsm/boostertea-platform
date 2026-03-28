import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwind from "@tailwindcss/vite"
import path from "path";


export default defineConfig({
  plugins: [react(), cloudflare(), tailwind()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/web"),
    },
  },
  server: {
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - split large dependencies
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['wouter'],
          'vendor-animations': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    // Improve build performance
    sourcemap: false,
    minify: 'esbuild',
  },
});
