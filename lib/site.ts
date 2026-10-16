// Site-wide settings for metadata, sitemap and robots.
// Set NEXT_PUBLIC_SITE_URL to the real domain, and NEXT_PUBLIC_SITE_INDEXABLE=true when the page should appear in search.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenetra-landing-preview.vercel.app").replace(/\/$/, "");
export const SITE_INDEXABLE = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

export const SITE_NAME = "Zenetra";
export const SITE_TITLE = "Zenetra | Continuous transaction monitoring and fraud detection";
export const SITE_DESCRIPTION =
  "Zenetra monitors 100% of your transactions for fraud across purchasing, payroll, sales, journals, banking and related parties, in every company in your group. Read-only access to Zoho Books, Tally, SAP and more.";
