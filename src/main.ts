import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import { useAuthStore } from './stores/auth'
import './style.css'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia).use(i18n)

  // Find out who is signed in before the router decides which page to open.
  await useAuthStore(pinia).init()

  app.use(router).mount('#app')
}

bootstrap()
