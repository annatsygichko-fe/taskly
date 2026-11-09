<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ThemeToggle from './ThemeToggle.vue'

const { t } = useI18n()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const menuOpen = ref(false)

// Close the mobile menu after every navigation.
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)

async function logout() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="site-header">
    <div class="bar">
      <RouterLink class="brand" :to="{ name: 'tasks' }">Taskly</RouterLink>

      <nav v-if="auth.isLoggedIn" id="main-nav" class="nav" :class="{ open: menuOpen }">
        <RouterLink :to="{ name: 'tasks' }">{{ t('nav.tasks') }}</RouterLink>
        <RouterLink :to="{ name: 'profile' }">{{ t('nav.profile') }}</RouterLink>
        <RouterLink :to="{ name: 'settings' }">{{ t('nav.settings') }}</RouterLink>
        <button type="button" class="nav-btn" @click="logout">{{ t('nav.logout') }}</button>
      </nav>

      <div class="tools">
        <LanguageSwitcher />
        <ThemeToggle />
        <button
          v-if="auth.isLoggedIn"
          type="button"
          class="icon-btn burger"
          :aria-label="t('nav.menu')"
          :aria-expanded="menuOpen"
          aria-controls="main-nav"
          @click="menuOpen = !menuOpen"
        >
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path
              d="M3 5.5h14M3 10h14M3 14.5h14"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
