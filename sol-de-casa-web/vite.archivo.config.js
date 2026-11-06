import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Versión de un solo archivo: todo (código, estilos e imágenes) dentro de un HTML que se abre
// con doble clic, sin servidor ni instalación. Regla del reto: «la página abre con un link o un archivo».
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist-archivo', assetsInlineLimit: 100000000 },
});
