# Dental Record Management System (DRMS) - Philippines

A full-featured Dental Record Management System tailored for local network (LAN) deployment in the Philippines.

## 🚀 Features
- **Patient Management**: Secure storage with AES-256 encryption (RA 10173 compliant).
- **Clinical Workspace**: Record procedures with automatic inventory deduction.
- **Billing & Invoicing**: Professional A4 printable invoices in PHP.
- **Inventory Tracking**: Manage dental supplies and low-stock alerts.
- **RBAC**: Customizable permissions for Admin, Dentist, and Staff.

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
# Run migrations
npx knex migrate:latest
# Run seeds
npx knex seed:run
# Start dev server
npm run dev
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📄 API Documentation
Access the interactive Swagger documentation at:
`http://localhost:3000/docs`

## 🔐 Security
- Sensitive data is encrypted at the application layer.
- Ensure the `ENCRYPTION_KEY` in `.env` is kept secure and backed up.
