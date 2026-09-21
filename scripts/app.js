const STORAGE_KEY = "deck-theme";
const root = document.documentElement;

/** Zwraca motyw zapisany przez uzytkownika albo null, gdy nic nie wybral. */
function storedTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function activeTheme() {
  return storedTheme() ?? systemTheme();
}

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

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  root.classList.toggle("theme-light", theme === "light");
}

// Motyw ustawiamy przed pierwszym malowaniem, zeby nie mignelo ciemne tlo.
applyTheme(activeTheme());

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

// `t` przelacza motyw i zapamietuje wybor.
document.addEventListener("keydown", (event) => {
  if (event.key !== "t" && event.key !== "T") return;
  if (event.metaKey || event.ctrlKey || event.altKey) return;

  const nextTheme = activeTheme() === "light" ? "dark" : "light";
  try {
    localStorage.setItem(STORAGE_KEY, nextTheme);
  } catch {
    // tryb prywatny - motyw zadziala do konca sesji
  }
  applyTheme(nextTheme);
});

// Dopoki uzytkownik nie wybral nic recznie, nadazamy za ustawieniem systemu.
window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", () => {
    if (!storedTheme()) applyTheme(systemTheme());
  });
