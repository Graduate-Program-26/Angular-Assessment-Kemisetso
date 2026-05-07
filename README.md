# Deezer Music App

An Angular 21 music discovery app built with the Deezer API. The app lets users search Deezer's catalogue, browse artists and albums, preview tracks, and manage local playlists that persist in IndexedDB.

## Features

- Search artists, albums, and tracks from Deezer.
- Debounced search powered by RxJS and a signals-first store.
- Browse the global Top 50 chart.
- View artist details, top tracks, and discography.
- Manage playlists locally:
  - create playlists
  - rename playlists
  - delete playlists
  - add tracks to playlists
  - remove tracks from playlists
  - view playlist count and total duration
- Persist playlist data in IndexedDB using Dexie.
- Play Deezer 30-second track previews.
- Standalone Angular components with lazy-loaded feature routes.

## Tech Stack

- Angular 21
- TypeScript strict mode
- Angular Signals
- RxJS
- Dexie / IndexedDB
- PrimeNG
- SCSS
- Deezer API

## Project Structure

```text
src/app
├── core
│   ├── models
│   ├── services
│   └── stores
├── features
│   ├── album
│   ├── artist
│   ├── home
│   ├── playlist
│   └── search
├── shared
│   ├── components
│   ├── layout
│   └── pipes
└── db.ts
```

The app uses a feature-based structure so each major screen owns its view logic and styling, while shared services, stores, models, and pipes live under `core` and `shared`.

## State Management

This project uses Angular Signals instead of NgRx.

Signals are a good fit for this app because most state is local UI state or small shared app state: search results, playlist lists, current player state, loading flags, and errors. Injectable signal stores keep state reusable without the boilerplate of actions, reducers, and effects.

I still used RxJS is still used where it is the better tool:

- debounced search input
- `switchMap` for cancelling stale search requests
- `forkJoin` for loading related artist data
- Dexie `liveQuery()` interop

## Deezer API

The app calls Deezer through the Angular development proxy configured in `proxy.conf.json`.

```json
{
  "/api": {
    "target": "https://api.deezer.com",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

This allows app code to call `/api/...` while the dev server forwards requests to `https://api.deezer.com/...`.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run start
```

Open:

```text
http://localhost:4200/
```

## Scripts

```bash
npm run start
```

Runs the Angular development server.

```bash
npm run build
```

Builds the app for production.

```bash
npm run lint
```

Runs ESLint.

## Screenshots

I will add Screenshots here before submission.

### Home

will add screenshot here.

### Search

Add screenshot here.

### Artist Details

Add screenshot here.

### Album Details

Add screenshot here.

### Playlists

Add screenshot here.

## Documentation And References

- Deezer API: https://developers.deezer.com/api
- Deezer chart endpoint reference: https://stackoverflow.com/questions/29748780/getting-most-listened-to-tracks-by-country-using-deezer-api
- Angular Signals: https://angular.dev/guide/signals
- Angular dependency injection: https://angular.dev/guide/dependency-injection
- PrimeNG styled theming: https://primeng.org/theming/styled
- PrimeNG tabs: https://primeng.org/tabs
- HTMLAudioElement API: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
- Dexie TypeScript docs: https://dexie.org/docs/Typescript
- Dexie `liveQuery()`: https://dexie.org/docs/liveQuery()
- Angular project structure guide: https://medium.com/@dragos.atanasoae_62577/angular-project-structure-guide-small-medium-and-large-projects-e17c361b2029
- Meaningful Git commit messages: https://medium.com/@iambonitheuri/the-art-of-writing-meaningful-git-commit-messages-a56887a4cb49

## Notes

Playlist data is stored locally in the browser with IndexedDB. Clearing browser site data will remove saved playlists.

No Deezer credentials are required for the current public API usage in this project.
