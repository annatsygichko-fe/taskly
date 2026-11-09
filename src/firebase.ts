import { initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId,
)

let auth: Auth | null = null

// Created on first use, so the app and the tests still load when the keys are missing.
export function getFirebaseAuth(): Auth {
  if (!auth) auth = getAuth(initializeApp(config))
  return auth
}
