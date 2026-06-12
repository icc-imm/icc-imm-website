const CONSENT_KEY = "icc-imm-cookie-consent";
const CONSENT_VERSION = 1;

const defaultPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const readConsent = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(CONSENT_KEY));
    return stored?.version === CONSENT_VERSION ? stored : null;
  } catch {
    return null;
  }
};

const saveConsent = (preferences) => {
  const consent = {
    version: CONSENT_VERSION,
    preferences: { ...defaultPreferences, ...preferences, necessary: true },
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  document.documentElement.dataset.cookieConsent = consent.preferences.analytics
    ? "analytics"
    : "necessary";

  window.dispatchEvent(
    new CustomEvent("iccimm:consent-updated", {
      detail: consent.preferences,
    })
  );

  return consent;
};

const consentMarkup = `
  <section class="cookie-banner" aria-labelledby="cookie-banner-title" aria-describedby="cookie-banner-description" hidden>
    <div class="cookie-banner__content">
      <div>
        <p class="cookie-banner__eyebrow">Ιδιωτικότητα &amp; cookies</p>
        <h2 id="cookie-banner-title">Σεβόμαστε τις επιλογές σας</h2>
        <p id="cookie-banner-description">
          Χρησιμοποιούμε απαραίτητα cookies για τη σωστή λειτουργία της ιστοσελίδας.
          Με τη συγκατάθεσή σας μπορούμε επίσης να χρησιμοποιούμε προαιρετικά cookies
          στατιστικής ανάλυσης και επικοινωνίας. Μπορείτε να αλλάξετε την επιλογή σας
          οποιαδήποτε στιγμή.
        </p>
      </div>
      <div class="cookie-banner__actions">
        <button class="cookie-button cookie-button--primary" type="button" data-cookie-accept>
          Αποδοχή όλων
        </button>
        <button class="cookie-button cookie-button--secondary" type="button" data-cookie-reject>
          Μόνο απαραίτητα
        </button>
        <button class="cookie-button cookie-button--text" type="button" data-cookie-open>
          Ρυθμίσεις
        </button>
      </div>
    </div>
  </section>

  <div class="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title" hidden>
    <div class="cookie-modal__backdrop" data-cookie-close></div>
    <div class="cookie-modal__panel" role="document">
      <button class="cookie-modal__close" type="button" data-cookie-close aria-label="Κλείσιμο ρυθμίσεων cookies">×</button>
      <p class="cookie-banner__eyebrow">Κέντρο προτιμήσεων</p>
      <h2 id="cookie-modal-title">Ρυθμίσεις cookies</h2>
      <p>
        Επιλέξτε ποιες κατηγορίες επιτρέπετε. Τα απαραίτητα cookies είναι πάντοτε
        ενεργά, επειδή απαιτούνται για βασικές λειτουργίες και την αποθήκευση της
        επιλογής σας.
      </p>

      <div class="cookie-category">
        <div>
          <h3>Απαραίτητα cookies</h3>
          <p>Υποστηρίζουν βασικές λειτουργίες, ασφάλεια και αποθήκευση προτιμήσεων.</p>
        </div>
        <span class="cookie-category__status">Πάντα ενεργά</span>
      </div>

      <label class="cookie-category" for="cookie-analytics">
        <div>
          <h3>Cookies στατιστικής ανάλυσης</h3>
          <p>Βοηθούν στη μέτρηση της επισκεψιμότητας και στη βελτίωση του περιεχομένου.</p>
        </div>
        <input id="cookie-analytics" type="checkbox" data-cookie-analytics />
      </label>

      <label class="cookie-category" for="cookie-marketing">
        <div>
          <h3>Cookies επικοινωνίας και marketing</h3>
          <p>Μπορούν να χρησιμοποιηθούν για τη μέτρηση σχετικών ενεργειών επικοινωνίας.</p>
        </div>
        <input id="cookie-marketing" type="checkbox" data-cookie-marketing />
      </label>

      <div class="cookie-modal__notice">
        <h3>Επεξεργασία προσωπικών δεδομένων</h3>
        <p>
          Για πληροφορίες ή αιτήματα σχετικά με τα προσωπικά δεδομένα και τα δικαιώματά
          σας, επικοινωνήστε στο
          <a href="mailto:director-imm@iccwbo.gr">director-imm@iccwbo.gr</a>.
          Η ιστοσελίδα δεν ενεργοποιεί προαιρετικές κατηγορίες χωρίς προηγούμενη
          συγκατάθεση.
        </p>
      </div>

      <div class="cookie-modal__actions">
        <button class="cookie-button cookie-button--secondary" type="button" data-cookie-reject>
          Απόρριψη μη απαραίτητων
        </button>
        <button class="cookie-button cookie-button--primary" type="button" data-cookie-save>
          Αποθήκευση επιλογών
        </button>
      </div>
    </div>
  </div>

  <button class="cookie-settings-fab" type="button" data-cookie-settings aria-label="Άνοιγμα ρυθμίσεων cookies">
    Cookies
  </button>
`;

document.body.insertAdjacentHTML("beforeend", consentMarkup);

const banner = document.querySelector(".cookie-banner");
const modal = document.querySelector(".cookie-modal");
const analyticsInput = document.querySelector("[data-cookie-analytics]");
const marketingInput = document.querySelector("[data-cookie-marketing]");
const modalPanel = document.querySelector(".cookie-modal__panel");
let previousFocus = null;

const closeBanner = () => {
  banner.hidden = true;
};

const closeModal = () => {
  modal.hidden = true;
  document.body.classList.remove("cookie-modal-open");
  previousFocus?.focus();
};

const openModal = () => {
  const consent = readConsent();
  analyticsInput.checked = consent?.preferences.analytics ?? false;
  marketingInput.checked = consent?.preferences.marketing ?? false;
  previousFocus = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("cookie-modal-open");
  modalPanel.querySelector("button")?.focus();
};

const applyChoice = (preferences) => {
  saveConsent(preferences);
  closeBanner();
  closeModal();
};

document.addEventListener("click", (event) => {
  const target = event.target.closest(
    "[data-cookie-accept], [data-cookie-reject], [data-cookie-open], [data-cookie-close], [data-cookie-save], [data-cookie-settings]"
  );
  if (!target) return;

  if (target.matches("[data-cookie-accept]")) {
    applyChoice({ analytics: true, marketing: true });
  } else if (target.matches("[data-cookie-reject]")) {
    applyChoice({ analytics: false, marketing: false });
  } else if (target.matches("[data-cookie-save]")) {
    applyChoice({
      analytics: analyticsInput.checked,
      marketing: marketingInput.checked,
    });
  } else if (target.matches("[data-cookie-open], [data-cookie-settings]")) {
    openModal();
  } else {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

const storedConsent = readConsent();
if (storedConsent) {
  document.documentElement.dataset.cookieConsent = storedConsent.preferences.analytics
    ? "analytics"
    : "necessary";
} else {
  banner.hidden = false;
}
