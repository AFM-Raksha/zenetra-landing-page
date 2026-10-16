# Zenetra landing page

Next.js (App Router) build of the Zenetra marketing page. All content and demo data (TestCo) lives in `lib/content.ts`; each page section is a component in `components/`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Deploy with `npx vercel deploy` from this folder. The page is set to `noindex` while copy and demo data are being finalised (see `robots` in `app/layout.tsx`).
