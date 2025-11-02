<<<<<<< HEAD
// Local do arquivo: vite.config.ts
// ✅ CÓDIGO MODIFICADO PARA FUNCIONAR SEM SERVIDOR

=======
>>>>>>> 895191cddc6a766a08518c3bb9ce1dd6a15874c2
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
<<<<<<< HEAD
  base: './', // <== ESTA LINHA FOI ADICIONADA
  server: {
    host: "0.0.0.0",  // Escuta em todas interfaces IPv4
    port: 3000,
    strictPort: false,  // Permite mudança de porta se estiver ocupada
    open: true,        // Abrir automaticamente o navegador
=======
  server: {
    host: "0.0.0.0",  // Escuta em todas interfaces IPv4
    port: 8080,
    strictPort: true,  // Não tenta mudar a porta se 8080 estiver ocupada
    open: true,       // Abre navegador automaticamente (opcional)
>>>>>>> 895191cddc6a766a08518c3bb9ce1dd6a15874c2
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
<<<<<<< HEAD
});
=======
});
>>>>>>> 895191cddc6a766a08518c3bb9ce1dd6a15874c2
