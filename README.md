# Skill Matcher

Skill Matcher is a full-stack Java + React application for registering users, capturing their skills, and finding complementary teammates for hackathons or small project teams.

The repository contains two apps:

- `demo/` - Spring Boot backend with JWT authentication, skill management, and matching logic.
- `frontend/` - React + Vite UI for login, registration, skill management, and viewing matches.

## What It Does

- Register users with a name, email, password, and role.
- Log in and receive a JWT for authenticated requests.
- Add, list, and delete skills for the signed-in user.
- Find users with complementary skills based on the current account's skill set.
- Run locally with H2 out of the box, or package the backend in Docker.

## Tech Stack

- Backend: Spring Boot 4, Spring Security, Spring Data JPA, JWT, Lombok
- Database: H2 by default, with MySQL and PostgreSQL drivers included
- Frontend: React 19, Vite, Axios, React Router
- Build tools: Gradle, npm

## Project Structure

```text
skill_matcher/
|-- demo/         Spring Boot backend
|-- frontend/     React + Vite frontend
|-- Dockerfile    Backend container image
|-- README.md     Project overview and setup
```

## Prerequisites

- Java 21
- Node.js 18 or newer
- npm
- Optional: Docker

## Quick Start

### 1. Run the backend

From the repository root:

```bash
cd demo
./gradlew bootRun
```

On Windows PowerShell:

```powershell
cd demo
.\gradlew.bat bootRun
```

The backend starts on `http://localhost:8080`.

### 2. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

## Local Configuration

The backend is configured to use an in-memory H2 database by default:

- JDBC URL: `jdbc:h2:mem:testdb`
- H2 console: `http://localhost:8080/h2-console`

If you want persistent storage, update `demo/src/main/resources/application.properties` with your own database settings.

## Frontend API Target

The React app currently points to the deployed backend URL in `frontend/src/Login.jsx` and `frontend/src/Dashboard.jsx`.

For local development, change the axios base URL and login/register endpoints to your local backend, for example:

```text
http://localhost:8080/api
```

## Features

### Authentication

- `POST /api/register` creates a new user.
- `POST /api/login` validates credentials and returns a JWT.

### Skills

- `POST /api/skills/add?skillName=...` adds a skill to the current user.
- `GET /api/skills/my-skills` lists the current user's skills.
- `DELETE /api/skills/delete/{skillId}` removes one of the current user's skills.

### Matching

- `GET /api/matches` returns users whose skill sets are complementary to the current user.

## API Overview

All protected endpoints expect an `Authorization` header in the form:

```text
Bearer <jwt>
```

### Public Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Authenticate and receive a JWT |

### Protected Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/skills/my-skills` | Get the current user's skills |
| POST | `/api/skills/add` | Add a new skill for the current user |
| DELETE | `/api/skills/delete/{skillId}` | Delete one of the current user's skills |
| GET | `/api/matches` | Get complementary user matches |

## Docker

The root `Dockerfile` builds the backend into a single runtime image.

```bash
docker build -t skill-matcher-backend .
docker run -p 8080:8080 skill-matcher-backend
```

## Example Workflow

1. Register two users with different roles.
2. Log in as one user.
3. Add a few skills such as Java, React, or SQL.
4. Open the dashboard to see the user list returned by the matching endpoint.

## Notes

- JWT tokens are generated with a fixed signing key in `JwtUtil`.
- Security is configured with CORS for common local and deployed frontend origins.
- Passwords are currently stored as plain text. If you plan to use this in production, add password hashing immediately.

## Troubleshooting

- If login fails from the frontend, verify the backend URL in the React app.
- If you see database errors, confirm that the backend is using the expected datasource configuration.
- If protected requests return `401` or `403`, make sure the token is present in local storage and sent as `Bearer <jwt>`.

## License

No license has been specified yet.
