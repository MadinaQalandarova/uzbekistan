# O'zGezer Technical Decisions

## Application Strategy

- Build web first
- Delay mobile implementation until the web product reaches a stable post-launch state
- Keep one primary web repository for Phases 0-3

## Confirmed Stack

- Framework: `Next.js 14` with App Router
- Language: `TypeScript`
- Styling: `Tailwind CSS`
- UI primitives: `shadcn/ui`
- Database ORM: `Prisma`
- Database host: `Supabase PostgreSQL`
- Authentication: `NextAuth`
- Internationalization: `next-intl`
- Media: `Cloudinary`
- Hosting: `Vercel`

## Mapping Choice

- Default provider: `Google Maps`
- Fallback option: `Mapbox` if pricing or quota becomes a blocker

Reasoning:

- Google Maps has strong familiarity and embed support
- The product can switch later if interactive usage costs grow faster than expected

## Localization Strategy

- Route prefixes: `/uz`, `/ru`, `/en`
- Static UI translations stored in `messages/*.json`
- Place content translated at the database layer with dedicated fields

## Security and Permissions

- Admin routes protected in middleware
- Contributor permissions separated from general registered users
- Public content should expose only published places and approved reviews

## Initial Folder Structure

The first coding sprint should create this structure:

```text
app/
components/
lib/
messages/
prisma/
public/
types/
```

## Environment Variables To Prepare

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `GOOGLE_MAPS_API_KEY`
