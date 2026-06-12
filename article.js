import { findLibraryArticle, libraryArticles } from "./libraryArticles.js";

const article = findLibraryArticle(window.location.pathname);
const root = document.querySelector("#article-root");

if (!article || !root) {
  document.title = "Η σελίδα δεν βρέθηκε | ICC IMM";
  if (root) {
    root.innerHTML =
      '<section class="article-not-found"><h1>Η σελίδα δεν βρέθηκε</h1><a class="button button--outline" href="/#library">Επιστροφή στη βιβλιοθήκη</a></section>';
  }
} else {
  document.title = article.metaTitle;
  document.querySelector('meta[name="description"]').content = article.metaDescription;
  document.querySelector('meta[property="og:title"]').content = article.metaTitle;
  document.querySelector('meta[property="og:description"]').content = article.metaDescription;
  document.querySelector('meta[property="og:image"]').content = article.image;
  document.querySelector('link[rel="canonical"]').href = `${window.location.origin}${article.slug}`;

  const nextArticle = libraryArticles.find((item) => item.slug === article.nextSlug);
  const sections = article.sections
    .map(
      ({ heading, paragraphs }) => `
        <section class="article-content__section">
          <h2>${heading}</h2>
          ${paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </section>
      `
    )
    .join("");

  root.innerHTML = `
    <div class="article-breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Αρχική</a>
      <span aria-hidden="true">/</span>
      <a href="/#library">Digital Library</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">${article.title}</span>
    </div>

    <article class="article-page">
      <header class="article-hero">
        <div class="article-hero__meta">
          <span>${article.category}</span>
          <strong>${article.number}</strong>
        </div>
        <h1>${article.title}</h1>
        <p>${article.subtitle}</p>
      </header>

      <figure class="article-figure">
        <img src="${article.image}" alt="${article.imageAlt}" width="1672" height="941" fetchpriority="high" />
      </figure>

      <div class="article-layout">
        <aside class="article-actions">
          <a class="article-back" href="/#library">← Επιστροφή στη βιβλιοθήκη</a>
        </aside>
        <div class="article-content">
          <p class="article-intro">${article.intro}</p>
          ${sections}

          <section class="article-references">
            <h2>Πηγές &amp; αναφορές</h2>
            <ul>
              ${article.references.map((reference) => `<li>${reference}</li>`).join("")}
            </ul>
          </section>
        </div>
      </div>
    </article>

    ${
      nextArticle
        ? `<aside class="suggested-article" aria-labelledby="suggested-title">
            <p class="eyebrow">Επόμενη ανάγνωση</p>
            <h2 id="suggested-title">${nextArticle.title}</h2>
            <p>${nextArticle.subtitle}</p>
            <a class="button button--presentation" href="${nextArticle.slug}" aria-label="Επόμενο άρθρο: ${nextArticle.title}">
              Συνέχεια στο άρθρο ${nextArticle.number}
            </a>
          </aside>`
        : ""
    }
  `;
}
