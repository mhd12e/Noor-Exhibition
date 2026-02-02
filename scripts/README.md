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

## 📂 Category Management (`category-management.ts`)

Manage project categories for the exhibition.

### 1. List All Categories
```bash
npx tsx scripts/category-management.ts list
```

### 2. Add a Category
```bash
npx tsx scripts/category-management.ts add "Robotics"
```

### 3. Remove a Category
Note: You cannot remove a category that still has projects assigned to it.
```bash
npx tsx scripts/category-management.ts remove "Robotics"
```

## 🚀 Project Management (`project-management.ts`)

Manage exhibition projects and their assets directly from the CLI.

### 1. List All Projects
```bash
npx tsx scripts/project-management.ts list
```

### 2. Add a Project
This command processes the cover image and uploads all assets to R2 automatically.
```bash
npx tsx scripts/project-management.ts add \
  "Smart Garden" \
  "An automated irrigation system" \
  2026 \
  "Ahmed Ali;Sara Omar" \
  "Robotics" \
  "./assets/cover.jpg" \
  "./assets/demo.mp4"
```

### 3. Remove a Project
This will delete the database record and the associated files from R2.
```bash
npx tsx scripts/project-management.ts remove <project-id>
```

---

> **Note:** The script automatically loads configuration from the `.env` file in the project root. Ensure `DATABASE_URL` is correctly set there.
