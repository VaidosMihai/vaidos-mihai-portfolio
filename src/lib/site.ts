export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_URL?.trim()
    ? `https://${process.env.VERCEL_URL.trim()}`
    : "http://localhost:3000");

export const GITHUB_URL = "https://github.com/VaidosMihai";
export const LINKEDIN_URL = "https://linkedin.com/in/mihai-vaidos-092900207";
export const CONTACT_EMAIL = "vaidos.mihaiiulian@gmail.com";

export const DEFAULT_FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
export const FORMSUBMIT_ENDPOINT =
  process.env.NEXT_PUBLIC_FORMSUBMIT_ENDPOINT?.trim() || DEFAULT_FORMSUBMIT_ENDPOINT;
