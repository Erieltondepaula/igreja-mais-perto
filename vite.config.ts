import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0",  // Escuta em todas interfaces IPv4
    port: 8080,
    strictPort: true,  // Não tenta mudar a porta se 8080 estiver ocupada
    open: true,       // Abre navegador automaticamente (opcional)
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
});
