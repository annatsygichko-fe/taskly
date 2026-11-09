<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  id: string
  label: string
  autocomplete: string
}>()

const model = defineModel<string>({ required: true })

const { t } = useI18n()
const visible = ref(false)
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <div class="password-wrap">
      <input
        :id="id"
        v-model="model"
        :type="visible ? 'text' : 'password'"
        :autocomplete="autocomplete"
        required
      />
      <button
        type="button"
        class="eye"
        :aria-label="visible ? t('auth.hidePassword') : t('auth.showPassword')"
        :aria-pressed="visible"
        @click="visible = !visible"
      >
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
          <path
            d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
          <circle cx="10" cy="10" r="2.5" fill="none" stroke="currentColor" stroke-width="1.6" />
          <path
            v-if="!visible"
            d="M3.5 3.5l13 13"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
