# Taskly

A to-do app built with Vue 3 and TypeScript.

**Live demo:** https://annatsygichko-fe.github.io/taskly/

## Features

- Sign up and sign in with email and password
- Email confirmation: a confirmation link is sent after sign-up
- Password reset by email
- Show / hide password button
- Every user has their own task list
- Add, edit (double-click), complete, delete and search tasks
- Filters (all / to do / done), counters and a progress bar
- Pages with a navigation menu: Tasks, Profile, Settings
- Profile shows the date of the last visit and task statistics
- Interface languages: English, Ukrainian, German
- Light, dark and system theme
- Responsive layout with a mobile menu, keyboard accessible

## Stack

- Vue 3 (Composition API, `<script setup>`)
- TypeScript (`strict`)
- Pinia for shared state
- Vue Router (hash mode, route guards)
- Vue I18n for translations
- Firebase Authentication (email and password, confirmation and reset emails)
- Vite for the dev server and build
- Vitest for unit tests
- GitHub Actions and GitHub Pages for deployment

## Project structure

```
src/
  components/   AppHeader, LanguageSwitcher, ThemeToggle, TaskForm,
                TaskFilters, TaskItem, ProgressBar
  composables/  useLocalStorage, useAppearance, useDateFormat
  i18n/         en.ts, uk.ts, de.ts, index.ts, languages.ts
  router/       routes and navigation guard
  stores/       auth, settings, tasks (and their tests)
  utils/        email validation
  views/        Tasks, Login, Profile, Settings, NotFound
  firebase.ts   Firebase setup
  types.ts      shared types
  App.vue       layout
  main.ts       entry point
```

## Set up Firebase (once)

1. Open https://console.firebase.google.com, create a project and add a **Web app**.
2. Copy the config values (`apiKey`, `authDomain`, `projectId`, `appId`).
3. In the project: **Authentication → Sign-in method → Email/Password → Enable**.
4. In **Authentication → Settings → Authorized domains** add the domain of the
   deployed site (for example `your-login.github.io`). `localhost` is already there.
5. Copy `.env.example` to `.env` and paste the values. Restart `npm run dev` after editing it.
6. For the deployed site: in the GitHub repository open **Settings → Secrets and variables → Actions**
   and add four repository secrets with the same names as in `.env.example`.

## Run locally

```bash
npm install
npm run dev      # development server
npm test         # unit tests
npm run build    # type-check + production build into dist/
```

## Note on the keys

The Firebase web config is not a secret: it ends up in the public bundle of any site that uses it.
Access is controlled by Firebase Authentication and by the list of authorized domains.
