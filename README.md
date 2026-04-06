# Inventory Management Mobile Application

Production-style project skeleton for a mobile inventory management system with a React Native CLI frontend and a Node.js + Express + PostgreSQL backend.

## Project Structure

```text
inventory-management-app/
|- backend/
|  |- config/
|  |- controllers/
|  |- db/
|  |- middleware/
|  |- routes/
|  |- services/
|  |- utils/
|  |- app.js
|  |- server.js
|  |- package.json
|  `- .env.example
`- frontend/
   |- src/
   |  |- components/
   |  |- context/
   |  |- navigation/
   |  |- screens/
   |  `- services/
   |- App.js
   |- package.json
   `- .env.example
```

## Backend Highlights

- JWT authentication and bcrypt password hashing
- Role-based route protection for `ADMIN` and `USER`
- Modular Express architecture with controllers, services, and middleware
- PostgreSQL schema for users, products, and stock logs
- Inventory stock movement tracking with transaction-safe updates

## Frontend Highlights

- Pure React Native CLI app (no Expo runtime)
- Auth context with persisted JWT session
- Stack navigation for auth and app flows
- API service layer using Axios
- Clean screen structure ready for further UI expansion

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
```

Create the database, then run the SQL in [`backend/db/schema.sql`](./backend/db/schema.sql).

If you want a quick local PostgreSQL instance, start the root `docker-compose.yml` first.

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
```

Start Metro in one terminal:

```bash
npm run start
```

With Android Emulator running, launch the app in a second terminal:

```bash
cd frontend
npm run android
```

Set your backend URL in `frontend/src/config/apiConfig.js`.
For Android Emulator use `http://10.0.2.2:5000/api`.
For a physical device use your machine LAN IP, for example `http://192.168.1.100:5000/api`.

## Suggested Enhancements

- Refresh tokens and token rotation
- Request validation with `zod` or `joi`
- Structured logging
- Audit trails for admin actions
- Automated tests for services and route guards
