# Offline Comments MVP

A **modern offline-first comment system** built with React, TypeScript, and RxDB. Features responsive UI, nested comments, cross-tab sync, and extensible architecture for real-world sync and conflict resolution.

| Layer         | Stack & Tooling                                                                               |
| ------------- | --------------------------------------------------------------------------------------------- |
| **DB**        | RxDB (IndexedDB, in-memory for tests) · Vector clocks for sync/conflict · Schema-typed        |
| **App Logic** | TypeScript · Application/Presentation/Infrastructure layering · Handler-based testable logic  |
| **Frontend**  | React 18 · Vite 6 · TypeScript · CSS Modules · Theming · Modern accessibility/focus UX        |
| **Sync**      | Service stubs for replication & conflict resolution · Extensible for P2P, server, or LAN sync |
| **Dev DX**    | Single package.json · Fast Vite HMR · Jest + Testing Library · SWC for fast TS tests          |

---

## 1 Quick start

```bash
nvm use              # ensure correct Node version
npm install          # install dependencies
npm run dev          # start Vite dev server (http://localhost:5173)
```

_Open http://localhost:5173 and try adding, replying, and deleting comments (works offline!)._

---

## 2 Project structure

```text
.
├── src/
│   ├── application/
│   │   ├── handlers/         # Pure logic for comment CRUD, cascade delete, etc.
│   │   └── hooks/            # usePosts (wires handlers to React state)
│   │
│   ├── infrastructure/
│   │   └── db/               # RxDB setup, schema, and types
│   ├── presentation/
│   │   ├── components/       # Button, Comment, Header components
│   │   └── theme/            # CSS variables, reset
│   ├── services/             # Replication & conflict resolution stubs
│   └── styles.d.ts           # CSS module types
├── __tests__/                # Jest + Testing Library (unit & integration)
├── index.html                # Vite entry
├── package.json              # Scripts, dependencies
└── vite.config.ts            # Vite config
```

---

## 3 Core features

- **Offline-first**: All data is stored locally (IndexedDB via RxDB)
- **Nested comments**: Nested comments with cascade delete
- **Pixel-perfect UI**: Modern, accessible, keyboard-friendly
- **Cross-tab sync**: Comments update in real time across browser tabs
- **Extensible sync**: Service stubs for server/P2P replication & conflict resolution
- **Testable logic**: Handlers are pure functions, easily tested without React

---

## 4 Scripts

| command         | description                             |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start Vite dev server (frontend, HMR)   |
| `npm run build` | Type-check & build for production       |
| `npm test`      | Run all Jest tests (unit & integration) |

---

## 5 Replication & Sync Possibilities

- **RxDB Replication**: Easily connect to a remote CouchDB, server, or P2P backend for real-time sync.
- **Conflict Resolution**: Vector clocks and service stubs allow custom merge strategies for distributed data.
- **LAN/Peer-to-Peer**: RxDB supports P2P sync (e.g., via WebRTC) for local-first, serverless collaboration.
- **Extensible**: Plug in your own sync/replication logic in `src/services/replication.ts` and `conflictResolution.ts`.

---

## 6 Testing strategy

- **Unit** – Handlers (add, delete, cascade) tested directly with in-memory RxDB
- **Integration** – UI and hooks can be tested with Testing Library (see notes re: RxDB observables)
- **E2E** – Browser/E2E tests recommended for full offline/online and sync scenarios

---

## 7 Roadmap / improvement ideas

| Category          | Idea                                                             |
| ----------------- | ---------------------------------------------------------------- |
| **Sync**          | Implement real server or P2P replication (CouchDB, WebRTC, etc.) |
| **Conflict**      | Add UI for conflict resolution, merge previews                   |
| **Persistence**   | Add user auth, multi-user support                                |
| **Testing**       | Add Playwright/Cypress E2E for offline/online flows              |
| **Accessibility** | Further ARIA roles, screen reader optimizations                  |
| **DevX**          | Add ESLint, Prettier, and GitHub Actions CI                      |
| **Features**      | Markdown support, edit history, reactions, moderation            |

---

## Troubleshooting

This app is designed to be offline-first and should work perfectly fine in most modern browsers. However, if you encounter issues (such as the app not loading, comments not persisting, or unexpected errors), please consider the following:

- **Chrome Profiles & Extensions:** Some Chrome extensions or specific browser profiles may block required functionality (such as IndexedDB, local storage, or service workers). If you experience issues, try the following:
  - Use a different Chrome profile/account.
  - Open the app in an Incognito window (with extensions disabled by default).
  - Disable suspicious or privacy/security extensions temporarily to see if they are interfering.

If problems persist, please report them with details about your browser, OS, and any relevant extensions.

---
