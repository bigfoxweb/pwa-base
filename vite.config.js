import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import pkg from "./package.json";
import { execSync } from "node:child_process"; 

const commit = execSync("git rev-parse --short HEAD").toString().trim();

export default defineConfig(({ mode }) => {
  const emProducao = mode === "production";
  const base = emProducao ? "/app/" : "/";

  return {
    base,

   define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __COMMIT_HASH__: JSON.stringify(commit),
    "import.meta.env.VITE_BUILD_DATE": JSON.stringify(
      new Date().toLocaleDateString("pt-BR")
    ),
  },

    plugins: [
      react(),
      VitePWA({
        // mantém igual
      }),
    ],

    // resto igual
  };
});