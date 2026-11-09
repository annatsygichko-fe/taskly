import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Relative paths, so the site works from https://<user>.github.io/<repo>/
  base: './',
})
