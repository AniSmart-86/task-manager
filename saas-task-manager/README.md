# SaaS Task Manager

A clean and professional task management platform built with Next.js, MongoDB, and JWT authentication.

## Overview

This project consolidates the previous Express backend and React client into a single Next.js application with API routes under the App Router. It keeps the task management logic, admin workflows, and reporting features while making the setup easier to maintain and deploy.

## Stack

- Next.js 16 App Router
- MongoDB + Mongoose
- JWT authentication
- Tailwind CSS
- Excel export for reports

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
```

## Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_super_secret_key
ADMIN_INVITE_TOKEN=your_admin_token
```

## API Routes

- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/profile`
- `/api/tasks`
- `/api/tasks/[id]`
- `/api/tasks/dashboard-data`
- `/api/users`
- `/api/reports/export/tasks`
- `/api/reports/export/users`

## Notes

The separate legacy `backend` and `client` folders were replaced by the Next.js app structure, and the custom API routes now live inside the app itself.
