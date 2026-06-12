import { libraryArticles } from "./libraryArticles.js";

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
const backToTop = document.querySelector(".back-to-top");
const currentYear = document.querySelector("#current-year");
const committeeGrid = document.querySelector("#committee-members");
const presentationsGrid = document.querySelector("#imm-presentations");
const libraryGrid = document.querySelector("#library-cards");

if (libraryGrid) {
  const libraryCards = libraryArticles.map(
    ({ number, category, title, subtitle, slug, image, imageAlt }) => {
      const article = document.createElement("article");
      article.className = "article-card";

      const link = document.createElement("a");
      link.className = "article-card__link";
      link.href = slug;
      link.setAttribute("aria-label", `Ανάγνωση άρθρου: ${title}`);

      const visual = document.createElement("div");
      visual.className = "article-card__visual";

      const photo = document.createElement("img");
      photo.src = image;
      photo.alt = imageAlt;
      photo.loading = "lazy";
      photo.decoding = "async";
      photo.width = 1672;
      photo.height = 941;

      const badge = document.createElement("span");
      badge.className = "article-card__number";
      badge.textContent = number;
      badge.setAttribute("aria-hidden", "true");
      visual.append(photo, badge);

      const body = document.createElement("div");
      body.className = "article-card__body";

      const label = document.createElement("p");
      label.className = "card-label";
      label.textContent = category;

      const heading = document.createElement("h3");
      heading.textContent = title;

      const copy = document.createElement("p");
      copy.className = "article-card__subtitle";
      copy.textContent = subtitle;

      const cta = document.createElement("span");
      cta.className = "text-link";
      cta.innerHTML = "Ανάγνωση <span>→</span>";

      body.append(label, heading, copy, cta);
      link.append(visual, body);
      article.append(link);
      return article;
    }
  );

  libraryGrid.replaceChildren(...libraryCards);
}

const presentations = [
  {
    title: "ICC Greece: For Entrepreneurship. For You!",
    category: "ICC IMM Presentation",
    description:
      "Μια εισαγωγική αγγλική παρουσίαση για τον ρόλο του ICC Greece και του ICC Hellas Institute of Management & Marketing στην ενίσχυση της επιχειρηματικότητας, της εξωστρέφειας και της θεσμικής δικτύωσης.",
    url: "https://gamma.app/docs/ICC-Greece:-For-Entrepreneurship-For-You!-4sabao9chsvem11?following_id=6wi8hmyfrrzjjeu&follow_on_start=true",
    buttonLabel: "View Presentation",
  },
  {
    title: "Η ικανότητα προσαρμογής στη νέα εποχή",
    category: "Agility & Adaptability",
    description:
      "Θεματική ενότητα για την προσαρμοστικότητα, την ευελιξία και την ικανότητα των στελεχών και των οργανισμών να ανταποκρίνονται σε ένα περιβάλλον συνεχών αλλαγών.",
    url: "https://agility-quotient-aq-qgya5y0.gamma.site/",
    buttonLabel: "Άνοιγμα Παρουσίασης",
  },
  {
    title: "Οικοδομώντας Ομάδες Υψηλής Απόδοσης",
    category: "Leadership & Teams",
    description:
      "Παρουσίαση για τη δημιουργία ομάδων υψηλής απόδοσης, με έμφαση στη συνεργασία, την ηγεσία, την εμπιστοσύνη, τη στοχοθεσία και την αποτελεσματική λειτουργία των ανθρώπινων ομάδων.",
    url: "https://omades-igesia-ahy2080.gamma.site/",
    buttonLabel: "Άνοιγμα Παρουσίασης",
  },
  {
    title: "Με τι τρόπο υλοποιείται η τεχνολογία Blockchain στις επιχειρήσεις",
    category: "Technology & Business Transformation",
    description:
      "Θεματική παρουσίαση για την πρακτική εφαρμογή της τεχνολογίας Blockchain στις επιχειρήσεις, τις δυνατότητες αξιοποίησής της και τις αλλαγές που μπορεί να επιφέρει σε διαδικασίες, συναλλαγές και εμπιστοσύνη.",
    url: "https://blockchain-gia-mme-m1ib731.gamma.site/",
    buttonLabel: "Άνοιγμα Παρουσίασης",
  },
  {
    title:
      "Παροχή Συμβουλών για Τεκμηριωμένες Αποφάσεις σε Νομικά, Οικονομικά & Τεχνικά Θέματα",
    category: "Decision Support & Advisory",
    description:
      "Ενότητα αφιερωμένη στη σημασία της τεκμηριωμένης λήψης αποφάσεων σε κρίσιμα νομικά, οικονομικά και τεχνικά ζητήματα, με στόχο τη μείωση κινδύνου και την ενίσχυση της επιχειρηματικής αποτελεσματικότητας.",
    url: "https://lined-dog-eeg1052.gamma.site/",
    buttonLabel: "Άνοιγμα Παρουσίασης",
  },
  {
    title: "Αναπτύσσοντας Ηγέτες – Διαμορφώνοντας το Μέλλον",
    category: "Leadership Development",
    description:
      "Παρουσίαση για την ανάπτυξη ηγετών, τη διαμόρφωση σύγχρονων δεξιοτήτων διοίκησης και τη σύνδεση της ηγεσίας με τη μακροπρόθεσμη πρόοδο επιχειρήσεων, οργανισμών και κοινωνίας.",
    url: "https://icc-hellas-imm-gxgn1y5.gamma.site/",
    buttonLabel: "Άνοιγμα Παρουσίασης",
  },
];

