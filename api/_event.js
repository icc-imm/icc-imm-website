import { neon } from "@neondatabase/serverless";

export const EVENT_URL = "https://icc-imm-website.vercel.app/events/leadership-2026/";
export const EVENT_TITLE = "Leadership in Times of Change / Ηγεσία σε Εποχές Αλλαγής";
export const PRIVACY_NOTICE_VERSION = "2026-09-25-draft-1";
export const NOTIFICATION_RECIPIENTS = ["director-imm@iccwbo.gr", "iccgr@otenet.gr"];

export const json = (response, status, body) => {
  response.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(body));
};

export const configuration = () => ({
  database: Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL),
  email: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM),
  admin: Boolean(process.env.ADMIN_API_KEY),
});

export const getDatabase = () => {
  const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("POSTGRES_URL or DATABASE_URL is not configured");
  return neon(databaseUrl);
};

export const ensureSchema = async (sql) => {
  await sql`
    CREATE TABLE IF NOT EXISTS event_registrations (
      id BIGSERIAL PRIMARY KEY,
      event_key TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      organization TEXT,
      job_title TEXT,
      marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
      privacy_notice_version TEXT NOT NULL,
      registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      confirmation_sent_at TIMESTAMPTZ,
      notification_sent_at TIMESTAMPTZ,
      program_sent_at TIMESTAMPTZ,
      reminder_sent_at TIMESTAMPTZ,
      email_error TEXT,
      UNIQUE (event_key, email)
    )
  `;
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
    throw new Error("Email service is not configured");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: process.env.RESEND_FROM, to, subject, html }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Email provider returned ${response.status}: ${detail.slice(0, 300)}`);
  }

  return response.json();
};

export const confirmationEmail = (name) => `
  <div style="font-family:Arial,sans-serif;color:#10243f;line-height:1.6;max-width:640px;margin:auto">
    <h1 style="color:#003b8f">Η εγγραφή σας επιβεβαιώθηκε</h1>
    <p>Αγαπητέ/ή ${escapeHtml(name)},</p>
    <p>Η συμμετοχή σας στην εκδήλωση <strong>${EVENT_TITLE}</strong> καταχωρίστηκε επιτυχώς.</p>
    <p><strong>Πέμπτη 8 Οκτωβρίου 2026, 17:30</strong><br>Βιοτεχνικό Επιμελητήριο Αθηνών, Ακαδημίας 18, Αθήνα</p>
    <p>Η κεντρική ομιλία θα πραγματοποιηθεί στα αγγλικά. Το οριστικό πρόγραμμα θα αποσταλεί όταν εγκριθεί.</p>
    <p><a href="${EVENT_URL}" style="color:#075fcf">Πληροφορίες εκδήλωσης</a></p>
    <p>ICC Ελλάς | ICC IMM Hellas</p>
  </div>`;

export const notificationEmail = ({ fullName, email, organization, jobTitle, marketingConsent }) => `
  <div style="font-family:Arial,sans-serif;color:#10243f;line-height:1.6">
    <h1>Νέα εγγραφή εκδήλωσης</h1>
    <p><strong>Εκδήλωση:</strong> ${EVENT_TITLE}</p>
    <p><strong>Ονοματεπώνυμο:</strong> ${escapeHtml(fullName)}<br>
    <strong>Email:</strong> ${escapeHtml(email)}<br>
    <strong>Εταιρεία/Οργανισμός:</strong> ${escapeHtml(organization || "—")}<br>
    <strong>Ιδιότητα:</strong> ${escapeHtml(jobTitle || "—")}<br>
    <strong>Μελλοντικές ενημερώσεις ICC:</strong> ${marketingConsent ? "Ναι" : "Όχι"}</p>
  </div>`;

export const isAuthorized = (request) => {
  const expected = process.env.ADMIN_API_KEY;
  const authorization = request.headers.authorization || "";
  return Boolean(expected && authorization === `Bearer ${expected}`);
};

export const normalizeText = (value, maxLength) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, maxLength) : "";

export const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
