<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import { useAppearance } from './composables/useAppearance'

useAppearance()
</script>

<template>
  <AppHeader />
  <main class="page">
    <RouterView />
  </main>
</template>
