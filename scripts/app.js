// Motyw jasny / ciemny: start wedlug systemu, klawisz `d` przelacza, wybor
// zostaje w localStorage. Plugin ustawia `data-theme` na <html> od razu, przed
// pierwszym malowaniem, dlatego wolamy go przed remark.create().
// Zrodlo: https://github.com/piecioshka/remarkjs-theme
window.theme = remarkTheme({ storageKey: "deck-theme" });

/**
 * SVG osadzony przez <img> jest odizolowany: nie widzi zmiennych CSS strony
 * ani nie reaguje na :hover. Wstrzykujemy wiec jego tresc do DOM - wtedy
 * dziedziczy palete motywu i kafelki daja sie podswietlac.
 */
const fetchedMarkup = new Map();

async function injectDiagram(img) {
  const src = img.getAttribute("src");
  if (!src) return;

  if (!fetchedMarkup.has(src)) {
    fetchedMarkup.set(
      src,
      fetch(src)
        .then((response) =>
          response.ok
            ? response.text()
            : Promise.reject(new Error(response.status)),
        )
        .catch(() => null),
    );
  }

  const markup = await fetchedMarkup.get(src);
  if (!markup || !img.isConnected) return;

  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) return;

  // Paleta idzie teraz ze strony - blok :root w pliku tylko by ja nadpisywal.
  svg.querySelectorAll("style").forEach((style) => {
    if (style.textContent.includes(":root")) style.remove();
  });

  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.setAttribute("role", "img");
  img.replaceWith(svg);
}

function injectDiagrams() {
  document.querySelectorAll(".diagram img").forEach(injectDiagram);
}

/**
 * Linki zewnetrzne otwieramy w nowej karcie - klikniecie w trakcie prezentacji
 * nie moze zabrac nas ze slajdow. `noopener` odcina dostep do window.opener.
 */
function markExternalLinks() {
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    if (link.hostname === window.location.hostname) return;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

// Instancja siedzi w globalnym `slideshow` z dwoch powodow: daje dostep do API
// prezentacji z konsoli (`slideshow.getSlideCount()`), a DeckTape wlasnie po tej
// zmiennej rozpoznaje deck remarka przy `npm run pdf`.
window.slideshow = remark.create({
  sourceUrl: "slides.md",
  // Po zmianie proporcji trzeba poprawic `@page { size }` w
  // styles/style.css - z tego rozmiaru korzysta eksport przez DeckTape.
  ratio: "16:9",
  countIncrementalSlides: false,

  // Light themes: default, github, idea, magula, tomorrow, vs
  // Dark themes: monokai, rainbow, sunburst, zenburn
  highlightStyle: "monokai",

  // Highlight line which stars with "*"
  highlightLines: true,

  // Highlight text inside backtick eg.
  // ```js
  // const `foo` = 2;
  // ```
  highlightSpans: true,

  navigation: { scroll: false, touch: true },
});

// Slajdy renderuja sie asynchronicznie - diagramy i linki trafiaja do DOM pozniej.
function onSlidesRendered() {
  injectDiagrams();
  markExternalLinks();
}

new MutationObserver(onSlidesRendered).observe(document.body, {
  childList: true,
  subtree: true,
});
onSlidesRendered();
