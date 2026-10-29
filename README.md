# Zenetra landing page

Next.js (App Router) build of the Zenetra marketing page. All content and demo data (TestCo) lives in `lib/content.ts`; each page section is a component in `components/`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Deploy with `npx vercel deploy` from this folder. The page is set to `noindex` while copy and demo data are being finalised (see `robots` in `app/layout.tsx`).

## Demo requests

The form posts to `POST /api/enquiry` (`app/api/enquiry/route.ts`, logic in `lib/enquiry.ts`). Each request is validated, emailed to the team with the requester as reply-to, and saved as a private JSON file. A hidden honeypot field and a per-address rate limit filter out basic spam.

Configure it with the variables in `.env.example` (copy to `.env.local`, and add them in Vercel for Production, then redeploy):

- **Email (Gmail):** `SMTP_USER` (the Gmail address, which also receives the enquiries) and `SMTP_PASS` (a Google App Password). `ENQUIRY_TO`, `SMTP_HOST` and `SMTP_PORT` are optional.
- **Storage (Vercel Blob):** create a private Blob store and connect it to the project; Vercel adds `BLOB_READ_WRITE_TOKEN`. Enquiries are saved under `enquiries/YYYY-MM/` and can be viewed in the Vercel Storage tab. In development without a token they go to `.data/enquiries.jsonl`.

If neither email nor storage succeeds, the form shows an error and the server log names the cause.
