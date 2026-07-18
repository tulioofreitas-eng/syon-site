import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
  // Sem domínio próprio ainda (.inc é caro, decisão adiada) — site fica só
  // no link do Vercel até a decisão de domínio.
  site: 'https://syon-site.example.vercel.app',
});
