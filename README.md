# IHRD PARIHAARAM

**Institutional Student Complaint and Grievance Management Platform**

PARIHAARAM is a React web application and Spring Boot service for submitting and handling student grievances across IHRD colleges. The repository contains student, college administrator, and faculty workflows, along with public college and complaint-statistics pages.

## Problem and objectives

Student concerns about campus facilities and services need a visible, consistent path from submission to review and resolution. PARIHAARAM provides a central interface to report and track issues, route them to college administrators and assigned faculty, and record status changes.

The project aims to:

- Make complaint submission and progress visible to students.
- Give college administrators tools to review, prioritize, assign, and resolve complaints.
- Let faculty view issues assigned to them.
- Provide public college, statistics, and leaderboard pages.

## Features

### Student portal

- Student registration and sign-in.
- Submit complaints with category, college, and supporting evidence.
- View submitted reports and their status/history.
- Confirm a resolution or request that a complaint be reopened.

### Administrator portal

- View and manage complaints for the administrator's college.
- Assign complaints to departments or faculty.
- Update complaint status and record resolution information.
- Manage student and faculty accounts.
- View dashboard statistics, notifications, and audit-log entries.

### Faculty portal and account management

- College administrators can create and list faculty accounts.
- Faculty can sign in and view complaints assigned to them; the backend faculty endpoint is read-only.

### Complaint tracking and lifecycle

The backend defines the statuses `SUBMITTED`, `UNDER_REVIEW`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, and `REOPENED`. Students can confirm a resolution to close a complaint or request that a resolved complaint be reopened. Administrators can review, assign, and update complaints.

Other implemented public pages include college listings and details, statistics, and a leaderboard. Evidence-upload endpoints and notification flows are also present.

> **Implementation note:** The repository contains both Spring Boot API services and localStorage-backed, seeded demo data/authentication flows in the frontend. The frontend is therefore a prototype/hybrid; verify that each workflow is using the backend before treating its data as production-persisted. Demo seed accounts and passwords in the source are for local demonstration only and must not be used for real accounts.

## Technology stack

### Frontend

- React 19 with JavaScript and JSX (not TypeScript).
- Vite 8 for development and production builds.
- React Router for client-side routes.
- Tailwind CSS 4 and regular CSS.
- Axios for REST calls; Leaflet/React Leaflet and Recharts are also dependencies.
- Oxlint for linting.

### Backend

- Java 25 and Spring Boot 3.5.
- Spring Web, Spring Security, Spring Data JPA, and Bean Validation.
- JWT-based API authentication.
- PostgreSQL for the production profile; an in-memory H2 database for the development profile.
- Flyway database migrations and Maven Wrapper.

## Frontend architecture and API integration

The Vite entry point is `src/main.jsx`; routes are composed in `src/App.jsx`. UI is organized under `src/pages/` and `src/components/`, with shared API clients and feature services under `src/services/`.

The API client reads `VITE_API_URL` and defaults to `/api`. During local development, Vite proxies `/api` to `http://localhost:8080` (see `vite.config.js`). The backend exposes authentication, public information, student complaint, administrator, faculty, and evidence endpoints under `/api`.

The backend issues JWTs. The frontend API client attaches its stored token to API requests. The backend requires `JWT_SECRET`; production database settings are supplied through environment variables. Do not put credentials in frontend `VITE_*` variables, because Vite embeds those values in the client build.

## Requirements

- Node.js and npm compatible with the versions in `package-lock.json`.
- Java 25 for the backend.
- PostgreSQL only when using the backend's `prod` profile; the default `dev` profile uses in-memory H2.

## Installation and development

From the repository root, install the locked frontend dependencies:

```sh
npm ci
```

Configure the frontend if needed by creating a local `.env.local` file containing:

```dotenv
VITE_API_URL=/api
```

The `.env.example` file is a reference for frontend and backend settings. Vite reads the `VITE_*` value; Spring Boot does **not** load `.env.example` automatically. Set backend variables in the backend process environment or through your deployment's secret manager.

Set a private, randomly generated JWT secret of at least 32 bytes before starting the backend. For PowerShell:

```powershell
$env:JWT_SECRET = "<your-private-random-secret-of-at-least-32-characters>"
```

Start the backend in development mode:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

On macOS/Linux, run `./mvnw spring-boot:run` from `backend/`. The backend listens on port `8080`; development uses an in-memory database, so its database contents do not persist across restarts.

In a second terminal at the repository root, run the frontend:

```sh
npm run dev
```

Vite prints the local development URL when ready.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run lint` | Run Oxlint. |
| `npm run build` | Create the optimized frontend build in `dist/`. |
| `npm run preview` | Preview the production frontend build locally. |

Build the backend from `backend/` with `.\mvnw.cmd clean package` (PowerShell) or `./mvnw clean package` (macOS/Linux).

## Production build and deployment

1. Build the frontend with `npm ci` and `npm run build`.
2. Deploy the contents of `dist/` to a static web host.
3. Build and deploy the backend JAR using the Maven Wrapper.
4. Configure the backend with `SPRING_PROFILES_ACTIVE=prod`, a strong private `JWT_SECRET`, `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD`. Set `CORS_ALLOWED_ORIGINS` to the deployed frontend origin and configure `FILE_STORAGE_PATH` to durable storage for uploaded evidence.
5. Route `/api` from the frontend host/reverse proxy to the backend, or set `VITE_API_URL` to the API origin when building the frontend. If serving the API cross-origin, configure the corresponding backend CORS origin.

Never commit `.env` files, production credentials, uploaded evidence, or generated build output. `.gitignore` excludes these local/runtime files; `.env.example` contains placeholders only.
