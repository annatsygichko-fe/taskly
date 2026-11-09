<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '../stores/settings'
import { LANGUAGES } from '../i18n/languages'

const { t } = useI18n()
const settings = useSettingsStore()
</script>

<template>
  <select v-model="settings.language" class="select" :aria-label="t('header.language')">
    <option v-for="language in LANGUAGES" :key="language.value" :value="language.value">
      {{ language.label }}
    </option>
  </select>
</template>
