import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativa: el build abre desde cualquier carpeta o hosting estático (regla del reto: "sin instalar nada").
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
  },
});
