# Współtworzenie

Jak zbudowany jest deck i jak go edytować. O czym są slajdy i jak je uruchomić: [README](README.md).

## Wymagania

Node.js z `npx`. Projekt nie ma zależności w `package.json`: serwer (`serve`), eksport (`decktape@3`) i Prettier idą przez `npx --yes`.

## Skrypty

| Komenda                | Co robi                                     |
| ---------------------- | ------------------------------------------- |
| `npm start`            | serwer statyczny na `http://localhost:4321` |
| `npm run pdf`          | eksport do `slides.pdf` przez DeckTape      |
| `npm run format`       | Prettier z zapisem                          |
| `npm run format:check` | Prettier bez zapisu                         |

## Eksport do PDF: szczegóły

Dwie rzeczy w tej komendzie nie są oczywiste:

- `--chrome-arg=--allow-file-access-from-files` - DeckTape czyta `index.html` wprost z dysku, a bez tej flagi CORS blokuje `fetch` po `slides.md` i diagramy. Deck się wtedy nie ładuje i wtyczka remarka nie ma czego wykryć.
- `@page { size }` w `styles/style.css` - stamtąd bierze się rozmiar arkusza. Bez tego Chromium skaluje slajd do formatu domyślnego i ucina tekst przy prawej krawędzi. Wpis jest **poza** `@media print`, bo DeckTape wymusza tryb `screen`.

Wtyczka remarka rozpoznaje deck po globalnej zmiennej `slideshow` - dlatego `scripts/app.js` przypisuje do niej instancję z `remark.create()`.

## Motywy: mechanizm

Mechanizm to plugin [remarkjs-theme](https://github.com/piecioshka/remarkjs-theme) (`vendor/remark-theme.js`), który ustawia `data-theme` na `<html>`; palety są w `styles/style.css`. Klawisz `t` jest zajęty przez remarka (reset zegara w widoku prezentera).

## Struktura

| Plik                     | Rola                                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `slides.md`              | treść prezentacji                                                                                                |
| `assets/*.svg`           | diagramy                                                                                                         |
| `index.html`             | szkielet strony                                                                                                  |
| `scripts/app.js`         | remark, SVG, linki zewnętrzne                                                                                    |
| `vendor/remark-theme.js` | plugin [remarkjs-theme](https://github.com/piecioshka/remarkjs-theme) v0.1.0: motyw jasny / ciemny (klawisz `d`) |
| `styles/style.css`       | obie palety i klasy pomocnicze                                                                                   |
| `favicon.svg`            | ikona karty                                                                                                      |
| `vendor/remark.min.js`   | remark.js lokalnie, bez CDN                                                                                      |

Treść edytuje się wyłącznie w `slides.md`. Separator slajdów to `---`. Wygenerowane PDF-y są w `.gitignore`.

## Klasy slajdu

Pierwsza linia slajdu może nieść `class:` z listą klas.

| Klasa                     | Efekt                                                       |
| ------------------------- | ----------------------------------------------------------- |
| `center, middle, title`   | slajd tytułowy, bez numeru strony                           |
| `center, middle, section` | przerywnik części, bez numeru strony                        |
| `tight`                   | mniejszy listing i odstępy, gdy treść przekracza kadr       |
| `tighter`                 | mocniejszy wariant `tight`, gdy na slajdzie są dwa listingi |

## Helpery w treści

remark renderuje `.nazwa[tekst]` jako `<span class="nazwa">`.

| Helper                     | Zastosowanie                                            |
| -------------------------- | ------------------------------------------------------- |
| `.u[tekst]`                | podkreślenie                                            |
| `.y[✔]`                    | znacznik „ma tę funkcję” w tabeli porównawczej          |
| `.big-table[…]`            | tabela zmniejszona, z zapasem na numer slajdu           |
| `.dense-table[…]`          | tabela na kilkanaście wierszy (łączy się z `big-table`) |
| `.cols[ .col[…] .col[…] ]` | dwie kolumny                                            |
| `.dense`                   | ciaśniejsze odstępy w kolumnach                         |
| `.diagram[…]`              | osadzenie diagramu SVG                                  |
| `.callout[…]`              | wyróżniona adnotacja                                    |
| `.sources[…]`              | lista źródeł na slajdzie końcowym                       |
| `.links[…]`                | adresy projektu na slajdzie otwierającym część          |

Miejsca do pokazania na żywo w terminalu znaczy się `<div class="terminal-demo">Terminal - pokaż: …</div>` - renderuje się jako pigułka z promptem `$`. Wewnątrz tego `<div>` markdown nie działa, więc nazwy komend opakowuje się w `<code>`, nie w backticki.

## Diagramy

Ręcznie pisane SVG wstawiane przez `.diagram[![opis](assets/plik.svg)]`. Każdy istnieje w jednym egzemplarzu i jest reużywany, a nie kopiowany między slajdami.

> [!NOTE]
>
> `scripts/app.js` podmienia `<img>` na treść SVG w DOM. Dzięki temu diagram dziedziczy zmienne CSS strony (nie potrzebuje własnej palety ani wariantu na motyw) i reaguje na `:hover` - w `<img>` dokument jest odizolowany i jedno, i drugie nie działa.

Kolory w diagramach podaje się wyłącznie jako `var(--token)`: `--bg`, `--surface`, `--fg`, `--fg-dim`, `--muted`, `--line`, `--accent`, `--accent-soft`, `--on-accent` (tekst leżący na wypełnieniu akcentowym). Grupa `<g class="tile">` dostaje podświetlenie pod kursorem.

## Linki zewnętrzne

`scripts/app.js` dokłada `target="_blank"` i `rel="noopener noreferrer"` każdemu linkowi prowadzącemu poza bieżący host - kliknięcie w trakcie prezentacji nie zabiera ze slajdów. W `slides.md` pisze się zwykły link, bez atrybutów.

## Konwencje treści

- Listingi z komentarzami wyrównuje się do jednej kolumny (`#` w YAML, `←` w drzewach katalogów).
- Zwykły myślnik `-`, nigdy półpauza ani pauza. Wyjątek: pauza (U+2014) w tabeli porównawczej oznacza brak funkcji.
- Symbole w kodzie po angielsku, treść i komentarze po polsku.
- Po zmianie treści warto sprawdzić, czy slajd mieści się w kadrze - remark skaluje zawartość, więc przepełnienie nie rzuca błędu, tylko ucina treść na dole. Mierzy się to przy krawędzi `.remark-slide-scaler` (ma `overflow: hidden`), a nie `.remark-slide`, którego prostokąt jest większy od realnego kadru.

## Formatowanie

```bash
npm run format:check
```

`slides.md` i `assets/` są w `.prettierignore` - Prettier psułby składnię remarka i ręcznie wyrównane listingi.

## Commity

Commity w stylu Conventional Commits po angielsku (`feat:`, `fix:`, `chore:`).
