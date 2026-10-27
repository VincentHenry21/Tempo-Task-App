# Tempo — Plan smarter. Ship faster.

Tempo is a scheduling and planning app for GitHub users, built with Expo (React Native) + TypeScript + expo-router. Tasks, a calendar, and weekly work tracking, synced with GitHub issues.

## Use it on your phone (no computer)

Once the site is live, open this link on your phone and use Tempo like any web app:

https://vincenthenry21.github.io/Tempo-Task-App/

No install and no computer needed. Your tasks are saved in the browser on your phone. Tap "Try demo" to explore with seeded data, or sign in with a personal access token to sync real GitHub issues. GitHub OAuth sign-in is only available in the native app, not on the web.

## Quick start (run these in order)

```bash
npm install
npm run icons
npx expo start
```

`npm run icons` generates the real app icons (light, dark, tinted, Android adaptive, splash, favicon) into `assets/` from `scripts/generate-icons.js`. Run it once after install and again any time the icon artwork changes. Then scan the QR code with Expo Go, or press `i` for the iOS simulator and `a` for Android.

## Testing the icons on device

- Light icon: install a development build (Expo Go shows its own icon, not the app icon) and look at the home screen in light mode.
- Dark icon: switch the device to dark mode; iOS 18 and later shows `icon-dark.png` on the home screen.
- Tinted icon: on iOS 18 and later, long-press the home screen, tap Edit, then Customize, then pick the Tinted style; the home screen should show `icon-tinted.png` (grayscale pills, no color) recolored by the system.
- Android adaptive icon: install on Android and check the launcher in both light and dark mode, and in a themed-icon view; the foreground, background, and monochrome images come from `assets/adaptive-*.png`.
- Splash screen: relaunch the app cold and confirm the splash shows the foreground artwork on the light (`#EAF0FF`) or dark (`#070A12`) background.

## Requirements

- Node.js 18 or newer
- npm
- An iPhone or iPad with Expo Go installed (for on-device runs), or Xcode / Android Studio for simulators

## Install and run

```bash
cd tempo
npm install
npm run icons
npx expo start
```

Then scan the QR code with Expo Go, or press `i` for the iOS simulator and `a` for Android.

## Run on iPhone (Expo Go)

1. Install Expo Go from the App Store.
2. Run `npx expo start` on the same Wi-Fi network as the phone.
3. Scan the QR code in the terminal with the Camera app (iOS) or inside Expo Go (Android).
4. The app opens with the welcome screen. No configuration is needed: tap "Try demo" to explore with seeded data.

## Run on iPad

The same steps apply. Tempo detects tablet widths (768pt and up) and adapts:

- iPad portrait: content is centered with a 720pt max width.
- iPad landscape and large screens: a two-pane layout shows Task Overview on the left and the calendar on the right, and the floating tab bar becomes a vertical pill on the left edge.
- Split View and Stage Manager resizing are handled live through `useWindowDimensions`, without losing state.

## GitHub OAuth setup

Tempo uses GitHub OAuth via `expo-auth-session` with the `tempo://auth` callback.

1. Go to GitHub Settings, then Developer settings, then OAuth Apps, and create a new OAuth App.
2. Set the Authorization callback URL to `tempo://auth`.
3. Copy the Client ID.
4. Create a `.env` file in the project root (never commit it):

```bash
EXPO_PUBLIC_GITHUB_CLIENT_ID=your_client_id_here
```

5. Restart the dev server with `npx expo start --clear`.
6. On the login screen, tap "Continue with GitHub".

Note: exchanging an OAuth authorization code for a token requires a client secret, which must live on a backend, never in the app. Tempo therefore treats the OAuth code step as the entry point and always offers the two fully working sign-in paths below, so the app never dead-ends.

## Personal access token (PAT) setup

1. Go to GitHub Settings, then Developer settings, then Personal access tokens, then Tokens (classic).
2. Generate a new token with the `repo` and `read:user` scopes.
3. On the login screen, tap "Use a personal access token", paste the token, and sign in.
4. Tempo validates the token against `GET https://api.github.com/user` and stores it only on the device: in `expo-secure-store` on native, and in browser local storage on the web. It is never logged.

## Demo mode

Tap "Try demo" on the login screen. Demo mode signs in with seeded tasks dated relative to today, needs no network, and never touches GitHub.

## Features

- Home Task Overview with counts, a hero progress card, and a Monthly Working Hours chart, all computed from real task data
- Calendar with a lime month grid, task dots, range selection, and a Working Status meter
- Searchable, filterable task list with swipe to complete and pull to refresh
- Daily schedule timeline from 6:00 to 22:00 with tap-to-place task creation
- Planner overview with weekly hours, per-label counts, and up-next tasks
- Light and dark mode with a System / Light / Dark override saved in AsyncStorage
- GitHub sync: assigned issues become tasks, creating a linked task creates a real issue, completing one closes it, with 401, 403, offline, and empty-state handling and an AsyncStorage cache

## How to push to GitHub

```bash
git init
git add .
git commit -m "Tempo initial"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
```

Replace `<repo-url>` with your repository URL. Do not commit a `.env` file or any token.
