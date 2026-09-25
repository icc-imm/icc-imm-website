import { ensureSchema, getDatabase, isAuthorized, json } from "../_event.js";

const csvCell = (value) => {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return json(response, 405, { message: "Η μέθοδος δεν υποστηρίζεται." });
  }

  if (!isAuthorized(request)) return json(response, 401, { message: "Μη εξουσιοδοτημένη πρόσβαση." });

  try {
    const sql = getDatabase();
    await ensureSchema(sql);
    const rows = await sql`
      SELECT full_name, email, organization, job_title, marketing_consent, registered_at,
             confirmation_sent_at, notification_sent_at, program_sent_at, reminder_sent_at
      FROM event_registrations
      WHERE event_key = 'leadership-2026'
      ORDER BY registered_at ASC
    `;
    const headers = [
      "Ονοματεπώνυμο", "Email", "Εταιρεία/Οργανισμός", "Ιδιότητα", "Marketing consent",
      "Εγγραφή", "Επιβεβαίωση", "Εσωτερική ειδοποίηση", "Πρόγραμμα", "Υπενθύμιση",
    ];
    const csv = [
      headers.map(csvCell).join(","),
      ...rows.map((row) => [
        row.full_name, row.email, row.organization, row.job_title,
        row.marketing_consent ? "Ναι" : "Όχι", row.registered_at,
        row.confirmation_sent_at, row.notification_sent_at, row.program_sent_at, row.reminder_sent_at,
      ].map(csvCell).join(",")),
    ].join("\r\n");

    response.status(200);
    response.setHeader("Content-Type", "text/csv; charset=utf-8");
    response.setHeader("Content-Disposition", 'attachment; filename="leadership-2026-registrations.csv"');
    response.setHeader("Cache-Control", "no-store");
    response.end(`\uFEFF${csv}`);
  } catch (error) {
    console.error("CSV export failed", error);
    return json(response, 500, { message: "Η εξαγωγή δεν ολοκληρώθηκε." });
  }
}
