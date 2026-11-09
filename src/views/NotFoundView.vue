<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section class="not-found">
    <h1>{{ t('notFound.title') }}</h1>
    <p class="lead">{{ t('notFound.text') }}</p>
    <RouterLink class="primary link-button" :to="{ name: 'tasks' }">{{ t('notFound.back') }}</RouterLink>
  </section>
</template>
