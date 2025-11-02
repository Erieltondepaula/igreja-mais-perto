// Local do arquivo: vite.config.ts
// ✅ CÓDIGO MODIFICADO PARA FUNCIONAR SEM SERVIDOR

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: './', // <== ESTA LINHA FOI ADICIONADA
  server: {
    host: "0.0.0.0",  // Escuta em todas interfaces IPv4
    port: 3000,
    strictPort: false,  // Permite mudança de porta se estiver ocupada
    open: true,        // Abrir automaticamente o navegador
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
});