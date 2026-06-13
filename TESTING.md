# Testing Guidelines for DRMS

## 🧪 Backend Testing (Manual)
Use the Swagger UI at `http://localhost:3000/docs`.

### Authentication
1. `POST /api/auth/login` with:
   - Username: `admin`
   - Password: `password123`
2. Use the returned `token` in the "Authorize" header as `Bearer <token>`.

### Verification Flows
- **Clinical**: Record a treatment and verify inventory deduction in the DB.
- **Security**: Verify that patient fields (Name, Address) are stored in encrypted format in PostgreSQL.
- **RBAC**: Verify that non-admin users cannot access the Billing module.

## 👁 Frontend Verification
1. Log in to the application.
2. Add a patient.
3. Access the Clinical Workspace via the "Stethoscope" icon.
4. Record procedures and view history.
5. Print an A4 invoice from the Billing/Patient clinical history flow.