if (presentationsGrid) {
  const presentationCards = presentations.map(
    ({ title, category, description, url, buttonLabel }, index) => {
      const article = document.createElement("article");
      article.className = "presentation-card";

      const cardHeader = document.createElement("div");
      cardHeader.className = "presentation-card__header";

      const label = document.createElement("p");
      label.className = "card-label";
      label.textContent = category;

      const number = document.createElement("span");
      number.className = "presentation-card__number";
      number.textContent = String(index + 1).padStart(2, "0");
      number.setAttribute("aria-hidden", "true");

      cardHeader.append(label, number);

      const heading = document.createElement("h3");
      heading.textContent = title;

      const copy = document.createElement("p");
      copy.className = "presentation-card__description";
      copy.textContent = description;

      const link = document.createElement("a");
      link.className = "button button--presentation";
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = buttonLabel;
      link.setAttribute("aria-label", `Άνοιγμα παρουσίασης: ${title}`);

      article.append(cardHeader, heading, copy, link);
      return article;
    }
  );

  presentationsGrid.replaceChildren(...presentationCards);
}

const committeeMembers = [
  {
    name: "Πέτρος Δούκας",
    title: "Πρόεδρος ICC Ελλάς",
    image: "/images/committee/Πέτρος Δούκας - Πρόεδρος ICC Ελλάς.png",
    alt: "Ο Πέτρος Δούκας, Πρόεδρος του ICC Ελλάς",
    bio: "Ο Πέτρος Δούκας, ως Πρόεδρος του ICC Ελλάς, στηρίζει θεσμικά την ανάπτυξη του Ινστιτούτου και τη σύνδεσή του με το ευρύτερο οικοσύστημα του Διεθνούς Εμπορικού Επιμελητηρίου. Η παρουσία του ενισχύει τον στρατηγικό προσανατολισμό, την εξωστρέφεια και τη θεσμική αξιοπιστία των δράσεων. Συμβάλλει στη διασύνδεση επιχειρηματικότητας, διεθνών σχέσεων και οργανωμένης εκπροσώπησης.",
  },
  {
    name: "Ευστράτιος Σαράντου",
    title: "Συντονιστής ICC IMM",
    image: "/images/committee/Ευστράτιος Σαράντου - Συντονιστής ICC IMM.png",
    alt: "Ο Ευστράτιος Σαράντου, Συντονιστής του ICC IMM",
    bio: "Ο Ευστράτιος Σαράντου συντονίζει τη λειτουργία και την ανάπτυξη του ICC Hellas Institute of Management & Marketing. Με επιχειρηματική και διοικητική εμπειρία, συμβάλλει στη διαμόρφωση δράσεων που συνδέουν τη θεωρία του management με τις πραγματικές ανάγκες των επιχειρήσεων. Ρόλος του είναι ο συντονισμός των ανθρώπων, των πρωτοβουλιών και των στρατηγικών κατευθύνσεων του Ινστιτούτου.",
  },
  {
    name: "Φίλιππος Ιωάννου",
    title: "Διευθυντής ICC Ελλάς",
    image: "/images/committee/Φίλιππος Ιωάννου - Διευθυντής ICC Ελλάς.png",
    alt: "Ο Φίλιππος Ιωάννου, Διευθυντής του ICC Ελλάς",
    bio: "Ο Φίλιππος Ιωάννου υποστηρίζει τη διοικητική και οργανωτική λειτουργία του ICC Ελλάς και του Ινστιτούτου. Με γνώση των θεσμικών διαδικασιών και των αναγκών συντονισμού, συμβάλλει στην αποτελεσματική υλοποίηση πρωτοβουλιών, συνεργασιών και εκδηλώσεων. Ο ρόλος του είναι κρίσιμος για τη συνέχεια, την οργάνωση και τη λειτουργική συνοχή των δράσεων.",
  },
  {
    name: "Σοφία Παπαδημητρίου",
    title: "Νομική Σύμβουλος IMM",
    image: "/images/committee/Σοφία Παπαδημητρίου - Νομική Σύμβουλος IMM.png",
    alt: "Η Σοφία Παπαδημητρίου, Νομική Σύμβουλος του ICC IMM",
    bio: "Η Σοφία Παπαδημητρίου παρέχει νομική υποστήριξη στις δράσεις και τις πρωτοβουλίες του ICC IMM. Συμβάλλει στη θεσμική θωράκιση των συνεργασιών, των εκπαιδευτικών προγραμμάτων και των οργανωτικών διαδικασιών. Η συμμετοχή της διασφαλίζει ότι οι δράσεις αναπτύσσονται με σαφήνεια, συνέπεια και επαγγελματική αξιοπιστία.",
  },
  {
    name: "Γεώργιος Ανδρέου",
    title: "Chambers of Commerce Relations",
    image: "/images/committee/Γεώργιος Ανδρέου - Chambers of commerce Relations.png",
    alt: "Ο Γεώργιος Ανδρέου, υπεύθυνος σχέσεων με τα επιμελητήρια",
    bio: "Ο Γεώργιος Ανδρέου συμβάλλει στην ανάπτυξη σχέσεων με επιμελητήρια, φορείς και οργανισμούς της επιχειρηματικής κοινότητας. Ο ρόλος του επικεντρώνεται στη δικτύωση, στη συνεργασία και στη θεσμική σύνδεση του Ινστιτούτου με την αγορά. Μέσα από την εμπειρία του, ενισχύει την εξωστρέφεια και τη διάχυση των δράσεων σε ευρύτερο κοινό.",
  },
  {
    name: "Γιώργος Νικέζης",
    title: "Education Relations",
    image: "/images/committee/Γιώργος Νικέζης - Education Relations.png",
    alt: "Ο Γιώργος Νικέζης, υπεύθυνος εκπαιδευτικών σχέσεων",
    bio: "Ο Γιώργος Νικέζης υποστηρίζει τη σύνδεση του Ινστιτούτου με τον χώρο της εκπαίδευσης και της επαγγελματικής κατάρτισης. Συμβάλλει στον σχεδιασμό δράσεων που ενώνουν τη γνώση, την πρακτική εφαρμογή και τις ανάγκες της σύγχρονης αγοράς. Ο ρόλος του είναι να ενισχύει τις εκπαιδευτικές συνέργειες και τη μεταφορά τεχνογνωσίας.",
  },
  {
    name: "Πάντελής Γκούρας",
    title: "Marketing & Management Expert",
    image: "/images/committee/Πάντελής Γκούρας -  Marketing  Management Expert.png",
    alt: "Ο Πάντελής Γκούρας, ειδικός σε Marketing και Management",
    bio: "Ο Πάντελής Γκούρας συμμετέχει στην επιτροπή με αντικείμενο το marketing, το management και τη στρατηγική επιχειρηματικής ανάπτυξης. Η εμπειρία του συμβάλλει στη διαμόρφωση περιεχομένου και δράσεων που απαντούν στις πραγματικές προκλήσεις των στελεχών και των επιχειρήσεων. Ενισχύει την τεχνοκρατική διάσταση του Ινστιτούτου.",
  },
  {
    name: "Ξανθίππη Τομακίδου",
    title: "Business & Academic Contributor",
    image: "/images/committee/Ξανθίππη Τομακίδου - Business  Academic Contributor.png",
    alt: "Η Ξανθίππη Τομακίδου, Business και Academic Contributor",
    bio: "Η Ξανθίππη Τομακίδου συμβάλλει στη γέφυρα ανάμεσα στην ακαδημαϊκή γνώση και την επιχειρηματική πράξη. Με έμφαση στη σύγχρονη διοίκηση και την ανάπτυξη δεξιοτήτων, υποστηρίζει δράσεις που ενισχύουν τη γνώση, τη μεθοδολογία και την επαγγελματική εξέλιξη. Η συμμετοχή της προσθέτει επιστημονικό και εκπαιδευτικό βάθος στο Ινστιτούτο.",
  },
  {
    name: "Τζίνα Τσαντρίζου",
    title: "Events Contributor",
    image: "/images/committee/Τζίνα Τσαντρίζου -  Events Contributor.png",
    alt: "Η Τζίνα Τσαντρίζου, Events Contributor του ICC IMM",
    bio: "Η Τζίνα Τσαντρίζου συμβάλλει στον σχεδιασμό και την υποστήριξη εκδηλώσεων, παρουσιάσεων και δράσεων δικτύωσης του ICC IMM. Ο ρόλος της επικεντρώνεται στην εμπειρία του κοινού, την οργανωτική ποιότητα και την αποτελεσματική υλοποίηση των πρωτοβουλιών. Βοηθά ώστε οι δράσεις του Ινστιτούτου να έχουν επαγγελματική εικόνα και ουσιαστικό αποτέλεσμα.",
  },
];

