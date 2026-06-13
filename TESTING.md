# Testing Guidelines for DRMS

## 🧪 Backend Testing (Manual)
Use the Swagger UI at `http://localhost:3000/docs` to test endpoints.

### Authentication Flow
1. Call `POST /api/auth/login` with:
   - Username: `admin`
   - Password: `password123`
2. Copy the `token` from the response.
3. Click the "Authorize" button in Swagger and enter `Bearer <your_token>`.

### Clinical Flow Testing
1. **Patient**: Create a patient via `POST /api/patients`.
2. **Treatment**: Record a visit via `POST /api/treatments/record`.
   - Verify that the inventory count for linked items (e.g., Anesthesia) decreases in the `inventory` table.
3. **Billing**: Create an invoice via `POST /api/billing/invoices` using the treatment record IDs.

## 👁 Frontend Visual Verification
1. Login with `admin` / `password123`.
2. Navigate to "Patients" and add a new record.
3. Use the "Stethoscope" icon to enter the **Clinical Workspace**.
4. Select procedures and save the visit.
5. Verify the history appears at the bottom.

## 🛡 Security Verification
1. **Encryption**: Check the `patients` table in PostgreSQL. Fields like `first_name` and `address` should be hex strings (e.g., `iv:encrypted_data`), not plain text.
2. **Permissions**: Try to access `/api/billing` with the `dentist1` user. It should return `403 Forbidden`.

## 💾 Backup Verification
Run the backup script manually to ensure SQL dumps are generated:
`docker exec drms-db /usr/local/bin/backup.sh`
Check `docker/data/postgres/backups` for the `.sql` file.
