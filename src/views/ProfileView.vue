<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useTasksStore } from '../stores/tasks'
import { useDateFormat } from '../composables/useDateFormat'

const { t } = useI18n()
const auth = useAuthStore()
const tasks = useTasksStore()
const router = useRouter()
const { formatDate, formatDateTime } = useDateFormat()

const initial = computed(() => auth.displayName.charAt(0).toUpperCase())

async function logout() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <section v-if="auth.currentUser">
    <div class="profile-head">
      <div class="avatar" aria-hidden="true">{{ initial }}</div>
      <div>
        <h1>{{ auth.displayName }}</h1>
      </div>
    </div>

    <dl class="facts">
      <div>
        <dt>{{ t('profile.email') }}</dt>
        <dd>{{ auth.currentUser.email }}</dd>
      </div>
      <div>
        <dt>{{ t('profile.lastVisit') }}</dt>
        <dd>{{ auth.lastVisit ? formatDateTime(auth.lastVisit) : t('profile.firstVisit') }}</dd>
      </div>
      <div v-if="auth.currentUser.createdAt">
        <dt>{{ t('profile.memberSince') }}</dt>
        <dd>{{ formatDate(auth.currentUser.createdAt) }}</dd>
      </div>
    </dl>

    <div class="stats">
      <div class="stat">
        <strong>{{ tasks.counts.all }}</strong>
        <span>{{ t('profile.stats.total') }}</span>
      </div>
      <div class="stat">
        <strong>{{ tasks.counts.done }}</strong>
        <span>{{ t('profile.stats.done') }}</span>
      </div>
      <div class="stat">
        <strong>{{ tasks.counts.active }}</strong>
        <span>{{ t('profile.stats.open') }}</span>
      </div>
    </div>

    <button type="button" class="secondary" @click="logout">{{ t('nav.logout') }}</button>
  </section>
</template>
