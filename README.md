# Zenetra landing page

Next.js (App Router) build of the Zenetra marketing page. All content and demo data (TestCo) lives in `lib/content.ts`; each page section is a component in `components/`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Deploy with `npx vercel deploy` from this folder. The page is set to `noindex` while copy and demo data are being finalised (see `robots` in `app/layout.tsx`).

## Demo requests

The form posts to `POST /api/enquiry` (`app/api/enquiry/route.ts`, logic in `lib/enquiry.ts`). Each request is validated, saved, then emailed to the team with the requester as reply-to. A hidden honeypot field and a per-address rate limit filter out basic spam.

Configure it with the variables in `.env.example` (copy to `.env.local`, and add them in Vercel):

- **Email:** `SMTP_*`, `ENQUIRY_TO`, `ENQUIRY_FROM`. Works with Zoho Mail, SMTP2GO or Brevo SMTP.
- **Storage:** `DATABASE_URL` for any Postgres (for example Neon from the Vercel Marketplace). The `enquiries` table is created on first use. Without it, development saves to `.data/enquiries.jsonl` and production sends email only.

If neither email nor storage succeeds, the form shows an error and nothing is lost silently.
