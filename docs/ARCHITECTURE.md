# OasisNotes Architecture & Decision Records

## Architecture Decision Records (ADR)

### ADR 1: Centralized API Constants
**Date:** 2026-05-22
**Status:** Implemented
**Context:** The codebase contained hundreds of hardcoded string literals inside `axios` and wrapper API calls, leading to typos, difficult refactoring, and poor maintainability.
**Decision:** Extract all backend API URLs into a modular set of constants located in `src/serviceAPI/apis/`. Endpoints requiring dynamic parameters (IDs, pagination) are modeled as functions returning template literals.
**Consequences:** Improved maintainability. All components must import endpoints from `../../serviceAPI`.

### ADR 2: Global Axios Interceptor & Error Handling
**Date:** 2026-05-21
**Status:** Implemented
**Context:** Components were individually catching errors, parsing deeply nested Axios error objects, and frequently leaving console.logs scattered around the codebase.
**Decision:** Implemented a unified `handleApiRequest` wrapper in `src/serviceAPI/core/errorHandler.js` that catches HTTP errors, extracts the cleanest possible message, logs securely to `logger.js`, and standardizes the response signature (`{ success, data, message }`).
**Consequences:** Components are leaner and contain less boilerplate `try/catch` logic.

### ADR 3: State Management
**Date:** Adopted Early in Project
**Status:** Maintained
**Context:** Managing complex, cross-cutting state like Authentication, User Roles, and Organizational parameters across deeply nested React components.
**Decision:** Redux Toolkit (RTK) is the chosen state management solution.
**Consequences:** The store holds sensitive identifiers, offline statuses, and profiles.

### ADR 4: Security & HIPAA Compliance Restrictions
**Date:** 2026-05-22 (Updated: 2026-06-30)
**Status:** Active Enforcement
**Context:** As a healthcare application, the front-end must not expose sensitive cryptographic keys or leave plain-text patient data in unencrypted console outputs.
**Decision:** 
1. Strictly forbid and remove all raw `console.log`, `console.error`, and `console.warn` statements throughout the entire codebase. All logging must utilize the custom `logger.js` (src/utils/logger.js) which completely suppresses logs in production environments to prevent accidental PHI leaks.
2. Migrated encryption to `CryptoUtils.js`, strictly referencing build-time environment variables for secrets, forbidding hardcoded strings.