if (committeeGrid) {
  const memberCards = committeeMembers.map(({ name, title, image, bio, alt }) => {
    const article = document.createElement("article");
    article.className = "member-card";

    const portrait = document.createElement("div");
    portrait.className = "member-card__portrait";

    const photo = document.createElement("img");
    photo.src = image;
    photo.alt = alt;
    photo.loading = "lazy";
    photo.decoding = "async";
    photo.width = 1120;
    photo.height = 1400;
    portrait.append(photo);

    const body = document.createElement("div");
    body.className = "member-card__body";

    const heading = document.createElement("h3");
    heading.textContent = name;

    const role = document.createElement("p");
    role.className = "member-card__role";
    role.textContent = title;

    const biography = document.createElement("p");
    biography.className = "member-card__bio";
    biography.textContent = bio;

    body.append(heading, role, biography);
    article.append(portrait, body);
    return article;
  });

  committeeGrid.replaceChildren(...memberCards);
}

const closeMenu = () => {
  if (!menuToggle || !primaryNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Άνοιγμα μενού πλοήγησης");
  primaryNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Άνοιγμα μενού πλοήγησης" : "Κλείσιμο μενού πλοήγησης"
    );
    primaryNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1080) closeMenu();
  });
}

if (backToTop) {
  const updateBackToTop = () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 600);
  };

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// Highlight the navigation item that corresponds to the section in view.
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${visibleEntry.target.id}`;
        link.classList.toggle("active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    {
      rootMargin: "-25% 0px -60%",
      threshold: [0.05, 0.25, 0.5],
    }
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}
