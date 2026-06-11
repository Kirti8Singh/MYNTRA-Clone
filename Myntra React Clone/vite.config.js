import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensures clean asset and route resolution across your frontend app
  server: {
    port: 5173,
    host: true,
  },
});
