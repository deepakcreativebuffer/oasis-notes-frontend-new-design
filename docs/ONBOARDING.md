# OasisNotes Developer Onboarding Guide

Welcome to the OasisNotes Employee Application! This guide will help you get your local development environment configured and provide an overview of our development workflow.

## 1. Prerequisites
- **Node.js**: `v18.x` or higher (we recommend using NVM).
- **Package Manager**: npm.
- **Git**: Ensure you have SSH keys configured for the repository.

## 2. Project Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd oasisnotes-dev-repo-employee-website
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Request the secure encryption keys and backend URLs from your team lead to populate the `.env` file.

## 3. Running the App

To start the development server:
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

## 4. Code Quality & Pre-commit Hooks

We enforce code quality standards using ESLint, Prettier, and Husky.

- **Linting:** 
  ```bash
  npm run lint
  ```
- **Formatting:** 
  ```bash
  npm run format
  ```
  
*Note: Husky is configured to automatically run lint-staged (which formats and lints your staged files) whenever you execute `git commit`.*

## 5. Architectural Standards (Must Read)

Before pushing code, please familiarize yourself with the following concepts utilized heavily in this project:

- **Centralized API Constants:** NEVER hardcode URLs in React components. Always import the necessary constant from `src/serviceAPI`. Reference `docs/API_DOCUMENTATION.md` for more details.
- **Error Handling Wrapper:** Use the `handleApiRequest` wrapper for all network calls to ensure standardized error parsing and UI notifications.
- **HIPAA Security & Logging:** Use the `logger` utility in `src/utils/logger.js`. Do NOT use raw `console.log` anywhere in the codebase. All logging must go through the logger utility to ensure no Protected Health Information (PHI) is exposed in production.
- **Environment Variables:** Access React env variables through `src/config/env.js` (`REACT_APP_*` in `.env`).

## 6. Deployment
To generate a production build:
```bash
npm run build
```
This generates the minimized, optimized bundle inside the `build/` directory.

**Build memory (code audit):** Do not hardcode `--max-old-space-size` in `package.json`. The build uses Node’s default heap; `craco.config.js` disables parallel Terser to reduce peak memory. If CI hits `heap out of memory`, set `NODE_OPTIONS=--max-old-space-size=8192` in the pipeline only (not in `.env`). Run `npm run verify:build-memory` to confirm scripts stay clean.

---
*For UI component development guidelines, please refer to `docs/STORYBOOK_GUIDE.md`.*
