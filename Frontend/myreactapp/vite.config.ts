import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    allowedHosts: [
      '6b36-2402-8100-25cc-a352-a2ec-43b0-c656-45be.ngrok-free.app'
    ],
  },
})
