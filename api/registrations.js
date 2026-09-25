import {
  PRIVACY_NOTICE_VERSION,
  NOTIFICATION_RECIPIENTS,
  configuration,
  confirmationEmail,
  ensureSchema,
  getDatabase,
  json,
  normalizeText,
  notificationEmail,
  sendEmail,
  validEmail,
} from "./_event.js";

const EVENT_KEY = "leadership-2026";

export default async function handler(request, response) {
  if (request.method === "GET" && request.query?.health === "1") {
    const configured = configuration();

    if (!configured.database || !configured.email || !configured.admin) {
      return json(response, 503, {
        ready: false,
        message: "Οι εγγραφές θα ανοίξουν μόλις ολοκληρωθεί η ασφαλής σύνδεση βάσης και email.",
        configured,
      });
    }

    try {
      const sql = getDatabase();
      await sql`SELECT 1`;
      return json(response, 200, { ready: true });
    } catch {
      return json(response, 503, {
        ready: false,
        message: "Η υπηρεσία εγγραφών δεν είναι προσωρινά διαθέσιμη.",
      });
    }
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, GET");
    return json(response, 405, { message: "Η μέθοδος δεν υποστηρίζεται." });
  }

  const configured = configuration();
  if (!configured.database || !configured.email || !configured.admin) {
    return json(response, 503, {
      message: "Οι εγγραφές δεν έχουν ανοίξει ακόμη. Παρακαλούμε δοκιμάστε αργότερα.",
    });
  }

  const body = typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body || {};
  const fullName = normalizeText(body.fullName, 120);
  const email = normalizeText(body.email, 254).toLowerCase();
  const organization = normalizeText(body.organization, 160);
  const jobTitle = normalizeText(body.jobTitle, 120);
  const marketingConsent = body.marketingConsent === true;
  const website = normalizeText(body.website, 200);
  const formStartedAt = Number(body.formStartedAt);

  if (website) {
    return json(response, 201, { message: "Η εγγραφή καταχωρίστηκε.", emailSent: true });
  }

  if (!fullName || !validEmail(email)) {
    return json(response, 400, { message: "Συμπληρώστε έγκυρο ονοματεπώνυμο και email." });
  }

  if (!Number.isFinite(formStartedAt) || Date.now() - formStartedAt < 1500) {
    return json(response, 400, { message: "Η φόρμα υποβλήθηκε υπερβολικά γρήγορα. Δοκιμάστε ξανά." });
  }

  const sql = getDatabase();

  try {
    await ensureSchema(sql);
    const inserted = await sql`
      INSERT INTO event_registrations (
        event_key, full_name, email, organization, job_title, marketing_consent,
        privacy_notice_version
      ) VALUES (
        ${EVENT_KEY}, ${fullName}, ${email}, ${organization || null}, ${jobTitle || null},
        ${marketingConsent}, ${PRIVACY_NOTICE_VERSION}
      )
      ON CONFLICT (event_key, email) DO NOTHING
      RETURNING id
    `;

    if (!inserted.length) {
      return json(response, 409, { message: "Υπάρχει ήδη εγγραφή για αυτή τη διεύθυνση email." });
    }

    const registrationId = inserted[0].id;
    let participantEmailSent = false;
    let notificationSent = false;
    let emailError = "";

    try {
      await sendEmail({
        to: [email],
        subject: "Επιβεβαίωση εγγραφής | Leadership in Times of Change",
        html: confirmationEmail(fullName),
      });
      participantEmailSent = true;
      await sql`UPDATE event_registrations SET confirmation_sent_at = NOW() WHERE id = ${registrationId}`;
    } catch (error) {
      emailError = `Confirmation: ${error.message}`;
    }

    try {
      await sendEmail({
        to: NOTIFICATION_RECIPIENTS,
        subject: `Νέα εγγραφή εκδήλωσης: ${fullName}`,
        html: notificationEmail({ fullName, email, organization, jobTitle, marketingConsent }),
      });
      notificationSent = true;
      await sql`UPDATE event_registrations SET notification_sent_at = NOW() WHERE id = ${registrationId}`;
    } catch (error) {
      emailError += `${emailError ? " | " : ""}Notification: ${error.message}`;
    }

    if (emailError) {
      await sql`UPDATE event_registrations SET email_error = ${emailError.slice(0, 1000)} WHERE id = ${registrationId}`;
    }

    return json(response, participantEmailSent ? 201 : 202, {
      message: participantEmailSent
        ? "Η εγγραφή σας ολοκληρώθηκε. Ελέγξτε το email σας για την επιβεβαίωση."
        : "Η εγγραφή αποθηκεύτηκε, αλλά η επιβεβαίωση email δεν μπόρεσε να σταλεί. Το ICC έχει ενημερωθεί για έλεγχο.",
      emailSent: participantEmailSent,
      notificationSent,
    });
  } catch (error) {
    console.error("Registration failed", error);
    return json(response, 500, { message: "Δεν ήταν δυνατή η ασφαλής αποθήκευση της εγγραφής. Δοκιμάστε ξανά αργότερα." });
  }
}
