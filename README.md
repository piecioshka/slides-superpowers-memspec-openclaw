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
| `d`            | motyw jasny / ciemny |
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

## Motywy 🌓

Start według ustawienia systemu. Klawisz `d` przełącza ręcznie, a wybór zapisuje się w `localStorage` i wygrywa z systemem do czasu wyczyszczenia magazynu przeglądarki.

## Źródła 🔗

- AGENTS.md - https://agents.md
- Superpowers - https://claude.com/plugins/superpowers, [obra/superpowers](https://github.com/obra/superpowers)
- memspec - [siimvene/memspec](https://github.com/siimvene/memspec)
- OpenClaw - https://openclaw.ai/, https://docs.openclaw.ai/

Liczby i ścieżki w slajdach zmierzone lokalnie 2026-09-21.

## Współtworzenie 🤝

Struktura projektu, składnia slajdów, diagramy, konwencje i formatowanie: [CONTRIBUTING.md](CONTRIBUTING.md).

## Licencja 📄

[The MIT License](https://piecioshka.mit-license.org) @ 2026
