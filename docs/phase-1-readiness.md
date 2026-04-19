# Phase 1 Readiness Checklist

## Goal

Move from specification into the first coding sprint without reopening product-level decisions.

## Setup Commands

Run these in order once development starts:

```bash
npx create-next-app@latest ozgezer --typescript --tailwind --app
cd ozgezer
npm install prisma @prisma/client next-auth next-intl cloudinary zod
npx prisma init
npx shadcn-ui@latest init
```

## Required Setup Tasks

- Create the web app using Next.js App Router
- Add the folder structure from the technical decisions document
- Add the environment variables from the approved stack
- Connect the project to Supabase PostgreSQL
- Copy the initial schema from [`prisma/schema.prisma`](C:\Users\User\Desktop\YashinOzbekiston\prisma\schema.prisma)

## Seed Scope For The First Dataset

- 14 regions
- 5 categories
- 20 to 30 starter places

Starter region coverage should prioritize:

- Samarkand
- Bukhara
- Khiva
- Tashkent

## First Sprint Build Order

1. Project setup
2. Prisma schema
3. Initial migration
4. Seed data
5. Root layout and navigation

## Ready-To-Start Definition

Phase 1 can start when:

- repo is created
- Vercel project is connected
- Supabase project is available
- authentication provider keys are collected
- Cloudinary account is ready
- map provider key is chosen
