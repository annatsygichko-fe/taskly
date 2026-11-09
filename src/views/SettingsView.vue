<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '../stores/settings'
import { LANGUAGES } from '../i18n/languages'
import type { Theme } from '../types'

const { t } = useI18n()
const settings = useSettingsStore()

const themes: Theme[] = ['light', 'dark', 'system']
</script>

<template>
  <section>
    <h1>{{ t('settings.title') }}</h1>

    <fieldset class="group">
      <legend>{{ t('settings.language') }}</legend>
      <p class="hint">{{ t('settings.languageHint') }}</p>
      <div class="options">
        <label v-for="language in LANGUAGES" :key="language.value" class="option">
          <input v-model="settings.language" type="radio" name="language" :value="language.value" />
          <span>{{ language.label }}</span>
        </label>
      </div>
    </fieldset>

    <fieldset class="group">
      <legend>{{ t('settings.theme') }}</legend>
      <p class="hint">{{ t('settings.themeHint') }}</p>
      <div class="options">
        <label v-for="theme in themes" :key="theme" class="option">
          <input v-model="settings.theme" type="radio" name="theme" :value="theme" />
          <span>{{ t(`settings.themes.${theme}`) }}</span>
        </label>
      </div>
    </fieldset>
  </section>
</template>
