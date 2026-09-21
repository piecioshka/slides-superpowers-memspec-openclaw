# Superpowers, memspec, OpenClaw 🎞️

Slajdy o trzech narzędziach wokół Claude Code: **Superpowers**, **memspec** i **OpenClaw**.

Padają zwykle w jednym zdaniu, jakby trzeba było wybrać jedno. A każde odpowiada na inne pytanie: **jak** agent ma pracować, **co** ma pamiętać i **skąd** go uruchamiasz.

56 slajdów w sześciu częściach:

| Część | Zawartość                                                                                            |
| ----- | ---------------------------------------------------------------------------------------------------- |
| 0     | pamięć wbudowana: `CLAUDE.md`, auto memory, `AGENTS.md`, oba pliki `MEMORY.md`, `~/.claude/projects` |
| 1     | Superpowers - metodologia pracy, skille, hook na starcie sesji                                       |
| 2     | memspec - pamięć z datą ważności i kotwicą w kodzie                                                  |
| 3     | OpenClaw - runtime i kanały czatowe                                                                  |
| 4     | mapa plików na dysku                                                                                 |
| 5     | zestawienie, koszt kontekstu, kiedy co ma sens                                                       |

Każde twierdzenie zweryfikowane w kodzie, dokumentacji albo pomiarem na dysku - notatki prezentera podają źródło i zaznaczają, czego nie udało się potwierdzić. Slajdy otwierające części o narzędziach niosą adresy strony i repozytorium.

## Uruchomienie 🚀

```bash
npm start
```

Otwórz `http://localhost:4321`.

> [!IMPORTANT]
>
> Serwer HTTP jest wymagany. `scripts/app.js` ładuje `slides.md` przez `fetch`, co przy `file://` blokuje CORS.

## Nawigacja ⌨️

| Klawisz        | Akcja                |
| -------------- | -------------------- |
| `→` / `spacja` | następny slajd       |
| `←`            | poprzedni slajd      |
| `t`            | motyw jasny / ciemny |
| `p`            | widok prezentera     |
| `c`            | sklonuj okno         |
| `f`            | pełny ekran          |

Notatki prezentera (widok `p`) są pod `???` w każdym slajdzie. To gotowy tekst mówiony, do przeczytania na głos - nie hasła do sparafrazowania. Panel notatek przewija się, gdy treść nie mieści się w kadrze.

## Eksport do PDF 📄

```bash
npm run pdf
```

Powstaje `slides.pdf`: 56 stron 16:9, po jednej na slajd, wiernych temu, co widać na ekranie. Tekst zostaje wybieralny, diagramy wektorowe. `npm start` nie musi działać w tle. Wygenerowane PDF-y są w `.gitignore`.

> [!NOTE]
>
> DeckTape nie jest zależnością projektu - leci przez `npx` i ciągnie własnego Chromium (kilkaset MB), więc pierwsze uruchomienie trwa dłużej.

Dwie rzeczy w tej komendzie nie są oczywiste:

- `--chrome-arg=--allow-file-access-from-files` - DeckTape czyta `index.html` wprost z dysku, a bez tej flagi CORS blokuje `fetch` po `slides.md` i diagramy. Deck się wtedy nie ładuje i wtyczka remarka nie ma czego wykryć.
- `@page { size }` w `styles/style.css` - stamtąd bierze się rozmiar arkusza. Bez tego Chromium skaluje slajd do formatu domyślnego i ucina tekst przy prawej krawędzi. Wpis jest **poza** `@media print`, bo DeckTape wymusza tryb `screen`.

Wtyczka remarka rozpoznaje deck po globalnej zmiennej `slideshow` - dlatego `scripts/app.js` przypisuje do niej instancję z `remark.create()`.

## Motywy 🌓

Start według ustawienia systemu. Klawisz `t` przełącza ręcznie, a wybór zapisuje się w `localStorage` i wygrywa z systemem do czasu wyczyszczenia magazynu przeglądarki.

## Struktura 📁

