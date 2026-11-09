<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore, type AuthResult } from '../stores/auth'
import PasswordField from '../components/PasswordField.vue'

type Mode = 'signIn' | 'signUp' | 'reset'

const { t } = useI18n()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const mode = ref<Mode>('signIn')
const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref<string | null>(null) // full i18n key
const info = ref<string | null>(null) // full i18n key
const busy = ref(false)

const isSignUp = computed(() => mode.value === 'signUp')
const isReset = computed(() => mode.value === 'reset')

function setMode(next: Mode) {
  mode.value = next
  error.value = null
  info.value = null
  confirm.value = ''
}

function showResult(result: AuthResult): boolean {
  if (!result.ok) {
    error.value = `auth.errors.${result.error}`
    return false
  }
  return true
}

function goToApp() {
  const redirect = route.query.redirect
  return router.push(
    typeof redirect === 'string' && redirect.startsWith('/') ? redirect : { name: 'tasks' },
  )
}

async function submit() {
  error.value = null
  info.value = null

  if (isSignUp.value && password.value !== confirm.value) {
    error.value = 'auth.errors.passwordMismatch'
    return
  }

  busy.value = true
  let result: AuthResult
  if (isReset.value) result = await auth.sendPasswordReset(email.value)
  else if (isSignUp.value) result = await auth.register(email.value, password.value)
  else result = await auth.login(email.value, password.value)
  busy.value = false

  if (!showResult(result)) return

  password.value = ''
  confirm.value = ''

  if (isReset.value) {
    info.value = 'auth.reset.sent'
    return
  }
  // If the email is not confirmed yet, the template switches to the "confirm your email" step.
  if (auth.isLoggedIn) await goToApp()
}

async function checkConfirmed() {
  error.value = null
  info.value = null
  busy.value = true
  const confirmed = await auth.refreshVerification()
  busy.value = false

  if (confirmed) await goToApp()
  else error.value = 'auth.verify.notYet'
}

async function resend() {
  error.value = null
  info.value = null
  busy.value = true
  const result = await auth.resendVerification()
  busy.value = false

  if (showResult(result)) info.value = 'auth.verify.resent'
}

async function useAnotherAccount() {
  await auth.logout()
  setMode('signIn')
}
</script>

<template>
  <section class="auth-card">
    <p v-if="!auth.isConfigured" class="form-error" role="alert">
      {{ t('auth.errors.notConfigured') }}
    </p>

    <!-- Step: confirm the email address -->
    <template v-if="auth.needsVerification">
      <h1>{{ t('auth.verify.title') }}</h1>
      <p class="lead">{{ t('auth.verify.text', { email: auth.pendingEmail }) }}</p>

      <p v-if="error" class="form-error" role="alert">{{ t(error) }}</p>
      <p v-if="info" class="form-info" role="status">{{ t(info) }}</p>

      <button type="button" class="primary wide" :disabled="busy" @click="checkConfirmed">
        {{ t('auth.verify.done') }}
      </button>
      <p class="switch">
        <button type="button" class="link" :disabled="busy" @click="resend">
          {{ t('auth.verify.resend') }}
        </button>
      </p>
      <p class="switch">
        <button type="button" class="link" @click="useAnotherAccount">
          {{ t('auth.verify.otherAccount') }}
        </button>
      </p>
    </template>

    <!-- Sign in, create account, reset password -->
    <template v-else>
      <h1>{{ isReset ? t('auth.reset.title') : t('auth.title') }}</h1>
      <p class="lead">{{ isReset ? t('auth.reset.text') : t('auth.subtitle') }}</p>

      <form novalidate @submit.prevent="submit">
        <div class="field">
          <label for="email">{{ t('auth.email') }}</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            autocapitalize="none"
            required
          />
        </div>

        <template v-if="!isReset">
          <PasswordField
            id="password"
            v-model="password"
            :label="t('auth.password')"
            :autocomplete="isSignUp ? 'new-password' : 'current-password'"
          />

          <PasswordField
            v-if="isSignUp"
            id="confirm"
            v-model="confirm"
            :label="t('auth.confirm')"
            autocomplete="new-password"
          />

          <p v-if="!isSignUp" class="forgot">
            <button type="button" class="link" @click="setMode('reset')">
              {{ t('auth.forgot') }}
            </button>
          </p>
        </template>

        <p v-if="error" class="form-error" role="alert">{{ t(error) }}</p>
        <p v-if="info" class="form-info" role="status">{{ t(info) }}</p>

        <button type="submit" class="primary wide" :disabled="busy">
          {{
            isReset
              ? t('auth.reset.submit')
              : isSignUp
                ? t('auth.submitSignUp')
                : t('auth.submitSignIn')
          }}
        </button>
      </form>

      <p class="switch">
        <button
          v-if="isReset"
          type="button"
          class="link"
          @click="setMode('signIn')"
        >
          {{ t('auth.reset.back') }}
        </button>
        <button v-else type="button" class="link" @click="setMode(isSignUp ? 'signIn' : 'signUp')">
          {{ isSignUp ? t('auth.switchToSignIn') : t('auth.switchToSignUp') }}
        </button>
      </p>
    </template>
  </section>
</template>
