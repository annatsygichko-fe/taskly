import { computed, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { getFirebaseAuth, isFirebaseConfigured } from '../firebase'
import { i18n } from '../i18n'
import { isValidEmail } from '../utils/validation'

export type AuthError =
  | 'invalidEmail'
  | 'passwordShort'
  | 'emailTaken'
  | 'invalidCredentials'
  | 'tooManyRequests'
  | 'network'
  | 'notConfigured'
  | 'unknown'

export type AuthResult = { ok: true } | { ok: false; error: AuthError }

interface VisitInfo {
  last: string
  previous: string | null
}

function fail(error: AuthError): AuthResult {
  return { ok: false, error }
}

function mapError(error: unknown): AuthError {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : ''

  switch (code) {
    case 'auth/email-already-in-use':
      return 'emailTaken'
    case 'auth/invalid-email':
      return 'invalidEmail'
    case 'auth/weak-password':
      return 'passwordShort'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'invalidCredentials'
    case 'auth/too-many-requests':
      return 'tooManyRequests'
    case 'auth/network-request-failed':
      return 'network'
    default:
      return 'unknown'
  }
}

// A "visit" is counted once per browser session, not on every page reload.
function visitFlagKey(uid: string) {
  return `todo-visit-counted:${uid}`
}

function visitCounted(uid: string): boolean {
  try {
    return sessionStorage.getItem(visitFlagKey(uid)) === '1'
  } catch {
    return true
  }
}

function setVisitFlag(uid: string, value: boolean) {
  try {
    if (value) sessionStorage.setItem(visitFlagKey(uid), '1')
    else sessionStorage.removeItem(visitFlagKey(uid))
  } catch {
    // Not critical.
  }
}

function readVisits(uid: string): VisitInfo | null {
  try {
    return JSON.parse(localStorage.getItem(`todo-visits:${uid}`) ?? 'null') as VisitInfo | null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = shallowRef<User | null>(null)
  const verified = ref(false)
  const visit = ref<VisitInfo | null>(null)
  const ready = ref(false)

  // Signed in AND the email is confirmed.
  const isLoggedIn = computed(() => user.value !== null && verified.value)
  // Signed in, but the confirmation link has not been opened yet.
  const needsVerification = computed(() => user.value !== null && !verified.value)
  const pendingEmail = computed(() => user.value?.email ?? '')

  const currentUser = computed(() => {
    if (!user.value || !verified.value) return null
    const created = user.value.metadata.creationTime
    return {
      id: user.value.uid,
      email: user.value.email ?? '',
      createdAt: created ? new Date(created).toISOString() : null,
    }
  })

  const displayName = computed(() => currentUser.value?.email.split('@')[0] ?? '')
  // The visit before the current one; null on the very first visit.
  const lastVisit = computed(() => visit.value?.previous ?? null)

  function trackVisit(uid: string) {
    const saved = readVisits(uid)
    if (visitCounted(uid)) {
      visit.value = saved
      return
    }
    const next: VisitInfo = { last: new Date().toISOString(), previous: saved?.last ?? null }
    try {
      localStorage.setItem(`todo-visits:${uid}`, JSON.stringify(next))
    } catch {
      // Not critical.
    }
    setVisitFlag(uid, true)
    visit.value = next
  }

  /** Waits until Firebase reports who is signed in, then keeps the state in sync. */
  function init(): Promise<void> {
    if (!isFirebaseConfigured) {
      ready.value = true
      return Promise.resolve()
    }
    return new Promise((resolve) => {
      onAuthStateChanged(getFirebaseAuth(), (next) => {
        user.value = next
        verified.value = next?.emailVerified ?? false
        if (next && next.emailVerified) trackVisit(next.uid)
        else visit.value = null
        ready.value = true
        resolve()
      })
    })
  }

  async function run(action: () => Promise<unknown>): Promise<AuthResult> {
    if (!isFirebaseConfigured) return fail('notConfigured')
    try {
      // Emails are sent in the language chosen in the app.
      getFirebaseAuth().languageCode = i18n.global.locale.value
      await action()
      return { ok: true }
    } catch (error) {
      return fail(mapError(error))
    }
  }

  function register(email: string, password: string): Promise<AuthResult> | AuthResult {
    if (!isValidEmail(email)) return fail('invalidEmail')
    if (password.length < 6) return fail('passwordShort')
    return run(async () => {
      const credential = await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        email.trim(),
        password,
      )
      await sendEmailVerification(credential.user)
    })
  }

  function login(email: string, password: string): Promise<AuthResult> | AuthResult {
    if (!isValidEmail(email)) return fail('invalidEmail')
    return run(() => signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password))
  }

  function sendPasswordReset(email: string): Promise<AuthResult> | AuthResult {
    if (!isValidEmail(email)) return fail('invalidEmail')
    return run(() => sendPasswordResetEmail(getFirebaseAuth(), email.trim()))
  }

  function resendVerification(): Promise<AuthResult> | AuthResult {
    const current = user.value
    if (!current) return fail('unknown')
    return run(() => sendEmailVerification(current))
  }

  /** Re-reads the account from Firebase to see whether the link was opened. */
  async function refreshVerification(): Promise<boolean> {
    const current = user.value
    if (!current || !isFirebaseConfigured) return false
    try {
      await current.reload()
    } catch {
      return false
    }
    verified.value = current.emailVerified
    if (verified.value) trackVisit(current.uid)
    return verified.value
  }

  async function logout() {
    const current = user.value
    if (current) setVisitFlag(current.uid, false)
    if (isFirebaseConfigured) await signOut(getFirebaseAuth())
    user.value = null
    verified.value = false
    visit.value = null
  }

  return {
    ready,
    isConfigured: isFirebaseConfigured,
    currentUser,
    displayName,
    isLoggedIn,
    needsVerification,
    pendingEmail,
    lastVisit,
    init,
    register,
    login,
    sendPasswordReset,
    resendVerification,
    refreshVerification,
    logout,
  }
})