| Plik                   | Rola                                 |
| ---------------------- | ------------------------------------ |
| `slides.md`            | treść prezentacji                    |
| `assets/*.svg`         | diagramy                             |
| `index.html`           | szkielet strony                      |
| `scripts/app.js`       | remark, motyw, SVG, linki zewnętrzne |
| `styles/style.css`     | obie palety i klasy pomocnicze       |
| `favicon.svg`          | ikona karty                          |
| `vendor/remark.min.js` | remark.js lokalnie, bez CDN          |

Treść edytuje się wyłącznie w `slides.md`. Separator slajdów to `---`. Wygenerowane PDF-y są w `.gitignore`.

## Klasy slajdu 🎚️

Pierwsza linia slajdu może nieść `class:` z listą klas.

| Klasa                     | Efekt                                                       |
| ------------------------- | ----------------------------------------------------------- |
| `center, middle, title`   | slajd tytułowy, bez numeru strony                           |
| `center, middle, section` | przerywnik części, bez numeru strony                        |
| `tight`                   | mniejszy listing i odstępy, gdy treść przekracza kadr       |
| `tighter`                 | mocniejszy wariant `tight`, gdy na slajdzie są dwa listingi |

## Helpery w treści 🧩

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

## Diagramy 🖼️

Ręcznie pisane SVG wstawiane przez `.diagram[![opis](assets/plik.svg)]`. Każdy istnieje w jednym egzemplarzu i jest reużywany, a nie kopiowany między slajdami.

> [!NOTE]
>
> `scripts/app.js` podmienia `<img>` na treść SVG w DOM. Dzięki temu diagram dziedziczy zmienne CSS strony (nie potrzebuje własnej palety ani wariantu na motyw) i reaguje na `:hover` - w `<img>` dokument jest odizolowany i jedno, i drugie nie działa.

Kolory w diagramach podaje się wyłącznie jako `var(--token)`: `--bg`, `--surface`, `--fg`, `--fg-dim`, `--muted`, `--line`, `--accent`, `--accent-soft`, `--on-accent` (tekst leżący na wypełnieniu akcentowym). Grupa `<g class="tile">` dostaje podświetlenie pod kursorem.

## Linki zewnętrzne 🔗

`scripts/app.js` dokłada `target="_blank"` i `rel="noopener noreferrer"` każdemu linkowi prowadzącemu poza bieżący host - kliknięcie w trakcie prezentacji nie zabiera ze slajdów. W `slides.md` pisze się zwykły link, bez atrybutów.

## Konwencje treści ✍️

- Listingi z komentarzami wyrównuje się do jednej kolumny (`#` w YAML, `←` w drzewach katalogów).
- Zwykły myślnik `-`, nigdy półpauza ani pauza. Wyjątek: `—` w tabeli porównawczej oznacza brak funkcji.
- Symbole w kodzie po angielsku, treść i komentarze po polsku.
- Po zmianie treści warto sprawdzić, czy slajd mieści się w kadrze - remark skaluje zawartość, więc przepełnienie nie rzuca błędu, tylko ucina treść na dole. Mierzy się to przy krawędzi `.remark-slide-scaler` (ma `overflow: hidden`), a nie `.remark-slide`, którego prostokąt jest większy od realnego kadru.

## Formatowanie 🧹

```bash
npm run format:check
```

`slides.md` i `assets/` są w `.prettierignore` - Prettier psułby składnię remarka i ręcznie wyrównane listingi.

## Źródła 🔗

- AGENTS.md - https://agents.md
- Superpowers - https://claude.com/plugins/superpowers, [obra/superpowers](https://github.com/obra/superpowers)
- memspec - [siimvene/memspec](https://github.com/siimvene/memspec)
- OpenClaw - https://openclaw.ai/, https://docs.openclaw.ai/

Liczby i ścieżki w slajdach zmierzone lokalnie 2026-09-21.

## Licencja 📄

[The MIT License](https://piecioshka.mit-license.org) @ 2026
