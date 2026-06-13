# Dental Record Management System (DRMS) - Philippines

A full-featured Dental Record Management System tailored for local network (LAN) deployment in the Philippines.

## 🛠 Tech Stack
- **Frontend**: Vue.js 3 + Vuetify (Javascript)
- **Backend**: Node.js + Fastify
- **Database**: PostgreSQL + Knex
- **Deployment**: Docker Compose

## 📦 Installation (Windows 11)
1. Ensure **Docker Desktop** is installed and running.
2. Open PowerShell as Administrator.
3. Navigate to the `docker/` directory.
4. Run: `./install.ps1`

## 👨‍💻 Development Workflow
### Backend
```bash
cd backend
npm install
npx knex migrate:latest
npx knex seed:run
npm run dev
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📄 API Documentation
Access the interactive Swagger documentation at `http://localhost:3000/docs`.

## 🔐 Security
Sensitive patient data is encrypted at the application layer using AES-256 (RA 10173 compliant).
