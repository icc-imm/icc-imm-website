const countdown = document.querySelector("[data-countdown]");

if (countdown) {
  const target = new Date(countdown.dataset.eventTime).getTime();
  const fields = {
    days: countdown.querySelector("[data-days]"),
    hours: countdown.querySelector("[data-hours]"),
    minutes: countdown.querySelector("[data-minutes]"),
    seconds: countdown.querySelector("[data-seconds]"),
  };
  const note = document.querySelector("[data-countdown-note]");

  const renderCountdown = () => {
    const remaining = Math.max(0, target - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const values = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };

    Object.entries(values).forEach(([key, value]) => {
      fields[key].textContent = String(value).padStart(2, "0");
    });

    if (remaining === 0 && note) {
      note.textContent = "Η εκδήλωση έχει ξεκινήσει ή ολοκληρωθεί.";
    }
  };

  renderCountdown();
  window.setInterval(renderCountdown, 1000);
}

document.querySelectorAll("[data-scroll-top]").forEach((button) => {
  button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
});

const form = document.querySelector("[data-event-form]");

if (form) {
  const submitButton = form.querySelector("[data-submit]");
  const status = form.querySelector("[data-form-status]");
  const startedAt = form.elements.formStartedAt;
  startedAt.value = String(Date.now());

  const setStatus = (message, state = "") => {
    status.textContent = message;
    status.dataset.state = state;
  };

  const checkAvailability = async () => {
    try {
      const response = await fetch("/api/registrations?health=1", {
        headers: { Accept: "application/json" },
      });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Οι εγγραφές δεν έχουν ανοίξει ακόμη.");
      }
      const result = await response.json();

      if (!response.ok || !result.ready) {
        throw new Error(result.message || "Η υπηρεσία εγγραφών δεν έχει ακόμη ενεργοποιηθεί.");
      }

      submitButton.disabled = false;
      submitButton.textContent = "Ολοκλήρωση εγγραφής";
      setStatus("Η ασφαλής υπηρεσία εγγραφών είναι διαθέσιμη.");
    } catch (error) {
      submitButton.disabled = true;
      submitButton.textContent = "Οι εγγραφές δεν έχουν ανοίξει ακόμη";
      setStatus(error.message || "Η υπηρεσία εγγραφών δεν είναι διαθέσιμη αυτή τη στιγμή.", "error");
    }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    submitButton.disabled = true;
    submitButton.textContent = "Υποβολή…";
    setStatus("Καταχωρίζουμε με ασφάλεια τη συμμετοχή σας.");

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.marketingConsent = form.elements.marketingConsent.checked;

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Η εγγραφή δεν ολοκληρώθηκε.");

      form.reset();
      startedAt.value = String(Date.now());
      setStatus(result.message, result.emailSent === false ? "error" : "success");
      submitButton.textContent = "Η εγγραφή καταχωρίστηκε";
    } catch (error) {
      submitButton.disabled = false;
      submitButton.textContent = "Ολοκλήρωση εγγραφής";
      setStatus(error.message || "Παρουσιάστηκε σφάλμα. Παρακαλούμε δοκιμάστε ξανά.", "error");
    }
  });

  checkAvailability();
}
