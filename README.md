# 🚀 Noor-Ibtikar Exhibition 2026

The official platform for the **Innovation Exhibition 2026** at Noor International School. This application serves as a dynamic showcase for student projects, allowing visitors to explore innovations, watch presentations, and share feedback.

## ✨ Features

### 🌐 Frontend (Visitor Experience)
- **Dynamic Project Gallery**: Real-time fetching of student projects with advanced search and filtering (by Year and Category).
- **Immersive Viewer**: Dedicated project detail pages featuring a custom-built, high-end video player.
- **Interactive Schedule**: A clear, animated timeline of the 3-day exhibition events.
- **Rating System**: A beautiful feedback interface with cookie-based protection to ensure "one-person-one-vote."
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop with native RTL support.

### 🔐 Admin Dashboard (Management)
- **Secure Authentication**: Protected area powered by NextAuth v5 and Argon2 hashing.
- **Project Management**: Full CRUD operations for projects, including:
  - Multi-student creator lists.
  - Automatic image processing (conversion to optimized PNG).
  - Video validation and secure uploads.
  - External link integration.
- **Category Management**: Organize projects into academic fields.
- **Feedback Center**: Monitor and manage visitor reviews and ratings.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [SQLite](https://www.sqlite.org/) with [Prisma ORM](https://www.prisma.io/)
- **Storage**: [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) (S3 Compatible)
- **Auth**: [Auth.js (v5)](https://authjs.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Deployment**: [Docker](https://www.docker.com/) & Docker Compose

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker (for production)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file (see `.env.example` if available, or include `DATABASE_URL`, `AUTH_SECRET`, and R2 credentials).

### Database Setup
Initialize the database and generate the Prisma client:
```bash
npx prisma migrate dev
```

### User Management
Add your first admin user via the CLI:
```bash
npx tsx scripts/user-management.ts add your-email@example.com
```

### Development
Run the development server with Turbopack:
```bash
npm run dev
```

### Production (Docker)
Build and launch the optimized production container:
```bash
docker compose up -d --build
```
The app will be available at `http://localhost:4232`.

## 📂 Project Structure
- `/app`: Next.js pages and routing.
- `/components`: Reusable UI elements and complex section components.
- `/lib`: Modular logic, including database initialization, S3 utilities, and split Server Actions.
- `/prisma`: Database schema and migrations.
- `/public`: Static assets (Logo, placeholders).
- `/scripts`: CLI utilities for backend management.

---

**Built with ❤️ by [mhd12](https://mhd12.dev)**
&copy; 2026 Noor International School