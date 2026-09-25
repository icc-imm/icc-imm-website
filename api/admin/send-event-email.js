import { EVENT_TITLE, EVENT_URL, ensureSchema, getDatabase, isAuthorized, json, sendEmail } from "../_event.js";

const campaignContent = (type, name) => {
  if (type === "program") {
    const programUrl = process.env.EVENT_PROGRAM_URL;
    if (!programUrl) throw new Error("EVENT_PROGRAM_URL is not configured");
    return {
      subject: `Οριστικό πρόγραμμα | ${EVENT_TITLE}`,
      html: `<div style="font-family:Arial,sans-serif;color:#10243f;line-height:1.6"><p>Αγαπητέ/ή ${name},</p><p>Το οριστικό πρόγραμμα της εκδήλωσης είναι διαθέσιμο.</p><p><a href="${programUrl}">Προβολή προγράμματος</a></p><p><a href="${EVENT_URL}">Σελίδα εκδήλωσης</a></p><p>ICC Ελλάς | ICC IMM Hellas</p></div>`,
    };
  }

  if (type === "reminder") {
    return {
      subject: `Υπενθύμιση | ${EVENT_TITLE}`,
      html: `<div style="font-family:Arial,sans-serif;color:#10243f;line-height:1.6"><p>Αγαπητέ/ή ${name},</p><p>Σας υπενθυμίζουμε την εκδήλωση την Πέμπτη 8 Οκτωβρίου 2026 στις 17:30, στο Βιοτεχνικό Επιμελητήριο Αθηνών, Ακαδημίας 18.</p><p><a href="${EVENT_URL}">Πληροφορίες και οδηγίες πρόσβασης</a></p><p>ICC Ελλάς | ICC IMM Hellas</p></div>`,
    };
  }

  throw new Error("Unsupported campaign type");
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return json(response, 405, { message: "Η μέθοδος δεν υποστηρίζεται." });
  }

  if (!isAuthorized(request)) return json(response, 401, { message: "Μη εξουσιοδοτημένη πρόσβαση." });

  const body = typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body || {};
  const type = body.type;
  if (!['program', 'reminder'].includes(type)) return json(response, 400, { message: "Επιλέξτε program ή reminder." });

  try {
    const sql = getDatabase();
    await ensureSchema(sql);
    const recipients = type === "program"
      ? await sql`SELECT id, full_name, email FROM event_registrations WHERE event_key = 'leadership-2026' AND program_sent_at IS NULL ORDER BY id LIMIT 100`
      : await sql`SELECT id, full_name, email FROM event_registrations WHERE event_key = 'leadership-2026' AND reminder_sent_at IS NULL ORDER BY id LIMIT 100`;

    let sent = 0;
    const failed = [];

    for (const recipient of recipients) {
      try {
        const content = campaignContent(type, recipient.full_name);
        await sendEmail({ to: [recipient.email], ...content });
        if (type === "program") {
          await sql`UPDATE event_registrations SET program_sent_at = NOW() WHERE id = ${recipient.id} AND program_sent_at IS NULL`;
        } else {
          await sql`UPDATE event_registrations SET reminder_sent_at = NOW() WHERE id = ${recipient.id} AND reminder_sent_at IS NULL`;
        }
        sent += 1;
      } catch (error) {
        failed.push({ id: recipient.id, error: error.message.slice(0, 180) });
      }
    }

    return json(response, failed.length ? 207 : 200, {
      message: `Αποστάλθηκαν ${sent} email.`,
      sent,
      failed,
      remainingMayExist: recipients.length === 100,
    });
  } catch (error) {
    console.error("Campaign failed", error);
    return json(response, 500, { message: "Η αποστολή δεν ολοκληρώθηκε." });
  }
}
