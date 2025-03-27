import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  resolve: {
    alias: {
      "onnxruntime-node": path.resolve(__dirname, "empty-module.js"),
      sharp: path.resolve(__dirname, "empty-module.js"),
    },
  },
  worker: {
    format: "es",
  },
  build: {
    rollupOptions: {
      output: {
        format: "es",
      },
    },
  },
});
