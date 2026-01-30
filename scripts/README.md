# 🛠️ Scripts Utility

This directory contains management scripts for the Noor-Ibtikar Exhibition platform.

## 👥 User Management (`user-management.ts`)

Use this script to manage administrative access to the platform without needing a UI.

### 1. List All Users
View all registered administrators:
```bash
npx tsx scripts/user-management.ts list
```

### 2. Add or Update a User
Create a new admin or reset a password (you will be prompted to enter the password securely):
```bash
npx tsx scripts/user-management.ts add <email>
```

### 3. Remove a User
Revoke access for a specific email:
```bash
npx tsx scripts/user-management.ts remove <email>
```

---

> **Note:** The script automatically loads configuration from the `.env` file in the project root. Ensure `DATABASE_URL` is correctly set there.
