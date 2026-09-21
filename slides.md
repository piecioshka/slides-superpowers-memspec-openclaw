class: center, middle, title

# Superpowers, memspec, OpenClaw

[Piotr Kowalski](https://www.linkedin.com/in/piecioshka) · 2026-09-21

???
Dzień dobry. Dzisiaj porozmawiamy o trzech narzędziach, które krążą wokół Claude Code: Superpowers, memspec i OpenClaw.

Te trzy nazwy pojawiają się zwykle w jednym zdaniu, jakby to były konkurencyjne produkty, z których trzeba wybrać jeden. To nieporozumienie i chcę je dzisiaj rozbroić.

Każde z nich odpowiada na inne pytanie. Superpowers pyta: jak agent ma pracować. memspec pyta: co agent ma pamiętać. OpenClaw pyta: skąd agent jest uruchamiany.

Zaczniemy jednak nie od nich, tylko od tego, co Claude Code potrafi sam, bez żadnego dodatku. Bez tego punktu odniesienia nie da się ocenić, co te trzy narzędzia właściwie dokładają.

Wszystkie liczby i ścieżki, które zobaczycie, zmierzyłem lokalnie dwudziestego pierwszego września. To nie są dane z dokumentacji, tylko stan mojej maszyny.

Na koniec nie będzie rekomendacji „zainstalujcie to i to”. Będzie pięć otwartych pytań, bo temat jest świeży i nikt nie ma tu jeszcze pewnych odpowiedzi.

---

## Po co ta prezentacja

Trzy narzędzia, które ciągle pojawiają się w jednym zdaniu, a **rozwiązują zupełnie inne problemy**. Plus czwarta warstwa, o której mało kto pamięta.

.big-table[
| Warstwa                | Odpowiada na pytanie                     | Czym                       |
| ---------------------- | ---------------------------------------- | -------------------------- |
| .u[punkt wyjścia]      | Co agent wie, zanim coś doinstalujesz?   | instrukcje + auto memory   |
| metodologia            | .u[Jak] agent ma pracować?                  | **Superpowers**            |
| pamięć                 | Co agent ma .u[pamiętać] między sesjami?    | **memspec**                |
| runtime / kanały       | .u[Skąd] agent jest uruchamiany?            | **OpenClaw**               |
]

Pierwszy wiersz jest **wbudowany w Claude Code** - działa bez instalowania czegokolwiek. Od niego zaczniemy.

Pozostałe trzy nie konkurują ze sobą. Można używać wszystkich naraz - albo żadnego.

Codex i Cursor mają **swoje odpowiedniki warstwy zerowej** - inne nazwy, ten sam pomysł. Za chwilę zestawienie.

???
Jeżeli wpiszecie te trzy nazwy w wyszukiwarkę, znajdziecie głównie wątki typu "superpowers czy memspec", jakby to był wybór między Reactem a Vue. Stąd wziął się pomysł na tę prezentację - po prostu zmęczyło mnie tłumaczenie po raz dziesiąty tego samego w komentarzach.

Analogia, która mi pomaga: Superpowers to jest coś w rodzaju regulaminu code review, memspec to baza wiedzy zespołu, a OpenClaw to VPN i laptop, z którego się łączycie. Nikt nie pyta, czy wybrać regulamin czy VPN.

W pierwszym wierszu celowo nie ma nazwy pliku, choć w poprzedniej wersji wpisałem tam `MEMORY.md`. Zdjąłem to, bo w kolumnie z nazwami trzech produktów wyglądało jak czwarty produkt albo jakiś standard - a to ani jedno, ani drugie. Warstwa zerowa to instrukcje w `CLAUDE.md` albo `AGENTS.md` plus auto memory, czyli rzeczy wbudowane. `MEMORY.md` dołożę do tego obrazka za kilka slajdów i wtedy od razu powiem, że to moja konwencja.

Pierwsza kolumna jest tu najważniejsza. Kiedy ktoś pyta "co z tego wybrać", to zwykle znaczy, że nie ustalił, który problem go boli. Jak agent w kółko robi bałagan, bo nie planuje - to metodologia. Jak co sesję tłumaczycie mu od nowa, dlaczego ten moduł wygląda tak dziwnie - to pamięć.

Zwróćcie uwagę na wiersz zerowy. Jest wbudowany, nic nie trzeba instalować, a mimo to większość osób nie używa go świadomie. Zaczniemy właśnie od niego, bo bez tego punktu odniesienia nie da się ocenić, co pozostała trójka właściwie dokłada.

Ostatnie zdanie ze slajdu traktujcie poważnie. Wariant "żadne z nich" jest w tej prezentacji pełnoprawną opcją i wrócę do niego na końcu.


---

class: center, middle, section

# Część 0

## Punkt wyjścia: pamięć, którą już masz

???
Zanim cokolwiek doinstalujemy, musimy ustalić, od czego startujemy. Inaczej nie da się ocenić, co te trzy narzędzia właściwie dokładają.

Claude Code ma własną pamięć, wbudowaną, działającą bez żadnej wtyczki. Większość osób jej nie używa świadomie, bo nigdzie się nie narzuca.

Te trzy slajdy to minimum, bez którego reszta prezentacji wisi w próżni.

---

## Agent zaczyna od zera

Nie "model nie ma pamięci" - **sesja startuje z pustym oknem kontekstu**. W trakcie rozmowy agent pamięta wszystko, po `/clear` zostaje mu **tylko to, co zapisane na dysku**. Czego nie zapisałeś, tego nie ma:

- nie wie, czemu ten moduł wygląda tak dziwnie
- nie pamięta, że wczoraj ustaliliście konwencję nazw
- powtórzy błąd, który już raz mu wytknąłeś

Dlatego **wszystko, co agent ma wiedzieć, musi zostać wpisane do kontekstu na starcie sesji**.

Claude Code robi to dwoma mechanizmami:

.big-table[
| Mechanizm                  | Co to jest                     | Kto pisze |
| -------------------------- | ------------------------------ | --------- |
| `CLAUDE.md` / `AGENTS.md`  | instrukcje - jak masz pracować | Ty        |
| .u[auto memory]            | fakty - czego się nauczył      | agent     |
]

???
Pierwsze zdanie poprawiam świadomie, bo wcześniej pisałem tu nieprecyzyjnie i ktoś na sali słusznie mnie z tego wyprowadził. Nie jest tak, że model niczego nie pamięta - w obrębie jednej rozmowy pamięta wszystko, co w niej padło. Problem zaczyna się na granicy sesji: nowe okno kontekstu to czysta kartka.

Praktyczny objaw, po którym to poznacie: ten sam argument trzeba powtarzać co kilka dni. Mówicie "nie używaj tej biblioteki", agent się zgadza, a za tydzień proponuje ją ponownie. To nie złośliwość, tylko brak kanału, którym ta informacja miałaby do niego wrócić.

Rozróżnienie z tabeli będzie wracać przez całą prezentację. Instrukcje to jak masz pracować, pamięć to co masz wiedzieć. Mieszanie tych dwóch rzeczy w jednym pliku to najczęstszy błąd, jaki widuję.

Drugi wiersz nazywa się w dokumentacji "auto memory" i jest włączony domyślnie. Agent sam decyduje, co zapisać - nie pyta was o zdanie. Możecie to wyłączyć w `/memory` albo zmienną `CLAUDE_CODE_DISABLE_AUTO_MEMORY`.

Zwróćcie uwagę, że w tej tabeli nie ma jeszcze `MEMORY.md`. To nie przeoczenie - ten plik nie jest funkcją Claude Code i dlatego dostał osobny slajd, zaraz po następnym.

---

class: tight

## To samo u konkurencji

Każdy agent dzieli to identycznie: **instrukcje idą do repo, pamięć zostaje na maszynie**.

.big-table[
| | W repo - widzi zespół | Prywatne - tylko Ty | Auto |
| --- | --- | --- | :-: |
| **Claude Code** | `CLAUDE.md`, `AGENTS.md` | `~/.claude/CLAUDE.md`<br>`~/.claude/projects/<sciezka>/memory/` | .y[wł.] |
| **Codex** | `AGENTS.md` + podkatalogi | `~/.codex/AGENTS.md`<br>`~/.codex/memories/` | wył. |
| **Cursor** | `.cursor/rules/*.mdc`<br>`AGENTS.md` | User Rules - .u[tylko UI, bez pliku] | — |
]

- `AGENTS.md` **czytają wszystkie trzy** - gdy w zespole każdy siedzi na innym agencie, wystarczy jeden plik zamiast trzech
- **`MEMORY.md` nie jest standardem** - Codex i Cursor nie mają pliku o tej nazwie (OpenClaw ma, ale to osobna historia)
- Pamięć automatyczna jest **lokalna dla maszyny** i nie trafia do repozytorium
- Codex ma ją **wyłączoną domyślnie** (`[features] memories = true`) - zapis do włączonej pamięci jest nieodwracalny, więc opt-in przerzuca tę decyzję na Ciebie

???
Ten slajd dołożyłem po pytaniu z poprzedniego warsztatu, czy to jest specyfika Claude Code, czy ogólny wzorzec. To ogólny wzorzec i warto go znać, bo dzięki temu wiecie, czego szukać w dowolnym nowym narzędziu.

Podział na dwie pierwsze kolumny jest ważniejszy niż same nazwy plików. Po lewej rzeczy, które wchodzą do repozytorium i przechodzą przez code review. Po prawej wasza prywatna konfiguracja, która nie opuszcza maszyny. Pomylenie tych dwóch kolumn to najczęstsze źródło problemów, jakie widuję.

`AGENTS.md` przyjął się jako wspólny format, więc jeden plik w repozytorium obsługuje wszystkie trzy narzędzia naraz. Jeżeli w zespole ktoś siedzi na Cursorze, a ktoś na Claude Code, nie musicie utrzymywać dwóch wersji tych samych ustaleń. To jest wasz wspólny mianownik.

Jedno zastrzeżenie, bo to klasyczna pułapka: Claude Code domyślnie czyta `AGENTS.md` tylko wtedy, gdy w katalogu roboczym ani powyżej NIE MA `CLAUDE.md`. Jak w repo leżą oba, domyślnie wygrywa `CLAUDE.md`, a `AGENTS.md` zostaje zignorowany. Wasz globalny `~/.claude/CLAUDE.md` się tu nie liczy, więc go to nie psuje. Da się to przestawić w ustawieniach, żeby czytał oba, ale trzeba o tym wiedzieć.

Drugi punkt prostuje nieporozumienie, które sam podtrzymywałem w pierwszych wersjach tej prezentacji. `MEMORY.md` brzmi jak standard, a nie jest. Codex nie ma pliku o tej nazwie, Cursor też nie. To nazwa z ekosystemu Claude Code i nawet tam znaczy trzy różne rzeczy - o tym jest następny slajd.

Zastrzeżenie w nawiasie jest tam dlatego, że w części trzeciej zobaczycie `MEMORY.md` w workspace OpenClaw. Nie jest to więc nazwa zarezerwowana - po prostu dwa projekty niezależnie wpadły na ten sam pomysł, a dwa pozostałe narzędzia z tej tabeli nie.

Pamięci automatyczne to już osobne światy. Każde z tych trzech narzędzi trzyma swoją gdzie indziej, w swoim formacie, i żadne nie zagląda do cudzej - z jednym wyjątkiem, do którego dojdziemy: OpenClaw potrafi zaimportować pamięć Codexa i Claude Code, ale robi to na żądanie i jako kopię. Do tego Claude Code zapisuje sam z siebie od razu po instalacji, a Codex ma to domyślnie wyłączone.

Zapytacie pewnie, dlaczego akurat Codex to wyłączył, i tu muszę być uczciwy: dokumentacja OpenAI wprost tego nie uzasadnia. Podaje tylko, jak włączyć, i ostrzega, żeby nie trzymać w pamięci sekretów oraz przejrzeć pliki przed udostępnieniem katalogu Codeksa. Z tych ostrzeżeń widać, o co chodzi w praktyce: agent, który zapisuje sam, prędzej czy później zapisze coś, czego nie chcieliście mieć na dysku, a wyciąć to możecie dopiero po fakcie. Opt-in przerzuca tę decyzję na was, zanim cokolwiek powstanie.

Anthropic zrobił odwrotny zakład - włączone od razu, bo pamięć bez zapisu jest bezużyteczna, a większość ludzi nigdy nie wejdzie w ustawienia, żeby cokolwiek włączyć. Oba podejścia są obronialne, tylko warto wiedzieć, na którym siedzicie. U was Claude Code pisze do pamięci od pierwszego dnia, nawet jeśli nikt o tym nie pomyślał.

Przy Cursorze zostawiam uczciwą kreskę - funkcja Memories istniała, ale strona, która ją opisywała, dziś przekierowuje na spis treści, więc nie będę zgadywał.

Jedna pułapka, na którą ktoś kiedyś się nadzieje: w Cursorze reguły globalne siedzą wyłącznie w ustawieniach aplikacji. Nie ma pliku, więc nie zwersjonujecie ich w dotfiles ani nie przeniesiecie na inną maszynę inaczej niż przez konto. W Claude Code i Codeksie odpowiednik jest zwykłym plikiem w katalogu domowym i właśnie dlatego da się zrobić ten symlink, który pokażę w tej części.

---

## `MEMORY.md` to konwencja, nie funkcja

W Claude Code **nie ma** żadnego produktowego `MEMORY.md` w katalogu domowym. Jest zwykły plik, który sam wciągam dyrektywą:

```markdown
# ~/.claude/CLAUDE.md
@MEMORY.md
```

.big-table[
| | Co to jest | Kto to wymyślił |
| --- | --- | --- |
| `~/.claude/MEMORY.md` | mój plik z faktami | .u[ja] - zwykły import |
| `~/.claude/projects/<sciezka>/memory/MEMORY.md` | indeks auto memory | Anthropic, funkcja produktu |
| `<repo>/MEMORY.md` | fakty o jednym projekcie | .u[moja konwencja] |
]

Ta sama nazwa w trzech miejscach, a tylko **jedno z nich to funkcja narzędzia**. Dwa pozostałe to mój zwyczaj, który możecie skopiować albo nazwać inaczej.

???
Ten slajd wydzieliłem, bo to jedno zdanie schowane pod tabelką wywoływało najwięcej nieporozumień ze wszystkiego, co mówię w tej części.

Sprawa jest prosta: jak wpiszecie w wyszukiwarkę "Claude Code MEMORY.md", znajdziecie mieszankę trzech różnych rzeczy opisywanych tak, jakby były jedną. Nie są.

Środkowy wiersz to jedyna pozycja, która jest funkcją produktu. Anthropic zdecydował, że auto memory trzyma indeks w pliku o tej nazwie, w swoim katalogu, i nic wam do tego. Ten plik pojawia się sam.

Górny i dolny wiersz to moja konwencja. Nazwałem swój plik z faktami `MEMORY.md`, bo pasowało, i wciągam go jedną linijką z małpą. Mógłbym go nazwać `fakty.md` albo `notatki.md` i działałoby identycznie - liczy się tylko to, co wpiszecie po małpie w `CLAUDE.md`.

Mówię o tym wprost, żebyście nie szukali w dokumentacji opisu czegoś, czego tam nie ma, i żebyście nie czuli się zobowiązani do mojej nazwy. Jak wam nie pasuje, zmieńcie ją - to jest wasz plik.

---

class: tight

## `MEMORY.md` vs `AGENTS.md`

Ta sama forma - markdown w repo - ale **odpowiadają na inne pytanie**:

.big-table[
| | `AGENTS.md` | `MEMORY.md` |
| --- | --- | --- |
| Zawiera | .u[instrukcje] - jak masz pracować | .u[fakty] - czego się nauczyliśmy |
| Czas | stabilne, zmienia się rzadko | przyrasta z każdą sesją |
| Pisze | człowiek, świadomie | człowiek albo agent |
| Czyta | 20+ narzędzi, otwarty standard | konwencja, nie standard |
| Przykład | „testy odpalaj przez `npm t`" | „ten test przechodzi tylko z `TZ=UTC`" |
]

**`AGENTS.md` to README dla agentów** - dedykowane, przewidywalne miejsce na kontekst projektu. Standard: **https://agents.md** · 20+ narzędzi, ponad 60 tys. repozytoriów.

Nie ma wymaganych sekcji - to zwykły markdown. Typowo: budowanie, testy, styl kodu, zasady commitów.

???
Zanim wejdziemy w `MEMORY.md`, ustawmy go obok pliku, z którym najczęściej się go myli. Te dwa ciągle się ludziom zlewają, a różnica jest prosta i warta zapamiętania: instrukcje kontra fakty. To rozwinięcie tabelki z poprzedniego slajdu, tylko teraz mam już czym je zilustrować.

`AGENTS.md` mówi, jak masz pracować. To jest stabilne - zasady budowania, konwencje, sposób uruchamiania testów. Piszecie to raz i zmieniacie, kiedy zmienia się projekt. `MEMORY.md` mówi, czego się nauczyliśmy po drodze, i przyrasta z każdą sesją.

Przykład z ostatniej kolumny jest chyba najostrzejszy. "Testy odpalaj przez `npm t`" to instrukcja - obowiązuje zawsze i wynika z decyzji. "Ten test przechodzi tylko z ustawioną strefą czasową" to fakt odkryty przez kogoś po dwóch godzinach szukania. Pierwsze należy do `AGENTS.md`, drugie do pamięci.

Najważniejsza różnica praktyczna jest w wierszu o czytelnikach. `AGENTS.md` to otwarty standard, opisany na agents.md, wspierany przez ponad dwadzieścia narzędzi i używany w ponad sześćdziesięciu tysiącach publicznych repozytoriów. Kiedy wrzucacie go do repo, obsługujecie nim Codeksa, Cursora, Copilota, Gemini CLI i Claude Code naraz. `MEMORY.md` takiego statusu nie ma - to konwencja, moja i kilku innych projektów.

Zachęcam, żeby zajrzeć na agents.md, bo strona jest krótka i odpowiada na typowe pytania. Nie ma tam żadnego schematu ani wymaganych sekcji - to zwykły markdown, nagłówki dowolne. Twórcy opisują to jako README dla agentów, z tą samą intencją: jedno przewidywalne miejsce, w którym agent szuka kontekstu, zamiast zgadywania.

I przypomnienie pułapki, o której mówiłem przy tabeli konkurencji: Claude Code czyta `AGENTS.md` tylko wtedy, gdy nie ma `CLAUDE.md` obok ani wyżej. Jak chcecie obu, trzeba to przestawić w ustawieniach.

---

class: tight, tighter

## `MEMORY.md` - najprostsza pamięć, jaka działa

Plik z faktami, wciągany do każdej sesji jedną dyrektywą w `CLAUDE.md`:

```markdown
## Pamięć

@MEMORY.md
```

Małpa przed nazwą pliku wkleja w to miejsce **całą jego treść**. Tyle.

U konkurencji odpowiednik jest węższy - liczy się nie tyle sama składnia, co **gdzie wolno jej użyć**:

.big-table[
| | Jak wciągnąć własny plik z faktami |
| --- | --- |
| **Claude Code** | `@MEMORY.md` w `CLAUDE.md` - także w globalnym, dla każdego projektu |
| **Codex** | brak importu - fakty wpisuje się wprost do `AGENTS.md` |
| **Cursor** | `@plik.md` działa, ale tylko wewnątrz reguły w `.cursor/rules/` |
]

Format, który sprawdza się u mnie - jeden fakt na punkt:

```markdown
- [2026-09-13] [preferencja] Jedyny format daty to ISO `YYYY-MM-DD`
- [2026-09-16] [referencja] Docker na macu to COLIMA; montuje tylko `$HOME`
```

Data mówi **kiedy**, kategoria mówi **czym**. Działa od razu, bez instalowania czegokolwiek - i to jest punkt odniesienia dla reszty prezentacji.

???
Ten slajd jest w pewnym sensie najważniejszy z całej prezentacji, bo pokazuje rozwiązanie, które kosztuje was pięć minut i zaspokaja potrzeby większości projektów.

Mechanizm jest tak prosty, że aż podejrzany. Jedna linijka z małpą, a Claude Code wkleja w to miejsce zawartość pliku, dokładnie tak, jakbyście przepisali go ręcznie na początku każdej rozmowy. Żadnej bazy danych, żadnego indeksowania.

Tabelka w środku wymaga sprostowania, bo w pierwszej wersji twierdziłem tu, że import to jedyna rzecz, której konkurencja nie ma. Sprawdziłem i to nieprawda: Cursor ma dokładnie tę samą składnię z małpą, dokumentacja mówi wprost "use `@filename.ts` to include files in your rule's context".

Różnica jest gdzie indziej i jest subtelniejsza. W Claude Code mogę wstawić tę linijkę do GLOBALNEGO pliku instrukcji, więc jeden plik z faktami obsługuje mi wszystkie projekty naraz. W Cursorze małpa działa tylko wewnątrz reguły projektowej - nie ma globalnego pliku instrukcji, w którym dałoby się to umieścić, bo User Rules siedzą wyłącznie w ustawieniach aplikacji. Codex nie ma importu w ogóle, tam fakty wpisujecie wprost do `AGENTS.md`.

Format z datą i kategorią to już moja konwencja, nie wymóg narzędzia. Data ratuje mi skórę przy przeglądaniu pliku po pół roku, bo to jedyna rzecz pozwalająca ocenić, czy wpis o wersji biblioteki ma jeszcze sens.

Od razu zaznaczę rzecz, która wróci w części drugiej: to jest data zapisu, a nie data ważności. Nic tu samo nie wygaśnie. Jak wpis się zdezaktualizuje, to leży dalej i agent traktuje go jak prawdę.

I to jest dokładnie ta dziura, w którą celuje memspec. Ale zanim tam dojdziemy, chcę, żebyście mieli w głowie, jak wygląda wariant bez żadnych dodatków.

---

class: tight

## Import jest przechodni: `CLAUDE.md` → `AGENTS.md` → `MEMORY.md`

Zaimportowany plik **może importować dalej**. Taki łańcuch działa:

```markdown
# CLAUDE.md          @AGENTS.md
# AGENTS.md          @MEMORY.md
# MEMORY.md          @docs/pulapki.md
```

Wszystko ląduje w kontekście na starcie, jakby było w jednym pliku.

**Ale to działa tylko w Claude Code:**

.big-table[
| | Maksymalny łańcuch | Uwagi |
| --- | --- | --- |
| **Claude Code** | **4 skoki** (5. plik wchodzi, 6. nie) | ścieżki względne od pliku z importem; `` `@plik` `` w backtickach to zwykły tekst |
| **Codex** | .u[brak] - 1 plik | `@include` to **otwarte zgłoszenie** od 04.2026 |
| **Cursor** | 1 poziom | `@plik` w regule, .u[bez zagnieżdżania] |
]

Praktycznie: `AGENTS.md` z `@MEMORY.md` w środku daje instrukcje i fakty bez duplikowania - ale **u reszty zespołu ten plik zostanie płaski**.

???
To pytanie padło na warsztacie i musiałem je sprawdzić, bo nie znałem odpowiedzi z głowy. Odpowiedź brzmi: tak, łańcuch działa, importy są przechodnie.

Zbudowałem sobie testowy katalog z czterema plikami: `CLAUDE.md` importuje `AGENTS.md`, ten importuje `MEMORY.md`, a ten jeszcze jeden plik głębiej. Potem zapytałem agenta, czy widzi kotwicę z ostatniego pliku - widział, i sam wypisał całą ścieżkę importu.

Limit czterech skoków jest w dokumentacji, ale sprawdziłem go empirycznie, bo chciałem wiedzieć, jak się zachowuje na granicy. Wynik: piąty plik w łańcuchu jeszcze wchodzi, szósty już nie - i to cicho, bez ostrzeżenia. Agent widzi wtedy linijkę z małpą, ale treści za nią nie ma. To jest ten rodzaj awarii, którego nie zauważycie, dopóki agent nie zacznie ignorować reguły, o której jesteście przekonani, że ją zna.

Wiersz o ścieżkach względnych to drugi kandydat na stracone pół godziny. Liczą się od pliku, w którym stoi import, nie od katalogu, z którego odpaliliście agenta. Jak przenosicie plik z importami do innego katalogu, ścieżki trzeba przeliczyć.

Trzeci wiersz jest drobny, ale wygodny: żeby napisać w dokumentacji nazwę pliku z małpą i jej nie zaimportować, wystarczy backticki. Parser pomija kod.

Po co to komu w praktyce? Bo pozwala rozdzielić role bez duplikowania treści. `AGENTS.md` wrzucacie do repo i czyta go każdy agent w zespole - to są instrukcje. W środku dokładacie `@MEMORY.md` z faktami, które przyrastają. Jeden plik dla ludzi i narzędzi, drugi dla wiedzy, a agent i tak dostaje oba naraz.

I tu jest haczyk, który tabelka stawia wprost, a o którym łatwo zapomnieć: **ten łańcuch to funkcja Claude Code, nie własność formatu**. Codex nie ma importów w ogóle - zgłoszenie o dyrektywę `@include` w `AGENTS.md` wisi otwarte od kwietnia. Cursor ma małpę, ale jeden poziom, wewnątrz reguły.

Konsekwencja jest niemiła. Wrzucacie do repo `AGENTS.md`, który u was rozwija się w trzy pliki i wygląda pięknie. Kolega na Codeksie dostaje ten sam plik z gołą linijką `@MEMORY.md` w środku - zobaczy ją jako tekst i nic za nią nie przyjedzie. Plik jest dalej poprawny, tylko połowa treści u niego nie istnieje.

Więc jeżeli w zespole ktoś siedzi na Codeksie, róbcie łańcuchy wyłącznie od `CLAUDE.md`, a `AGENTS.md` trzymajcie płaski. Albo świadomie przyjmijcie, że fakty dostaje tylko część zespołu.

Drugie zastrzeżenie, bo wraca: Claude Code sięgnie po `AGENTS.md` tylko wtedy, gdy nie ma `CLAUDE.md` obok ani wyżej. Przy łańcuchu z tego slajdu problemu nie ma - importujecie go jawnie.

---

## `~/.claude/MEMORY.md` - pamięć globalna

Ten sam mechanizm, tylko w katalogu domowym: plik z faktami **o Tobie i o Twoich projektach**, ładowany do każdej sesji, niezależnie od tego, w którym repozytorium pracujesz.

Stan na tej maszynie: **223 linie, 193 fakty - ale 180 KB**, czyli rzędu **46 tys. tokenów w każdej sesji**.

Cztery kategorie, których używam:

.big-table[
| Kategoria     | Co tam trafia                          |
| ------------- | -------------------------------------- |
| `user`        | kim jesteś, czym się zajmujesz         |
| `projekt`     | fakty o projekcie bez lokalnego klona  |
| `preferencja` | jak agent ma pracować                  |
| `referencja`  | wiedza techniczna kupiona ciężko       |
]

Granica jest prosta: **fakt o jednym repozytorium należy do tego repozytorium**, nie tutaj.

???
Mechanizm z małpą pokazywałem slajd wcześniej, więc teraz interesują nas liczby i to, co z nimi zrobić.

Dwieście dwadzieścia trzy linie i sto dziewięćdziesiąt trzy fakty - te liczby rosły u mnie przez kilka miesięcy, po kilka wpisów tygodniowo. Nikt tego nie zaplanował, po prostu się nazbierało.

Kategoria, która niesie najwięcej wartości, to u mnie `referencja`. Tam ląduje wiedza techniczna kupiona ciężko, typu "to API oddaje pustą odpowiedź zamiast błędu" - czyli rzeczy, których nie znajdziecie w dokumentacji, bo poznaje się je przez stratę godziny.

Kategoria `projekt` jest w tym zestawie najbardziej podejrzana i celowo ją tak opisałem. Fakt o projekcie prawie zawsze powinien leżeć w repozytorium tego projektu. Globalnie zostawiam go tylko wtedy, gdy nie mam lokalnego klona, do którego mógłbym go zapisać.

Ostatnie zdanie ze slajdu to jest cała reguła w jednym wierszu i wrócę do niej za dwa slajdy, przy pliku w repozytorium. Jeżeli wpis jest prawdziwy tylko w jednym repo, to płacicie za niego w każdej sesji, a korzystacie w jednej na dwadzieścia.

---

class: tight

## `~/.claude/MEMORY.md` - sztuczka z symlinkiem

Na tej maszynie to **nie jest zwykły plik**:

```bash
$ readlink ~/.claude/MEMORY.md
/Users/dev/dotfiles-ai/shared/MEMORY.md
```

Dzięki temu pamięć:
- **jest w repozytorium** .u[dotfiles-ai] - wersjonowana, z historią zmian
- **jest współdzielona** między agentami: Claude Code, Codex, Copilot, Gemini
- **jedzie z Tobą** na inną maszynę razem z .u[dotfiles-ai]

Jeden agent zapisuje fakt, pozostali go widzą. Zamiast czterech osobnych, rozjeżdżających się pamięci - jedno źródło prawdy.

Uwaga praktyczna: to plik ładowany **w całości, w każdej sesji**. 180 KB to rzędu 46 tys. tokenów, zanim zadacie pierwsze pytanie - stąd zasada, żeby pisać zwięźle i usuwać nieaktualne wpisy.

<div class="terminal-demo">Terminal - pokaż: <code>readlink ~/.claude/MEMORY.md</code> i praktykę wspólnej pamięci między agentami</div>

???
To jest moja własna sztuczka, nie żadna udokumentowana funkcja, więc traktujcie ją jak pomysł do skopiowania, a nie zalecenie producenta. Zrobiłem to, kiedy zorientowałem się, że ten sam fakt tłumaczę osobno Claude Code, osobno Codeksowi i osobno Copilotowi.

Mechanizm jest banalny: plik fizycznie leży w moim repozytorium `dotfiles-ai`, a w katalogu Claude Code jest tylko dowiązanie. Każdy agent, którego konfiguruję, dostaje dowiązanie do tego samego miejsca.

Efekt, który mnie do tego przekonał: jeden agent zapisuje coś, czego się nauczył, a następnego dnia drugi już to wie. Bez tego miałem cztery pamięci rozjeżdżające się w cztery strony.

Bonus, którego nie planowałem: pamięć jest w gicie, więc każdy fakt ma swój commit. Da się cofnąć, da się sprawdzić, kiedy dopisałem bzdurę.

I koszt, bo jest realny. Sto dziewięćdziesiąt trzy fakty ładują się w całości, w każdej sesji, także wtedy, gdy pytam o literówkę. Dlatego mam u siebie regułę, żeby przed dopisaniem sprawdzić, czy taki wpis już nie istnieje, i żeby aktualizować zamiast dokładać.

---

## `MEMORY.md` w projekcie - dwa różne byty

Nazwa jest ta sama, ale to **dwie różne rzeczy** i łatwo je pomylić.

.big-table[
| | **`<repo>/MEMORY.md`** | **`~/.claude/projects/<sciezka>/memory/MEMORY.md`** |
| --- | --- | --- |
| Gdzie | w repozytorium | w katalogu Claude Code |
| W gicie | **tak** | nie |
| Kto widzi | cały zespół | tylko Ty |
| Kto pisze | Ty, świadomie | agent, automatycznie |
| Ładowanie | `@MEMORY.md` w `CLAUDE.md` repo | automatycznie: 200 linii / 25 KB indeksu |
| Treść | w tym samym pliku | indeks + osobne pliki |
]

Pierwszy to **dokumentacja dla ludzi i agentów**. Drugi to **notatnik agenta**.

Uwaga na zapis: `<sciezka>` to **nie nazwa repo**, tylko cała ścieżka z ukośnikami zamienionymi na myślniki - `-Users-dev-projects-acme-shop`.

???
Ta sama nazwa dla dwóch różnych rzeczy to niefortunny zbieg okoliczności i naprawdę potrafi zmylić. Sam kiedyś szukałem notatki w repozytorium, a leżała w katalogu domowym.

Zdanie o zapisie ścieżki dopisałem, bo skrót `projects/…/memory/` czyta się jak katalog w repozytorium, a to zupełnie co innego. Tam nie ma nazwy repo - jest zakodowana pełna ścieżka z dysku, z myślnikami zamiast ukośników. Cały ten katalog siedzi w waszym katalogu domowym i nigdy nie jedzie z kodem.

Najprostszy sposób na zapamiętanie różnicy: jeden wiersz z tej tabeli, ten o gicie. Jeżeli plik jest w repozytorium, to dokumentacja dla ludzi i agentów. Jeżeli nie, to prywatny notatnik agenta.

Praktyczna konsekwencja wiersza o tym, kto widzi. Jeżeli coś ma trafić do kolegi z zespołu, to musi być w repozytorium - to, co agent zapisał sobie u was lokalnie, nie dotrze do nikogo poza wami.

I odwrotnie: to, co jest w repozytorium, zobaczą wszyscy, łącznie z recenzentem waszego pull requesta. Więc żadnych prywatnych uwag o cudzym kodzie w tym pliku.

---

## `<repo>/MEMORY.md` - po co to jest

Reguła z Twojej konfiguracji:

> Fakt dotyczy **jednego repozytorium** (jego kodu, architektury, pułapek, decyzji) → dopisz do `MEMORY.md` **w tym repo**, nie do globalnego.

Repo podpina go własnym `CLAUDE.md` albo `AGENTS.md`:

```markdown
@MEMORY.md
```

**Co tam trafia:** pułapki specyficzne dla projektu, decyzje architektoniczne, nieoczywiste zależności, rzeczy których nie widać w kodzie.

**Co tam nie trafia:** to, co repo już zapisuje - struktura katalogów, historia gita, treść `README`.

Zysk: nowy członek zespołu (albo agent w świeżej sesji) dostaje kontekst, którego nie ma w kodzie. I jest to **w review** - zła notatka da się wyłapać na PR.

???
Reguła rozstrzygająca jest prosta i warto ją sobie powiesić nad biurkiem. Zadajcie sobie pytanie: czy ten fakt będzie prawdziwy w innym repozytorium. Jeżeli nie, nie ma czego szukać w pamięci globalnej.

Najlepszy przykład tego, co tam trafia: pułapka, którą odkryliście po dwóch godzinach debugowania. Że ten serwis trzeba restartować w określonej kolejności, że ten test przechodzi tylko z ustawioną zmienną środowiskową. Rzeczy prawdziwe, ale niewidoczne w kodzie.

Druga lista jest równie ważna. Nie przepisujcie tam struktury katalogów ani treści README, bo to się zdezaktualizuje przy pierwszej większej zmianie, a nikt tego nie zauważy.

Zdanie o review jest według mnie najmocniejszym argumentem za tym plikiem. Kiedy notatka dla agenta idzie przez normalny pull request, ktoś ją przeczyta i powie, że to już nieaktualne. Żaden prywatny notatnik nie ma takiej kontroli jakości.

Efekt uboczny, którego się nie spodziewałem: ten plik okazał się świetnym materiałem dla nowej osoby w zespole. Pisany dla agenta, a czyta się jak zbiór uwag od kogoś, kto tu siedzi od dawna.

Na tym kończy się inwentarz tego, co macie za darmo: dwa pliki z faktami, jeden globalny i jeden w repozytorium, plus notatnik, który agent prowadzi sobie sam. Następny slajd mówi, czego ten zestaw nie potrafi - i to jest lista, z której wyrastają wszystkie trzy narzędzia.

---

## `~/.claude/projects` - do czego to służy

Claude Code zapisuje tu **pełny transkrypt każdej sesji**, w katalogu wyliczonym ze ścieżki projektu.

.diagram[![Jak liczony jest katalog projektu](assets/projects-dir.svg)]

???
Mechanizm nazewnictwa jest banalny: bierzecie ścieżkę projektu i zamieniacie każdy ukośnik na myślnik.

Jedno doprecyzowanie, bo w tym samym katalogu mieszkają dwie różne rzeczy. Dla transkryptów jest dokładnie tak, jak mówię. Dla pamięci dokumentacja mówi, że ścieżka jest wyprowadzana z repozytorium gita - dlatego wszystkie worktree jednego repo dzielą jedną pamięć, a poza repozytorium brany jest katalog główny projektu.

Ma to konsekwencję, na którą sam się kiedyś nabrałem. Jak przeniesiecie projekt do innego katalogu albo zmienicie mu nazwę, to Claude Code widzi go jako zupełnie nowe miejsce i zakłada świeży katalog. Cała poprzednia historia transkryptów zostaje pod starą ścieżką i przestaje być widoczna.

Jeżeli kiedyś będziecie tego potrzebować, da się to uratować ręcznie - wystarczy przenieść zawartość starego katalogu do nowego. Tylko trzeba wiedzieć, że problem w ogóle istnieje.

Warto też mieć świadomość, że to są pełne transkrypty, czyli wszystko, co przeszło przez sesję. Jak agent czytał plik z konfiguracją, to jego treść jest w tym logu, w czystym tekście, na waszym dysku.

---

## `~/.claude/projects` - ile to waży

Stan na tej maszynie:

```bash
$ ls ~/.claude/projects | wc -l
      94
$ du -sh ~/.claude/projects
1.5G    .
```

**94 katalogi, 1,5 GB.** Transkrypty mają retencję (`cleanupPeriodDays`), ale **pliki pamięci są z niej wyłączone** - te zostają, dopóki sami ich nie usuniecie.

<div class="terminal-demo">Terminal - pokaż: <code>ls ~/.claude/projects | wc -l</code> i <code>du -sh ~/.claude/projects</code></div>

???
Dziewięćdziesiąt kilka katalogów to dla mnie było zaskoczenie, bo nie mam poczucia, żebym pracował nad tyloma projektami. Połowa z nich to jednorazowe zaglądnięcia do cudzego repozytorium albo katalogi, które już dawno nie istnieją.

Półtora gigabajta samego tekstu w formacie JSON. Dla porównania: cały mój katalog z dotfiles waży kilka megabajtów.

Sprawdźcie to u siebie, bo rozstrzał bywa duży. Jeżeli pracujecie z agentem od kilku miesięcy na jednym dużym repozytorium, spokojnie możecie mieć więcej niż ja.

Zanim ktoś to hurtowo skasuje, jedna uwaga: usunięcie katalogu zabiera możliwość wznowienia tamtych sesji i materiał, z którego memspec potrafi zrobić pamięć. Ja u siebie kasuję katalogi projektów, które już nie istnieją na dysku, a reszty nie ruszam.

I sprostowanie, bo wcześniej mówiłem tu, że nic tego nie czyści automatycznie. To nieprawda: transkrypty podlegają retencji ustawianej przez `cleanupPeriodDays`, tylko domyślnie dość długiej, więc u większości z nas po prostu rosną. Z tej czystki wyłączone są za to pliki pamięci - te leżą, dopóki ktoś ich świadomie nie usunie.

---

## `~/.claude/projects` - po co ten transkrypt

**Plik `.jsonl`** - jedna linia na zdarzenie: wiadomości, wywołania narzędzi, wyniki. Nazwa pliku to UUID sesji.

Do czego to służy w praktyce:
- wznawianie sesji (`claude --resume`)
- kompakcja - model streszcza starszą część rozmowy, czytając z transkryptu
- materiał wejściowy dla `memspec normalize`, który przerabia logi sesji na rekordy
- audyt: co dokładnie agent zrobił i kiedy

???
Format z jedną linią na zdarzenie jest wybrany celowo: da się dopisywać na koniec pliku bez czytania całości i da się czytać strumieniowo. Przy sesji z tysiącem wywołań narzędzi to jedyne sensowne wyjście.

Drugi punkt z listy tłumaczy rzecz, która wielu osobom wydaje się magią. Kiedy sesja robi się długa i widzicie komunikat o kompakcji, model nie zgaduje z pamięci, tylko czyta ten plik i streszcza jego starszą część.

Ostatni punkt bywa niedoceniany do pierwszego incydentu. Jak coś w repozytorium wygląda dziwnie i podejrzewacie, że agent to zrobił, macie w tym pliku dokładny zapis: która komenda, o której, z jakim wynikiem.

W praktyce najprościej przeszukać to grepem po katalogu projektu. To zwykły tekst, żadne specjalne narzędzie nie jest potrzebne.

---

## `~/.claude/projects` - pamięć per projekt

Katalog `memory/` to **pamięć wbudowana w Claude Code**, nie memspec. Osobna od `~/.claude/MEMORY.md`.

```bash
$ find ~/.claude/projects -name "MEMORY.md"
```

Znalezione: **15 plików** - po jednym na projekt, w którym agent coś zapamiętał.

```
projects/-Users-dev-projects-acme-shop/memory/
├── MEMORY.md                                  ← indeks
├── feedback_push_and_pr_on_finish.md
├── feedback_run_format_check_before_commit.md
├── project_scoring_favorites_list.md
└── ... (13 plików)
```

`MEMORY.md` to sam indeks - jedna linia na pamięć, ładowany do kontekstu na starcie. Treść leży w osobnych plikach, doczytywanych na żądanie.

???
Zwróćcie uwagę na liczbę: piętnaście plików na dziewięćdziesiąt kilka katalogów. Agent sam zapamiętał coś tylko w co szóstym projekcie i to jest zdrowa proporcja - nie zapisuje wszystkiego jak leci.

Nazwy plików pokazują, co trafia do takiej pamięci. Widać wśród nich reakcje na moje własne uwagi, na przykład żeby uruchamiać sprawdzanie formatowania przed commitem. To jest ta kategoria wiedzy, którą normalnie trzeba powtarzać co sesję.

Podział na indeks i osobne pliki jest tu sprytny i warto go zrozumieć, bo to dokładnie ta sama sztuczka co w Superpowers. Do kontekstu wchodzi lista jednolinijkowych opisów, a pełna treść tylko wtedy, kiedy agent uzna, że jej potrzebuje.

Konsekwencja praktyczna dla was: opis w indeksie musi być dobry, bo na jego podstawie agent decyduje, czy w ogóle sięgnąć po resztę. Świetna notatka z kiepskim opisem nigdy nie zostanie przeczytana.

---

class: tight

## Format pojedynczej pamięci Claude Code

```markdown
---
name: feedback-push-and-pr-on-finish
description: "Gdy user prosi o push, od razu zrobić też PR"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 50a99798-0b79-448b-b66f-0d76af950818
---

Gdy user prosi o `push`, wykonać oba kroki ciągiem: `git push -u origin <branch>`
ORAZ `gh pr create --base main`.

Why: User traktuje push i PR jako jedną operację domykającą zadanie.

How to apply: Po akceptacji zmian: push brancha → `gh pr create` z opisem.
```

Typy: `user`, `feedback`, `project`, `reference`. Linkowanie między pamięciami przez `[[nazwa]]`.

Format frontmatteru **zmieniał się między wersjami** - u mnie na dysku leżą oba warianty, z `type` zagnieżdżonym w `metadata` i płaskim.

**Zapamiętajcie ten kształt** - markdown z frontmatterem. W części drugiej zobaczycie niemal identyczny pomysł w memspec, tylko **z datą ważności, kotwicą do kodu i cyklem życia**.

???
Dwie sekcje na dole tego pliku są ciekawsze, niż się wydaje. Poza samą regułą jest jeszcze uzasadnienie i sposób zastosowania, czyli dokładnie to, o co sami dopytujecie nowego człowieka w zespole, kiedy mówi wam "zawsze robimy to tak".

Uzasadnienie ma praktyczny sens: agent, który wie, dlaczego reguła istnieje, potrafi ją rozsądnie zastosować w sytuacji trochę innej niż ta, w której powstała. Bez tego dostajecie ślepe wykonanie.

Linkowanie przez podwójne nawiasy zdradza inspirację narzędziami do notatek. Pamięci mogą się odwoływać do siebie nawzajem i budować coś w rodzaju małej sieci. Uczciwie: tej składni nie ma w dokumentacji, znalazłem ją w plikach u siebie.

Zdanie o zmieniającym się formacie dopisałem po sprawdzeniu dysku. Na trzydzieści dziewięć plików dwadzieścia sześć ma `type` schowany w `metadata`, a trzynaście trzyma go płasko. Jeżeli porównacie ten slajd z dokumentacją i coś wam się nie zgodzi, to nie błąd - po prostu Claude Code zmieniał tu format i stare pliki zostały, jakie były.

To, czego tu nie ma, jest równie wymowne. Żadnej daty ważności, żadnego powiązania z plikiem, którego ta reguła dotyczy. Jeżeli za pół roku zmienicie sposób pracy, ten plik dalej będzie ładowany i nic o tym nie powie.

Zapamiętajcie ten kształt, bo wróci. W części drugiej pokażę rekord memspec i zobaczycie niemal to samo: markdown z frontmatterem, opis w środku. Różnica będzie w tych kilku polach, których tu brakuje - i to cała odpowiedź na pytanie, po co komu osobne narzędzie do pamięci.

---

## Czego ta pamięć nie robi

Działa, ale ma cztery konkretne ograniczenia:

.big-table[
| Problem                        | Co się dzieje                                       |
| ------------------------------ | --------------------------------------------------- |
| **Brak daty ważności**         | Nieaktualny wpis leży dalej i agent mu ufa           |
| **Brak związku z kodem**       | Plik się zmienił, notatka o nim została              |
| **Ręczny plik bez limitu**     | całe 180 KB wchodzi do kontekstu także przy literówce |
| **Nikt tego nie sprząta**      | Rośnie, aż ktoś świadomie usiądzie i przejrzy        |
]

Do tego dochodzi drugie pytanie, którego pamięć w ogóle nie dotyka: **jak** agent ma pracować - czy planuje przed kodem, czy pisze testy, czy weryfikuje wynik.

I trzecie: **skąd** go uruchamiasz - terminal, telefon, czat zespołowy.

Trzy dziury, trzy narzędzia. Teraz po kolei.

???
Ten slajd jest zawiasem całej prezentacji, więc nie spieszcie się z nim. Wszystko, co zobaczycie dalej, jest odpowiedzią na coś z tej listy.

Pierwsze dwa wiersze to jeden problem widziany z dwóch stron: pamięć nie wie, czy jest jeszcze prawdziwa. Zapisaliście, że autoryzacja działa na tokenach z godzinnym czasem życia, ktoś to zmienił trzy miesiące temu, a agent dalej opowiada o godzinie, z pełnym przekonaniem. To jest gorsze niż brak notatki, bo brak notatki sprawia, że pyta.

Trzeci wiersz wymaga uczciwego zastrzeżenia, bo dotyczy tylko jednej z dwóch pamięci. Auto memory ma twardy limit: na starcie wchodzi pierwsze dwieście linii albo dwadzieścia pięć kilobajtów indeksu, co nastąpi wcześniej, a reszta jest doczytywana na żądanie. Mój ręczny plik wciągany małpą nie ma żadnego limitu - wchodzi w całości, zawsze.

I to jest koszt, który rośnie niezauważenie. Każdy pojedynczy fakt wydaje się tani, a potem okazuje się, że przy pytaniu o literówkę w README ładujecie sto osiemdziesiąt kilobajtów o czterdziestu projektach.

Czwarty jest najbardziej ludzki. Nikt nie lubi sprzątać notatek. Bez mechanizmu, który to wymusza, plik będzie rósł, aż przestaniecie mu ufać - a wtedy równie dobrze mógłby nie istnieć.

Dwa ostatnie akapity ze slajdu otwierają pozostałe dwie warstwy. Pamięć to tylko jedna trzecia problemu i za chwilę zobaczycie, że dwa pozostałe narzędzia nie mają z nią nic wspólnego.

---

class: center, middle, section

# Część 1

## Superpowers

.links[
Strona · https://claude.com/plugins/superpowers

Repozytorium · https://github.com/obra/superpowers
]

???
Zostawiamy na chwilę pamięć i bierzemy drugą dziurę z poprzedniego slajdu: to, jak agent pracuje.

Superpowers odpowiada na pytanie, dlaczego agent rzuca się do pisania kodu, zanim w ogóle zrozumiał, o co prosicie. Zastrzegę od razu, żeby nie powtórzyć błędu z wcześniejszej wersji tej prezentacji: Superpowers ma swoją trwałość, plan i ledger leżą w plikach i przeżywają `/clear`. Ale ta trwałość obsługuje bieżące zadanie, nie wiedzę o projekcie - po skończonym zadaniu następna sesja i tak startuje bez faktów.

To jest warstwa najprostsza do zainstalowania i najtrudniejsza do wytrzymania na dłuższą metę. Będzie o tym, co ląduje na dysku, jak to wchodzi do sesji i gdzie uwiera.

---

## Superpowers: co to jest

Plugin do Claude Code od **obra** (Jesse Vincent). Nie dodaje modelu - dodaje **procedury** w markdownie (plus garść skryptów pomocniczych).

Jest w oficjalnym marketplace Anthropic - wtedy instalacja to jedna komenda. Autor prowadzi też własny marketplace, prosto z repozytorium:

```bash
# oficjalny marketplace Anthropic
/plugin install superpowers@claude-plugins-official

# albo marketplace autora
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

Komenda zapisuje wpis w `settings.json` - można go też dodać ręcznie i trzymać w .u[dotfiles]:

```json
"enabledPlugins": { "superpowers@claude-plugins-official": true }
```

<div class="terminal-demo">Terminal - pokaż: instalację i katalog <code>~/.claude/plugins/cache/</code></div>

???
Jesse Vincent to nie jest przypadkowa osoba z GitHuba. Ma za sobą lata pracy nad narzędziami deweloperskimi i po prostu spisał to, co sam robi z agentem na co dzień. Superpowers wyrosło z jego własnej frustracji, a nie z planu produktowego.

Dwa marketplace'y to nie jest duplikat przez pomyłkę. Oficjalny katalog Anthropic przypina konkretny commit repozytorium autora, więc potrafi być o wydanie do tyłu - u mnie tak właśnie było, dostałem 6.3.0, kiedy upstream miał już 6.4.1. Marketplace autora ciągnie wprost z repozytorium.

Zastrzegam się tu świadomie, bo w poprzedniej wersji tej prezentacji twierdziłem, że oficjalny jest "przejrzany i stabilniejszy". Nie znalazłem na to żadnego źródła i tak to wycofuję - jedyna różnica, którą umiem udowodnić, to ta, że wersje mogą się rozjeżdżać. Jak nie gonicie za świeżynkami, bierzcie oficjalny.

Ostatni fragment z `settings.json` jest tu ważniejszy, niż wygląda. Komenda instalacyjna tylko dopisuje jedną linijkę do pliku, więc jeżeli trzymacie dotfiles w repozytorium, to wystarczy dodać tam ten wpis i macie wtyczkę na każdej maszynie bez klikania.

Pytanie, które pada w tym miejscu prawie zawsze: czy to działa offline. Tak, po instalacji wszystko jest lokalnie, sieć jest potrzebna tylko do pobrania i aktualizacji.

---

## Superpowers: co ląduje na dysku

Zainstalowana wersja na tej maszynie: **6.3.0**

```
~/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/
├── skills/     14 skilli
├── hooks/      hooks.json + session-start
├── docs/
└── package.json
```

W ścieżce siedzi nazwa marketplace'u i wersja, więc obie instalacje z poprzedniego slajdu mogą leżeć obok siebie.

Format to zwykły markdown z frontmatterem - **czytelny i wersjonowalny**.

**Nie tylko Claude Code.** Ten sam plugin instaluje się w Codeksie i Cursorze:

```bash
# Codex CLI - /plugins, potem szukaj "superpowers"
# Cursor Agent
/add-plugin superpowers
```

README opisuje instalację dla **14 agentów** - poza powyższymi m.in. Gemini CLI, Copilot CLI, OpenCode, Devin CLI, Antigravity, Factory Droid, Kimi Code i Pi.

???
Zachęcam, żebyście po powrocie do biurka zajrzeli do tego katalogu i otworzyli dowolny plik ze `skills`. Znajdziecie tam zwykły tekst po angielsku, mniej więcej taki, jaki napisalibyście młodszemu koledze w zespole. Żadnej magii, żadnego kodu.

To ma praktyczną konsekwencję: jeżeli jakiś skill wam nie pasuje, możecie go skopiować do `~/.claude/skills`, przepisać pod swoje realia i używać własnej wersji. Nie trzeba niczego forkować ani budować.

Numer wersji w ścieżce jest po to, żeby aktualizacja nie nadpisywała poprzedniej instalacji. Stare wersje zostają na dysku, więc jeżeli po aktualizacji coś zaczyna się dziwnie zachowywać, macie do czego porównać.

Uwaga praktyczna z mojej strony: nie edytujcie plików bezpośrednio w tym katalogu cache. Najbliższa aktualizacja pluginu zrobi nowy katalog z nową wersją i wasze zmiany po prostu przestaną być używane.

Padło pytanie, czy da się to zainstalować w Codeksie - da się, i to oficjalnie, z marketplace'u OpenAI. W aplikacji klikacie Plugins w bocznym panelu, w CLI wpisujecie ukośnik plugins i szukacie po nazwie. W Cursorze to jedna komenda w czacie agenta.

Ma to sens, bo skille są zwykłym markdownem - nie ma w nich nic, co wiązałoby je z konkretnym agentem. Różni się tylko sposób instalacji i to, którym mechanizmem plik trafia do kontekstu.

---

class: tight, tighter

## Jak Superpowers wstrzykuje się do sesji

Cały mechanizm to **jeden hook**:

```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "startup|clear|compact",
      "hooks": [{
        "type": "command",
        "command": "\"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd\" session-start"
      }]
    }]
  }
}
```

Na starcie sesji (i po `/clear`, i po kompakcji) hook wrzuca do kontekstu treść skilla `using-superpowers`.

Ten skill mówi agentowi jedno: **zanim cokolwiek zrobisz, sprawdź czy istnieje pasujący skill**.

Reszta ładuje się leniwie - przez narzędzie `Skill`.

**Jak sprawdzić, że działa** - uruchom hook ręcznie:

```bash
bash ~/.claude/plugins/cache/claude-plugins-official/\
superpowers/*/hooks/run-hook.cmd session-start
```

Poprawnie: JSON z polem `additionalContext`. Pusty wynik albo błąd = hook nie zadziała też w sesji.

???
Zwróćcie uwagę na `matcher`. Oprócz startu sesji są tam jeszcze `clear` i `compact`, i to jest istotny szczegół. Kompakcja potrafi wyrzucić z kontekstu wszystko, co agent wiedział o swoim sposobie pracy, więc bez tego hook zadziałałby raz i po godzinie rozmowy efekt by wyparował.

Cały koszt startowy to jeden skill, kilkaset tokenów. Reszta, czyli te czternaście procedur, leży na dysku i wchodzi do kontekstu dopiero wtedy, kiedy agent sam po nią sięgnie. Bez tego pomysł byłby nie do utrzymania.

I tu jest słaby punkt całej konstrukcji, o którym warto mówić głośno: to jest sugestia, nie kontrola. Nic nie zatrzyma agenta, który zdecyduje, że akurat tym razem żaden skill nie pasuje. Stąd te krzyczące wielkie litery w treści skilla - autor próbuje przekrzyczeć model.

W praktyce oznacza to, że czasem musicie sami powiedzieć "użyj brainstormingu". I to jest normalne, a nie objaw zepsutej instalacji.

Komenda z dołu slajdu to najszybszy sposób na rozstrzygnięcie, czy hook w ogóle działa, bez zgadywania po zachowaniu agenta. Odpalacie ją wprost w terminalu i patrzycie, czy wraca JSON. Gwiazdka w ścieżce załatwia numer wersji, więc nie trzeba go wpisywać.

Jeszcze jedna rzecz, na którą sam się nabrałem. Jeżeli wpiszecie w terminalu `echo $CLAUDE_PLUGIN_ROOT`, dostaniecie pustą linię i pomyślicie, że hook jest zepsuty. Nic z tych rzeczy - tę zmienną Claude Code ustawia wyłącznie dla procesu hooka, w momencie jego uruchomienia. W waszej zwykłej powłoce nigdy jej nie zobaczycie. Dlatego testujemy przez `run-hook.cmd`, a nie przez sprawdzanie zmiennej.

Sam `run-hook.cmd` to zresztą niezła sztuczka: ten sam plik jest jednocześnie poprawnym skryptem bash i poprawnym plikiem wsadowym Windows. Na Uniksie ścieżkę wylicza z `$0`, więc nawet nie potrzebuje tej zmiennej.

---

## Superpowers: 14 skilli w wersji 6.3.0

.cols[
.col[
**Proces / planowanie**
- `brainstorming` - dopytuje przed kodem
- `writing-plans` - ustalenia na plan
- `executing-plans` - plan na kod
- `subagent-driven-development`
- `dispatching-parallel-agents`

**Kodowanie**
- `test-driven-development`
- `systematic-debugging`
]
.col[
**Jakość i review**
- `requesting-code-review`
- `receiving-code-review`
- `verification-before-completion`

**Git**
- `using-git-worktrees`
- `finishing-a-development-branch`

**Meta**
- `using-superpowers` - najpierw sprawdź skille
- `writing-skills` - jak pisać własne skille
]
]

`writing-plans` zapisuje plan **do repozytorium**, nie do kontekstu: `docs/superpowers/plans/YYYY-MM-DD-<nazwa>.md` - plan przechodzi przez code review i przeżywa `/clear`.

???
Zdanie pod kolumnami jest ważniejsze, niż wygląda, i dopisałem je po pytaniu z sali. Plan nie zostaje w rozmowie - ląduje jako plik w waszym repozytorium, z datą w nazwie. To ma trzy konsekwencje: plan przeżywa `/clear`, wchodzi do pull requesta razem z kodem, i da się do niego wrócić za pół roku, żeby sprawdzić, co wtedy ustaliliśmy i dlaczego.

U mnie te pliki leżą w pięciu projektach, a najdłuższy ma sto trzydzieści cztery kilobajty. To nie są notatki na serwetce, tylko dokumenty, które faktycznie opisują zadanie po kawałku.

Jeżeli mielibyście spojrzeć tylko na jedną pozycję z tej listy, wziąłbym `verification-before-completion`. Adresuje najbardziej irytujące zachowanie agenta: oznajmia, że gotowe, a nikt nie uruchomił testów. Ten skill wymaga dowodu przed deklaracją sukcesu.

Na drugim miejscu postawiłbym `brainstorming`. Zmienia agenta z takiego, który zgaduje, czego chcecie, w takiego, który najpierw zadaje pytania. Część osób tego nie znosi, bo chcą kodu w pierwszej odpowiedzi.

`writing-skills` jest metapozycją, ale bardzo praktyczną. Jak zauważycie, że po raz piąty tłumaczycie agentowi ten sam firmowy proces, to jest sygnał, żeby zamienić go we własny skill.

Te czternaście pozycji to nie jest zbiór, który trzeba przyswoić. Agent wybiera z niego sam, a wy w codziennej pracy zetkniecie się realnie z czterema, może pięcioma.

W nagłówku jest numer wersji nie bez powodu: lista rośnie. Kiedy to sprawdzałem, upstream był już na 6.4.1 z piętnastym skillem do diagnozowania samego pluginu. Jak u was będzie inna liczba, to nie błąd na slajdzie, tylko nowsza wersja.

---

## Superpowers: typowy przepływ

.diagram[![Przepływ pracy Superpowers](assets/przeplyw-superpowers.svg)]

Pominięte na schemacie, ale równie ważne: `executing-plans` albo `subagent-driven-development` (świeży subagent na zadanie) oraz `requesting-code-review` na końcu.

???
Ten przepływ ma jeden koszt, o którym warto wiedzieć zawczasu: pierwsze dziesięć minut wygląda, jakby nic się nie działo. Agent zadaje pytania, pisze plan, prosi o akceptację, a wy wciąż nie macie ani jednej linijki kodu. Przy zadaniu na trzy dni to się zwraca, przy poprawce literówki jest absurdalne.

`subagent-driven-development` to jest to miejsce, w którym Superpowers zaczyna naprawdę zarabiać na siebie. Każde zadanie z planu dostaje świeżego subagenta z czystym kontekstem, więc nie ciągnie za sobą śmieci z poprzednich piętnastu zadań.

Jest przy tym pułapka, na którą się nadziałem. Kilka subagentów pracujących równolegle w jednym katalogu dzieli ten sam indeks gita, więc potrafią sobie nawzajem wciągnąć pliki do commita. Jak idziecie w równoległość, to albo osobne worktree, albo commitowanie z jawną listą ścieżek.

Druga rzecz z praktyki: subagenty bywają nadgorliwe i lubią dopisywać do commitów rzeczy, których im nie kazaliście. Warto przejrzeć historię po takiej serii, zanim cokolwiek wypchniecie.

---

## Superpowers: co daje w praktyce

**Plusy**
- ⚡ Zero plików konfiguracyjnych - hook wstaje sam po instalacji
- 📄 Skille to markdown, łatwo czytać i forkować
- 🔀 Nie tylko Claude Code: README opisuje instalację dla 14 agentów

**Koszty i ryzyka**
- 🍽️ Kosztuje kontekst - na starcie 3 KB, ale pojedynczy skill wchodzi w całości
- 🔨 Narzuca ciężki proces tam, gdzie wystarczyłby jednolinijkowy fix
- 🙈 Model potrafi "zracjonalizować" pominięcie skilla, stąd agresywne `EXTREMELY-IMPORTANT`
- 📡 Opcjonalna telemetria - logo w wizualnym towarzyszu ładuje się z serwera autora i niesie numer wersji (`SUPERPOWERS_DISABLE_TELEMETRY`)

📌 **Ma własną trwałość, ale tylko na czas zadania:** plan w `docs/superpowers/plans/` i ledger w `.superpowers/sdd/` przeżywają `/clear` i kompakcję.

🚫 Czego nie robi: **nie gromadzi wiedzy o projekcie**. Zadanie się kończy, plan zostaje jako dokument, a następna sesja startuje bez faktów.

???
Drugi punkt z listy kosztów jest w praktyce najdotkliwszy. Prosicie o zmianę jednej stałej, a dostajecie propozycję sesji brainstormingu i planu w trzech krokach. Da się to uciąć zdaniem "to drobiazg, zrób od razu", ale trzeba pamiętać, żeby je powiedzieć.

Punkt o wielu agentach traktuję jako najmocniejszy argument za. Skoro to są zwykłe pliki markdown, to ten sam zestaw procedur działa w Codeksie, Cursorze czy Gemini CLI. Nie zamykacie się u jednego dostawcy.

Teraz dwa ostatnie punkty, bo w poprzedniej wersji tej prezentacji miałem tu zdanie "Superpowers nie rozwiązuje problemu pamięci" i to było po prostu nieprawdziwe. Sprawdziłem: rozwiązuje, tylko w innym zakresie, niż się na pierwszy rzut oka wydaje.

Plan z `writing-plans` ląduje jako plik w repozytorium, więc przeżywa `/clear` i wchodzi do pull requesta. A `subagent-driven-development` prowadzi ledger w `.superpowers/sdd/` i w samym skillu jest zdanie, że pamięć rozmowy nie przeżywa kompakcji, więc postęp ma być śledzony w pliku. Autor pisze wprost, że po kompakcji agent ma ufać ledgerowi i historii gita, a nie własnym wspomnieniom. Jest tam nawet uwaga, że kontrolery bez ledgera potrafiły rozesłać drugi raz komplet skończonych zadań - to najdroższa awaria, jaką zaobserwowano.

Czyli trwałość owszem jest, tylko ma inny horyzont. Plan i ledger żyją tyle, co zadanie: prowadzą agenta od pierwszego kroku do merge'a, przez kompakcje i restarty. Kiedy zadanie się kończy, nic z tego nie zamienia się w wiedzę o projekcie. Plan zostaje dokumentem historycznym, ledger jest gitignorowany, a nowa sesja o kolejne zadanie zaczyna tak samo pusto.

I to jest różnica, o którą tu chodzi: Superpowers pamięta, co robi teraz, memspec pamięta, czego się nauczyliście. Dlatego ludzie sięgają po drugie narzędzie - nie dlatego, że pierwsze zawiodło, tylko dlatego, że to dwa różne horyzonty pamięci.

---

class: center, middle, section

# Część 2

## memspec

.links[
Repozytorium · https://github.com/siimvene/memspec

Pakiet · https://www.npmjs.com/package/memspec
]

???
Przed chwilą ustaliliśmy, że pamięć Superpowers kończy się razem z zadaniem. Teraz zajmiemy się tym, co ma przetrwać dłużej.

memspec to projekt Siima Vene, sporo młodszy od Superpowers i zdecydowanie bardziej opiniotwórczy. Nie mówi wam tylko "zapisuj rzeczy", tylko narzuca, w jakiej formie i na jak długo.

Uprzedzam, że to będzie najgęstsza część prezentacji. Jeżeli w którymś momencie zgubicie wątek, dajcie znać od razu, bo kolejne slajdy budują na poprzednich.

---

## memspec: problem do rozwiązania

Agent zaczyna każdą sesję od zera. Znane obejścia i ich wady:

.big-table[
| Obejście                     | Problem                                          |
| ---------------------------- | ------------------------------------------------ |
| Wszystko w `CLAUDE.md`       | Puchnie, nikt nie usuwa nieaktualnych wpisów      |
| Notatki w plikach projektu   | Brak struktury, brak wyszukiwania                 |
| Pamięć wbudowana w narzędzie | Brak dat ważności, brak związku z kodem           |
]

**Teza memspec:** pamięć bez daty ważności i bez powiązania z kodem staje się szkodliwa - agent działa na nieprawdziwych faktach z pełnym przekonaniem.

```bash
npm install -g memspec
memspec init
```

<div class="terminal-demo">Terminal - pokaż: <code>memspec init</code> i strukturę <code>.memspec/</code> po inicjalizacji</div>

???
Pierwszy wiersz tej tabeli zna chyba każdy, kto pracuje z agentem dłużej niż miesiąc. `CLAUDE.md` zaczyna od dwudziestu linijek, po kwartale ma dwieście, a połowa z nich opisuje stan projektu sprzed trzech refaktorów. Nikt tego nie usuwa, bo nikt nie wie, które wpisy są jeszcze prawdziwe.

Mam z tego konkretną historię. Agent przez kilka tygodni uparcie dopisywał obsługę zmiennych środowiskowych przez `dotenv`, bo tak było w notatce. Paczka wyleciała z projektu dawno temu, zastąpiona natywnym `loadEnvFile`, ale notatka została i agent traktował ją jak prawdę objawioną.

I to jest właśnie ta szkodliwość z tezy na slajdzie. Brak informacji to mniejszy problem, bo agent wtedy pyta albo sprawdza. Nieaktualna informacja jest gorsza, bo agent ją bierze za pewnik i nawet nie zajrzy do kodu.

Instalacja to zwykła paczka z npm i jedna komenda inicjalizująca w katalogu projektu. Nic poza tym nie trzeba stawiać, żadnego serwera ani bazy.

---

## memspec: struktura na dysku

Z realnego projektu `~/projects/acme-shop`:

```
.memspec/
├── memory/
│   ├── facts/  decisions/  procedures/         ← agent-tier
│   ├── operator/{facts,decisions,procedures}/  ← twoje, trudniej nadpisać
│   └── questions/                              ← konkurencyjne odpowiedzi
├── observations/                               ← notatki z twardym TTL 7 dni
├── archive/                                    ← superseded + retired
├── evidence/                                   ← dowody (pliki do 5 MB)
├── config.yaml
├── .fts.db                                     ← indeks SQLite (gitignored, odtwarzalny)
├── usage.jsonl                                 ← log wyszukiwań (gitignored)
└── outcomes.jsonl                              ← kwity skutków (gitignored)
```

**Po co SQLite?** Żeby agent mógł **szukać zamiast czytać wszystko**. Wyszukiwanie pełnotekstowe FTS5 z rankingiem BM25 zwraca 5 trafnych rekordów zamiast ładować cały magazyn do kontekstu.

Reguła projektu: **pliki są kanoniczne, indeksy są jednorazowe**. Baza `.fts.db` odbudowuje się z markdownu - _stracisz indeks, stracisz szybkość, nie dane_.

???
Najważniejszy podział na tym listingu to `facts`, `decisions` i `procedures`. Fakt mówi, jak coś jest. Decyzja mówi, dlaczego wybraliśmy tak, a nie inaczej. Procedura mówi, jak się coś w tym projekcie robi. Rozdzielenie tych trzech rzeczy ma sens, bo każda z nich starzeje się w zupełnie innym tempie.

Katalog `operator` to wasza przestrzeń i tu muszę być precyzyjny, bo łatwo o tym powiedzieć za dużo. To nie jest blokada, tylko próg tarcia ze śladem w historii.

Zajrzałem do kodu: nadpisanie rekordu operatorskiego wymaga jawnej flagi `override_operator`, a jej użycie dopisuje się do powodu zmiany, więc zostaje widoczne. Tyle że ta flaga jest wystawiona agentowi w MCP, a to, czy rekord jest "operatorski", wynika z pola `source` - zwykłego stringa, który agent też może ustawić. Więc model, który bardzo chce, przejdzie.

Wartość jest realna, tylko inna niż się wydaje: nie "model tego nie ruszy", ale "jak ruszy, to zobaczycie to w pliku i w gicie".

`observations` z twardym siedmiodniowym terminem to moja ulubiona część. To jest miejsce na "dzisiaj build się sypie na tym teście" - rzeczy prawdziwe teraz, bezwartościowe za tydzień. Bez takiego kosza wszystko ląduje w faktach i faktów robi się tysiąc.

Padło pytanie, po co w ogóle baza, skoro wszystko jest w markdownie, i to jest dobre pytanie. Odpowiedź sprowadza się do budżetu kontekstu. Przy trzystu rekordach nie da się wrzucić agentowi całego magazynu, bo zżarłby całe okno, zanim zdążyłby cokolwiek zrobić. FTS5 z rankingiem BM25 pozwala mu zadać pytanie i dostać pięć najtrafniejszych rekordów zamiast wszystkiego.

Drugi powód jest taki, że `MEMORY.md`, o którym mówiliśmy na wstępie, ma dokładnie ten problem i nie ma go jak rozwiązać. Plik ładuje się w całości albo wcale, nie ma w nim czego przeszukiwać.

Zdanie o kanonicznych plikach ma praktyczną konsekwencję. Bazę możecie skasować w dowolnym momencie i odbuduje się z markdownu. W dokumentacji jest to ujęte ładnie: stracisz indeks, stracisz szybkość, nie dane. Nie musicie jej backupować ani trzymać w repozytorium.

Celowo zawęziłem to zdanie do `.fts.db`, bo gitignorowane są trzy pliki, a odtwarza się jeden. `usage.jsonl` i `outcomes.jsonl` to logi zdarzeń - zapisują, co było wyszukiwane i z jakim skutkiem, więc nie ma ich z czego zrekonstruować. To nie jest pamięć, tylko telemetria, ale `usage.jsonl` podbija w rankingu rekordy często używane. Skasowanie go nie traci wiedzy, tylko cofa ranking do stanu "nic nigdy nie było czytane".

---

## memspec: jak wygląda pojedynczy rekord

```yaml
---
id: ms_01M2X1PD4YZRY8BBG44WDTKPPR                   # ULID, sortowalny po czasie
kind: claim                                         # claim | observation | question
type: fact                                          # fact | decision | procedure
state: active                                       # active | superseded | retired
source: 'human:dev'                                 # kto zapisał; 'unknown' odrzucane
check_by: '2026-12-18T14:39:00.256Z'                # data ważności - potem re-weryfikacja
last_verified: '2026-09-19T14:39:06.344Z'           # kiedy ostatnio potwierdzone
verified_with: anchor                               # anchor | operator | evidence | assertion
anchors:                                            # powiązanie z kodem
  - file: src/auth/jwt.js                           # plik, którego dotyczy fakt
    sha: 73d472c9a317bcc9a798e824b0348e80f0c39fee   # SHA bloba, nie commita
supersedes:                                         # co ten rekord zastępuje
  - ms_01M2X1NA0XN464ATZKXKJZNTA7
supersede_reason: TTL zmieniony na 60m              # dlaczego
---
# Logowanie używa JWT z TTL 60 minut
```

Najważniejsze pole to **`anchors`**: fakt zna SHA blobu pliku, z którego pochodzi.

???
Zwróćcie uwagę, że w polu `sha` siedzi SHA blobu, czyli zawartości pliku, a nie commita. To nie jest szczegół. Gdyby memspec trzymał SHA commita, każdy commit w repozytorium unieważniałby wszystkie fakty naraz. Przy SHA blobu nieaktualne robią się tylko te fakty, których plik faktycznie ktoś zmienił.

Dzięki temu da się zadać pytanie, którego zwykła notatka nie obsłuży: "pokaż mi wszystko, co wiem o autoryzacji, a czego plik zmienił się od czasu zapisu". To jest lista rzeczy do sprawdzenia, a nie ślepa nadzieja, że notatki są aktualne.

Pole `source` z wartością `unknown` jest odrzucane i to celowa złośliwość projektu. Jak nie wiadomo, kto coś zapisał, to nie wiadomo, ile ta informacja jest warta.

Pytanie, które pewnie już się komuś nasuwa: czy trzeba to pisać ręcznie. Nie, cały ten blok generuje komenda `remember`, a kotwice dokłada `anchor`. Pokazuję surowy plik, żebyście wiedzieli, co siedzi pod spodem, bo to zwykły markdown w waszym repozytorium.

---

## memspec: kotwice i cykl życia

.diagram[![Cykl życia rekordu memspec](assets/cykl-zycia.svg)]

Korekta nie kasuje starej wiedzy - rekord wędruje do `archive/` ze stanem `superseded`. Da się prześledzić, **co agent wiedział i kiedy**.

???
Kiedy zmienia się fakt, stary rekord nie znika - ale precyzyjnie: jego treść zostaje nietknięta, natomiast frontmatter dostaje stan `superseded`, a sam plik przenosi się z `memory/` do `archive/`. Nowy rekord wskazuje na niego przez `supersedes` i dopisuje powód zmiany.

Mówię o tym dokładnie, bo ktoś po prezentacji zrobi `ls .memspec/memory/facts/`, nie znajdzie starego wpisu i uzna, że go okłamałem. Wpis jest, tylko piętro niżej. Przy okazji: `sweep` opisany w pomocy jako jedyna ścieżka usuwania też fizycznie nic nie kasuje, tylko przenosi do archiwum ze stanem `retired`.

To rozwiązuje problem, którego zwykły plik z notatkami nie rozwiązuje. Jak agent trzy tygodnie temu podjął dziwną decyzję, możecie sprawdzić, jaki stan wiedzy miał wtedy na biurku. Przy nadpisywaniu w miejscu ta informacja po prostu przepada.

Stan `retired` to co innego niż `superseded`. `superseded` znaczy "jest nowsza wersja tego faktu", `retired` znaczy "ta wiedza już do niczego nie jest potrzebna, temat zamknięty". Warto ich nie mylić, bo różnie się je potem filtruje.

Praktyczna uwaga na koniec: to wszystko leży w gicie. Czyli oprócz własnej historii memspec dostajecie drugą historię, tę z gita, i widać w niej, kto i w którym commicie tę pamięć zmienił.

---

class: tight, tighter

## memspec: TTL i konfiguracja

Wszystko poniżej siedzi w `.memspec/config.yaml` (globalnie: `~/.memspec/config.yaml`). **Brak pliku = wartości domyślne**, nic nie trzeba tworzyć.

```yaml
decay:
  fact: 90d
  decision: 180d
  procedure: 90d
  observation: 7d        # obserwacje wygasają twardo

profiles:
  default:
    max_tokens: 2000     # budżet kontekstu na starcie sesji
    min_confidence: 0.7
    ranking:
      relevance: 0.4
      confidence: 0.3
      recency: 0.3
```

Warstwy magazynów - projekt wygrywa z globalnym:

```yaml
stores:
  - { name: global,  path: ~/.memspec, priority: 0,  writable: false }
  - { name: project, path: .memspec,   priority: 10, writable: true }
```

???
Te wartości w sekcji `decay` to nie są terminy ważności po których coś znika. Po upływie TTL rekord trafia na listę do ponownego potwierdzenia. Ktoś ma na niego spojrzeć i powiedzieć, czy to nadal prawda. Nic nie kasuje się samo za waszymi plecami.

Różnica między dziewięćdziesięcioma dniami dla faktu a stu osiemdziesięcioma dla decyzji jest przemyślana. Fakt o kodzie potrafi się zdezaktualizować w miesiąc, a powód, dla którego wybraliśmy daną bazę danych, zwykle jest prawdziwy przez lata.

`max_tokens` to jedyny twardy budżet kontekstu w całej tej prezentacji i wrócę do tego w części piątej. Dwa tysiące tokenów na starcie sesji to sensowny punkt wyjścia - jak macie duży magazyn, agent dostanie najwyżej tyle, posortowane po trafności.

Warstwy magazynów działają tak, jak byście się spodziewali po kaskadzie: globalny trzyma rzeczy wspólne dla wszystkich projektów, projektowy ma wyższy priorytet i wygrywa przy konflikcie. Globalny jest domyślnie tylko do odczytu, żeby agent pracujący w jednym repozytorium nie napisał czegoś, co wyleje się na wszystkie pozostałe.

---

## memspec: pełna lista komend

.cols.dense[
.col[
**Zapis**
- `remember <type> <title>`
- `observe <text>`
- `question`
- `anchor <id> <files>`
- `relate` / `unrelate`

**Odczyt**
- `search <query>`
- `context`
- `export`
- `status`
- `stores`
]
.col[
**Utrzymanie i transkrypty**
- `verify <id>`
- `supersede <id>`
- `reconcile`
- `outcome <id>`
- `probe <id>`
- `sweep`
- `migrate`
- `init`
- `import-openclaw`
- `normalize` → `distill` → `reduce`
]
]

**14 narzędzi MCP**, w tym `get`, którego w CLI nie ma w ogóle. Z 23 komend CLI poza MCP zostaje **10**: akty operatorskie (`init`, `migrate`, `sweep`, `probe`), cały ciąg transkryptów oraz `context` i `stores`.

Ciekawostka: `import-openclaw` wciąga do memspec pamięć z OpenClaw - dwa z trzech narzędzi wprost o sobie wiedzą. Importer pokrywa `MEMORY.md`, ale .u[dwie z trzech ścieżek celują w pliki, których OpenClaw nie tworzy].

???
Spokojnie, nikt tego nie używa w całości. W codziennej pracy realnie dotkniecie czterech: `remember`, `search`, `context` i `verify`. Reszta to albo automatyka, albo rzeczy, które robi się raz na kwartał.

Ciąg `normalize`, `distill`, `reduce` zasługuje na osobne zdanie, bo to jest najciekawszy pomysł w tym narzędziu. Bierze transkrypty waszych sesji z Claude Code, wyciąga z nich kandydatów na fakty, zbija duplikaty i podaje wam listę do zatwierdzenia. Czyli pamięć powstaje z tego, co i tak się wydarzyło, a nie z waszej pamięci o tym, co warto zapisać.

Podział na to, co jest w MCP, a co nie, wart jest chwili uwagi, bo ma dwa różne powody. Pierwszy to świadome odcięcie agenta: `init`, `migrate` i `sweep` zmieniają strukturę magazynu albo kasują rekordy, więc zostają decyzją człowieka. Drugi jest bardziej prozaiczny - `context` i ciąg `normalize`, `distill`, `reduce` po prostu nie są narzędziami, które agent wywołuje w trakcie rozmowy. `context` odpala hook na starcie sesji, a transkrypty przerabia się między sesjami.

Zastrzeżenie, żebym nie przesadził w drugą stronę: w MCP jest też `get`, którego w CLI nie ma w ogóle. Więc to nie jest tak, że MCP to podzbiór komend - te dwa zestawy po prostu się częściowo pokrywają.

`import-openclaw` pokazuję głównie jako ciekawostkę, ale mówi coś o tym ekosystemie. Te projekty nie udają, że są jedynym narzędziem na świecie, tylko zakładają, że używacie kilku naraz.

Zastrzeżenie w drugiej połowie tego zdania sprawdzałem w kodzie i muszę je postawić uczciwiej, niż zrobiłem to za pierwszym razem. Importer rozpoznaje workspace po trzech ścieżkach: `MEMORY.md`, `memory/observations.md` i katalogu `memory/procedures`. Pierwsza działa naprawdę - parsuje z niej sekcje `Quick Facts` i `Decisions` na rekordy. Dwie pozostałe to format, którego OpenClaw dzisiaj nie produkuje.

Czyli integracja nie jest martwa, tylko niepełna, i to jest ciekawszy morał: między dwoma młodymi projektami zgodność bywa częściowa, a zorientujecie się dopiero wtedy, gdy część danych po prostu nie przyjedzie. Wrócę do tego w części trzeciej.

---

## memspec: integracja z Claude Code

Dwie drogi, można używać obu: **przez MCP** (agent pyta, kiedy chce) i **przez hooki** (pamięć wchodzi sama - za trzy slajdy).

**Droga pierwsza: MCP server.** Binarka `memspec-mcp` jedzie w paczce od pierwszego wydania (0.2.0, kwiecień 2026). Wpis w `.mcp.json` projektu:

```json
{
  "mcpServers": {
    "memspec": {
      "command": "memspec-mcp",
      "args": ["--cwd", "/Users/dev/projects/acme-shop"]
    }
  }
}
```

`--cwd` wskazuje projekt, którego magazyn ma być czytany - bez tego serwer rozwiązuje go od katalogu procesu.

???
Różnica między tymi dwiema drogami sprowadza się do tego, kto inicjuje. Przez MCP agent sam sięga po pamięć wtedy, kiedy uzna, że jej potrzebuje. Przez hooki pamięć wchodzi do kontekstu niezależnie od tego, czy agent o nią prosił.

W praktyce warto mieć obie. Hook daje bazowy kontekst na start, a MCP pozwala agentowi w połowie rozmowy sprawdzić coś, o czym wcześniej nie było mowy.

Argument `--cwd` wygląda niewinnie, a jest najczęstszym źródłem zgłoszeń "memspec nie widzi moich faktów". Bez niego serwer szuka magazynu tam, gdzie akurat został odpalony proces, a to nie zawsze jest katalog waszego projektu. Jak coś nie działa, zaczynajcie sprawdzanie od tej linijki.

Wpis wkładamy do `.mcp.json` projektu, a nie do globalnej konfiguracji. Dzięki temu wchodzi do repozytorium i reszta zespołu dostaje to samo podpięcie bez klikania po konfiguracjach.

---

class: tight

## memspec: integracja z Codex i Cursor

Ta sama binarka, inny plik konfiguracyjny. **Nie trzeba niczego przepisywać.**

**Codex** - `~/.codex/config.toml` albo jedna komenda:

```bash
codex mcp add memspec -- memspec-mcp --cwd /abs/sciezka/projekt
```

```toml
[mcp_servers.memspec]
command = "memspec-mcp"
args = ["--cwd", "/abs/sciezka/projekt"]
```

**Cursor** - `.cursor/mcp.json` w projekcie (albo `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "memspec": {
      "type": "stdio",
      "command": "memspec-mcp",
      "args": ["--cwd", "/abs/sciezka/projekt"]
    }
  }
}
```

`memspec init` sam tworzy `.mcp.json`, który Claude Code i Cursor wykrywają automatycznie.

???
Sedno tego slajdu: memspec nie jest narzędziem dla Claude Code. To serwer MCP, a MCP jest standardem, więc wpina się wszędzie tam, gdzie klient MCP istnieje. Zmienia się wyłącznie plik, do którego wkładacie te cztery linijki.

Codex trzyma to w TOML-u zamiast w JSON-ie i ma do tego komendę, więc najszybciej dodać serwer jednym poleceniem i nie otwierać edytora. Potem `codex mcp list` pokaże, czy się załapało.

Cursor czyta ten sam format co Claude Code, z jedną różnicą: dokumentacja zaleca jawne `type` ustawione na stdio. Możecie wybrać konfigurację projektu albo globalną - projektowa wchodzi do repozytorium i działa u całego zespołu.

Ostatnia linijka oszczędza sporo pracy. Po `memspec init` plik `.mcp.json` już jest i Claude Code oraz Cursor go widzą same, bez niczego więcej. Ręcznie dopisujecie tylko wtedy, gdy siedzicie na Codeksie albo chcecie inny magazyn niż domyślny.

Praktyczna konsekwencja, o której warto powiedzieć głośno: dwa różne narzędzia podpięte do tego samego magazynu widzą dokładnie te same fakty. To jest coś, czego wbudowane pamięci z części zerowej nie potrafią - tam każdy agent ma własną, osobną.

---

## memspec: hooki i dream pass

**Droga druga: hooki**, instalowane przez `memspec init` do `~/.claude/hooks/`:
- `memspec-session-start.js` - wstrzykuje `memspec context` na starcie
- `memspec-consolidate.js` - po commicie prosi agenta o zapisanie wniosków (hook na `Bash`, raz na sesję)

**Dream pass** (`memspec-dream`) - okresowa refleksja nad N dniami zapisów + `git log`. Wynik w `<store>/dream/YYYY-MM-DD.md`, wyłącznie jako **propozycje**.

<div class="terminal-demo">Terminal - pokaż: <code>memspec context</code>, <code>ls ~/.claude/hooks</code> i przykład dream pass</div>

???
Hook po commicie rozwiązuje najbardziej ludzki problem w całej tej historii: nikt nie pamięta o zapisywaniu wniosków. Moment po commicie jest dobry, bo świeżo wiecie, co i dlaczego zrobiliście, a za dwa dni już nie.

Technicznie to nie jest hook gita, tylko `PostToolUse` na narzędziu Bash, który sam sprawdza, czy komenda była commitem. Odpala się raz na sesję, żeby nie męczyć przy każdym commicie.

I jedna rzecz, o której warto wiedzieć przed uruchomieniem `memspec init`: on dopisuje te hooki do waszego globalnego `settings.json`. Jak trzymacie go w dotfiles pod symlinkiem, dostaniecie tam diff. Da się to wyłączyć flagą `--no-install-hooks`.

Dream pass brzmi jak marketing, ale mechanika jest prozaiczna. Narzędzie bierze zapisy z ostatnich kilku dni, zestawia je z historią gita i szuka rzeczy, które się nie zgadzają albo powtarzają. Wyniki idą do osobnego pliku z datą.

Podkreślam słowo "propozycje", bo to jedyny bezpieczny układ. Gdyby ten mechanizm sam wpisywał rzeczy do magazynu, po tygodniu mielibyście pamięć napisaną przez model na podstawie innych rzeczy napisanych przez model. Ktoś musi być w tej pętli i to jesteście wy.

W praktyce dream pass odpalam raz na tydzień albo dwa i traktuję jak przegląd. Codziennie nie ma sensu, bo przez jeden dzień zwykle nic ciekawego się nie kumuluje.

---

class: tight

## Jeden magazyn, kilku agentów naraz

Wbudowane pamięci są **zamknięte**: Claude Code nie czyta `~/.codex/memories/`, Codex nie czyta katalogu Claude Code. memspec znosi ten podział, bo jest **plikami na dysku, nie usługą**.

.diagram[![Współdzielony magazyn memspec](assets/wspolna-pamiec.svg)]

Warunki: ten sam `--cwd` w obu narzędziach, magazyn w repo - konflikt rozwiązuje **git**, nie blokada pliku.

???
To jest odpowiedź na pytanie, które padło przy poprzednim slajdzie: czy da się mieć jedną pamięć dla Claude Code i Codexa pracujących równolegle. Da się, ale nie przez wbudowane mechanizmy - Claude Code i Codex są zamknięte w obrębie swojego narzędzia i nie zaglądają do cudzego katalogu. OpenClaw jest tu wyjątkiem, do którego wrócę w części trzeciej, ale u niego to jednorazowy import, a nie wspólny magazyn.

memspec to potrafi z prostego powodu: nie ma tam żadnego serwera ani bazy, do której trzeba by się logować. Jest katalog z markdownem. Cokolwiek umie uruchomić `memspec-mcp` i wskazać ten katalog, widzi te same fakty.

W praktyce wygląda to tak, że w jednym oknie mam Claude Code, w drugim Codexa, oba podpięte do magazynu w tym samym repozytorium. Fakt zapisany przez jednego jest widoczny dla drugiego od razu, bo to po prostu nowy plik na dysku.

Pierwszy warunek ze slajdu to ta sama pułapka z `--cwd`, o której mówiłem chwilę temu. Dwa narzędzia wskazujące różne katalogi to dwie osobne pamięci, które wyglądają jak jedna.

Drugi warunek jest ważniejszy, niż się wydaje. Nie ma tu blokad ani transakcji, więc przy równoczesnym zapisie liczy się to samo, co przy kodzie: rekordy to osobne pliki z unikalnym identyfikatorem, a konflikty rozstrzyga git. Dlatego magazyn w repozytorium ma sens także technicznie, nie tylko procesowo.

---

class: tight

## Game changer: pamięć, która wie, że skłamała

Każda inna pamięć z tej prezentacji jest **bierna** - leży i czeka, aż ktoś zauważy, że wpis jest nieaktualny. Zwykle zauważa agent, działając według nieprawdy.

memspec jako jedyny potrafi **sam się zgłosić**:

```bash
$ memspec reconcile
ms_01M2X… „Logowanie używa JWT z TTL 60 minut"
          src/auth/jwt.js — zmieniony od ostatniej weryfikacji
```

Mechanizm: rekord trzyma **SHA blobu** pliku, z którego powstał. Plik się zmienia - SHA się nie zgadza - fakt trafia na listę do sprawdzenia.

.big-table[
| Pytanie | Bez kotwic | Z kotwicami |
| --- | --- | --- |
| „Co mogło się zdezaktualizować?" | .u[nie da się odpowiedzieć] | lista z `reconcile` |
| Plik przeniesiony | fakt cicho traci sens | `--repair-renames` przepina |
| Po dużym refaktorze | ufasz wszystkiemu | wiesz, co przejrzeć |
]

To zamienia pamięć z notatnika w coś, co ma **stan** i potrafi go zakwestionować.

???
Jeżeli mielibyście zapamiętać z całej części o memspec jedną rzecz, to tę. Cała reszta - katalogi, TTL, warstwy magazynów - to porządna inżynieria, ale takie rzeczy da się jakoś poskładać samemu. Tego jednego nie da się.

Postawcie obok siebie wszystkie pamięci z tej prezentacji. `MEMORY.md`, wbudowana pamięć Claude Code, workspace OpenClaw - każda z nich jest bierna. Zapisujecie fakt i on tam leży. Kod się zmienia, fakt zostaje taki sam, i nic o tym nie wie. Dowiadujecie się dopiero wtedy, kiedy agent robi coś głupiego, bo działa według czegoś, co było prawdą pół roku temu.

memspec odwraca kierunek. To wy pytacie magazyn, co mogło się zepsuć, zamiast czekać, aż magazyn was zawiedzie. I to jest pytanie, którego zwykłej notatce nie da się nawet zadać - nie ma czego porównać.

Mechanizm jest banalnie prosty, co jest jego zaletą. Zapisując fakt, mówicie, z którego pliku pochodzi, a memspec zapamiętuje SHA zawartości tego pliku. Przy `reconcile` porównuje: jeśli SHA się nie zgadza, to znaczy, że ktoś ruszył kod pod tym faktem. Nie wie, czy fakt przestał być prawdziwy - wie, że mógł przestać. To wystarczy, bo daje wam krótką listę zamiast całego magazynu.

Zwróćcie uwagę na SHA blobu, nie commita. To był świadomy wybór autora i dobry: gdyby trzymał commit, każdy commit w repozytorium unieważniałby wszystko naraz i lista byłaby bezużyteczna.

Drugi wiersz tabeli lubię najbardziej, bo to jest ten przypadek, na którym normalnie każda notatka umiera po cichu. Przenosicie plik, treść zostaje ta sama, notatka o nim traci sens i nikt tego nie zauważy. `reconcile --repair-renames` znajduje takie przypadki po identycznej zawartości i przepina kotwicę, domyślnie na sucho, a z `--apply` zapisuje.

Trzeci wiersz to scenariusz, w którym to się zwraca najszybciej. Po dużym refaktorze pytacie magazyn, które fakty dotykały ruszonych plików, i macie listę do przejrzenia w kilkanaście minut. Bez tego macie wybór między ufaniem wszystkiemu a nieufaniem niczemu.

---

## memspec: bilans

**Plusy**
- ⏳ Jedyne z trzech, które **egzekwuje** starzenie maszynowo: data ważności i kotwica w kodzie na każdym rekordzie
- 🔍 Pliki w gicie - diff, review, historia
- 🛡️ Rozdział `operator` / `agent` - nadpisanie Twojego wpisu wymaga jawnej flagi, zapisywanej w powodzie

**Koszty i ryzyka**
- 📚 Najwięcej pojęć do przyswojenia: claim, anchor, supersede, coverage, receipt
- 🏋️ Wymaga dyscypliny - magazyn, do którego nikt nie pisze, jest bezużyteczny
- 🚧 Młody projekt, szybko zmieniające się API (v0.9 → v0.11: pytania, dowody, `requires_human`)

???
Punkt o dyscyplinie jest tu najważniejszy i mówię to jako ktoś, kto już raz odbił się od tego narzędzia. Magazyn, do którego nikt nie pisze, to nie jest narzędzie neutralne - to narzędzie szkodliwe, bo daje fałszywe poczucie, że wiedza gdzieś jest.

Mój test przed wdrożeniem: czy w tym projekcie są rzeczy, o których agent regularnie zapomina i które kosztują was powtarzane tłumaczenie. Jak tak, memspec się zwróci. Jak nie, dokładacie sobie ceremonii bez zysku.

Punkt o zmiennym API traktujcie poważnie przy planowaniu. To jest wersja zero przed przecinkiem i kolejne wydania potrafią zmienić kształt rekordów. Jest komenda `migrate`, więc dane nie przepadną, ale trzeba się liczyć z tym, że co jakiś czas trzeba ją uruchomić.

Najmocniejszy argument za to według mnie ostatni plus z pierwszej kolumny. Pamięć w repozytorium znaczy, że kiepska notatka da się wyłapać na code review - dokładnie tak samo jak kiepski kod. Żadne inne rozwiązanie z tej prezentacji tego nie daje.

---

class: center, middle, section

# Część 3

## OpenClaw

.links[
Strona · https://openclaw.ai/

Repozytorium · https://github.com/openclaw/openclaw
]

???
Dwie pierwsze warstwy zakładały, że siedzicie przed terminalem i piszecie do agenta. Teraz zajmiemy się pytaniem, co zrobić, kiedy akurat nie siedzicie.

Uprzedzam od razu: to jest zupełnie inna kategoria niż poprzednie dwa narzędzia i połowa nieporozumień wokół OpenClaw bierze się właśnie stąd.

Ta część będzie najkrótsza, bo OpenClaw robi rzecz prostą do opisania, tylko w dużej skali.

---

## OpenClaw: inna kategoria

To **nie jest** plugin do Claude Code. To osobny, lokalny asystent AI pod niezależną fundacją non-profit.

Strona projektu: **https://openclaw.ai/**

.diagram[![Architektura OpenClaw](assets/openclaw.svg)]

???
Superpowers jest pluginem do Claude Code, memspec jest CLI z serwerem MCP obok Claude Code, a OpenClaw jest osobnym procesem, który Claude Code może sobie uruchomić jako jednego z agentów. Relacja jest odwrócona i dlatego porównywanie tych trzech rzeczy jeden do jednego prowadzi donikąd.

Jeżeli szukacie analogii: to jest trochę jak różnica między konwencją pisania kodu, bazą danych i serwerem, na którym to wszystko stoi. Serwer nie konkuruje z konwencją.

Za projektem stoi niezależna fundacja non-profit, co w tym świecie jest rzadkie i warto o tym wiedzieć, bo oznacza inny model rozwoju niż przy narzędziu jednego autora.

Pytanie, które pada tu najczęściej: czy OpenClaw to własny model językowy. Nie, to sama warstwa uruchomieniowa - model podpinacie przez wtyczkę, więc może to być Claude, może być coś lokalnego.

---

class: tight

## OpenClaw: gdzie trzyma pamięć

Pamięć nie leży w `~/.openclaw/` - to jest config i stan. Siedzi w **workspace agenta**:

```
~/.openclaw/workspace/           ← per agent, nie globalnie
├── AGENTS.md                    instrukcje, ładowane co sesję
├── MEMORY.md                    pamięć długoterminowa
├── USER.md                      profil użytkownika
├── DREAMS.md                    do przeglądu przez człowieka
└── memory/
    ├── YYYY-MM-DD.md            notatki dzienne
    └── imports/{codex,claude-code}/
```

Czysty markdown, bez frontmattera. Zalecenie z dokumentacji: **trzymać workspace w prywatnym repo gita**.

**Czyta cudzą pamięć**: import z `~/.codex/memories` i `~/.claude/projects/*/memory`. Kopia jednorazowa do `memory/imports/` - indeksowana do wyszukiwania, ale nigdy scalana z `MEMORY.md`.

(memspec robi to w drugą stronę przez `import-openclaw`, więc oba narzędzia sięgają po cudze pliki.)

???
Pierwsza rzecz, która potrafi zmylić: katalog `~/.openclaw` to nie jest pamięć. Tam siedzi konfiguracja, poświadczenia i sesje. Pamięć jest w workspace i dokumentacja wprost mówi, żeby traktować go jak pamięć i trzymać prywatnie.

Struktura powinna wam wyglądać znajomo po częściach zerowej i drugiej. `AGENTS.md` to ten sam wspólny standard co u konkurencji. `MEMORY.md` to kurowana warstwa ładowana na starcie. Notatki dzienne z datą w nazwie to w zasadzie to samo, co obserwacje w memspec, tylko bez wymuszonego terminu ważności.

Warstwa `DREAMS.md` to odpowiednik dream passa z memspec, ale uwaga - w pierwszej wersji tej prezentacji mówiłem tu, że oba projekty doszły do tego samego wniosku, i to było nieprawdziwe. Sprawdziłem dokumentację i jest dokładnie odwrotnie: to jest ciekawszy kontrast.

memspec zostawia propozycje i czeka na człowieka, kasowanie idzie wyłącznie przez operatorski `sweep`. OpenClaw promuje sam - dokumentacja mówi wprost, że do długoterminowej pamięci trafiają pozycje, które przeszły progi oceny, częstotliwości przypomnień i różnorodności zapytań, a `MEMORY.md` jest zapisywany właśnie tą głęboką promocją. `DREAMS.md` to dziennik do wglądu OBOK tej promocji, nie zamiast niej.

Czyli dwa różne zakłady o to, komu zaufać. memspec zakłada, że ostatnie słowo ma człowiek. OpenClaw zakłada, że przy odpowiednio ostrych progach maszyna poradzi sobie sama, a wy co najwyżej przeczytacie dziennik.

Ostatni akapit jest najciekawszy, bo to jedyne miejsce w całej prezentacji, gdzie jedno narzędzie sięga po pamięć drugiego. OpenClaw potrafi zaciągnąć wasze pliki z Codexa i z Claude Code. Ale to jest kopia, wykonana raz, wylądowana w osobnym katalogu. Nie ma tu żywej synchronizacji - jak dopiszecie coś w Claude Code, OpenClaw tego nie zobaczy, dopóki nie zrobicie importu jeszcze raz.

Ciekawostka na koniec, którą wyłapałem w kodzie. memspec ma komendę importującą pamięć z OpenClaw i ona działa, ale tylko w części: rozpoznaje workspace po trzech ścieżkach, z czego realnie obsługuje `MEMORY.md`, a `observations.md` i katalog `procedures` to format, którego OpenClaw dzisiaj nie produkuje. Wniosek praktyczny: integracje między młodymi projektami bywają częściowe, więc zanim się na nich oprzecie, sprawdźcie, ile danych faktycznie przyjechało.

---

## OpenClaw: lista funkcji

- **Ponad 30 kanałów**: Discord, Slack, Teams, Google Chat, Signal, iMessage, WhatsApp, Telegram - Telegram i WebChat bez instalowania czegokolwiek, reszta jako pluginy
- **Aplikacje natywne**: macOS, iOS, Android, Windows, Linux
- **Gateway** - jedna instancja obsługuje wszystkie skonfigurowane kanały naraz
- **Wtyczki modeli** - Claude, modele lokalne; brak przywiązania do jednego dostawcy
- **Bez usługi hostowanej i bez opłat za samo OpenClaw** - gateway stoi u Ciebie, za model płacisz osobno (albo uruchamiasz lokalny)
- **Telemetria opcjonalna** - domyślnie tylko dzienne sprawdzenie wersji, da się wyłączyć
- **Nody** - urządzenia i środowiska uruchomieniowe podpięte do gatewaya (telefon, kontener, druga maszyna)

Claude Code wchodzi tu jako **jeden z możliwych agentów**, uruchamiany przez plugin - np. w kontenerze Podman/Docker albo jako zarządzana sesja w tle sterowana z Telegrama czy Discorda.

<div class="terminal-demo">Terminal - pokaż: konfigurację gatewaya i przykład uruchomienia agenta w tle</div>

???
Trzydzieści kanałów brzmi jak liczba z ulotki marketingowej, ale w praktyce prawie nikt nie konfiguruje więcej niż dwa. Sens polega na tym, że wybieracie ten, w którym i tak spędzacie dzień - u większości z was to będzie Slack albo Telegram.

Celowo nie podaję dokładnej liczby, bo dokumentacja też jej nie podaje - lista jest generowana z katalogu pluginów i rośnie między wydaniami. Praktyczniejszy jest podział z drugiej połowy tego punktu: Telegram i WebChat działają od razu, wszystko inne to doinstalowanie pluginu.

Najbardziej konkretny scenariusz, jaki znam: siedzicie w tramwaju, przychodzi zgłoszenie, piszecie do bota na Telegramie, żeby sprawdził logi i zaproponował poprawkę. Agent działa w kontenerze na waszej maszynie, a wy tylko czytacie odpowiedź na telefonie.

Zwróćcie uwagę na punkt o braku usługi hostowanej. Cały ruch idzie przez wasz gateway, na waszym sprzęcie - nie ma pośrednika, do którego wysyłacie kod.

Ale muszę tu postawić uczciwe zastrzeżenie, bo to zdanie łatwo przeciągnąć za daleko i ktoś z bezpieczeństwa to sprawdzi. Brak pośrednika nie znaczy, że nic nie wychodzi na zewnątrz. Jeżeli model siedzi u dostawcy, to kod idzie do dostawcy modelu - tyle że bezpośrednio, a nie przez czyjś serwer po drodze. Dopiero model uruchomiony lokalnie zamyka to w całości.

Nody to pojęcie, które łatwo przeoczyć, a jest praktyczne: gateway stoi w jednym miejscu, a wykonanie może się dziać na zupełnie innej maszynie. Domowy serwer pracuje, laptop może być zamknięty.

---

## OpenClaw: kiedy ma sens

**Ma sens, gdy**
- Chcesz odpalać agenta z telefonu, z czatu, spoza terminala
- Potrzebujesz jednego wejścia do wielu agentów i modeli
- Zależy Ci, żeby nic nie wychodziło poza Twoją maszynę

**Nie ma sensu, gdy**
- Pracujesz wyłącznie w terminalu i IDE - gateway to wtedy czysty narzut
- Nie chcesz utrzymywać kolejnej usługi działającej w tle

**Uwaga o nazewnictwie.** Wokół OpenClaw narosło sporo repozytoriów o mylących nazwach - `claudeclaw`, `openclaw-claude-code`, `openclaw-plugin-claude-code`, tutoriale nazywające Claude Code "OpenCLAW". To osobne projekty różnych autorów. Przed instalacją czegokolwiek: sprawdź autora.

???
Jeżeli wasz dzień wygląda tak, że rano otwieracie terminal i zamykacie go wieczorem, to OpenClaw nie zmieni wam nic poza tym, że dojdzie jeden proces w tle do pilnowania. Mówię to jako ktoś, kto tak właśnie pracuje.

Punkt o tym, że nic nie wychodzi poza maszynę, brzmi jak hasło, ale ma bardzo praktyczną konsekwencję. Jeżeli wystawiacie gateway tak, żeby dało się do niego pisać z telefonu spoza domu, to odpowiedzialność za zabezpieczenie tego wejścia jest po waszej stronie. Nikt tego za was nie zrobi.

Akapit o nazewnictwie potraktujcie poważnie, bo to realne ryzyko. Wpisujecie w wyszukiwarkę OpenClaw i Claude Code, a wyniki to w dużej części repozytoria przypadkowych osób z bardzo podobnymi nazwami. Instalujecie wtedy kod, który dostaje dostęp do waszych kluczy i katalogów.

Minimum, jakie sobie narzucam przed instalacją czegokolwiek z tego kręgu: sprawdzam autora, datę ostatniego commita i czy projekt jest linkowany ze strony fundacji. Trzy rzeczy, minuta roboty.

---

class: center, middle, section

# Część 4

## Gdzie to wszystko ląduje na dysku

???
Widzieliście już trzy narzędzia osobno. Ta część kładzie je obok siebie na dysku i odpowiada na pytanie, które pada przy pierwszej awarii: gdzie to wszystko właściwie jest.

Będzie krótko - jedna mapa katalogów i dwa podsumowania warstw pamięci. Szczegóły katalogu Claude Code omówiliśmy już w części zerowej, więc tu interesuje nas głównie to, co dokładają Superpowers, memspec i OpenClaw.

Jeżeli macie przy sobie laptopa, warto otworzyć swój katalog domowy i porównywać na bieżąco.

---

class: tight

## Mapa plików: trzy narzędzia

.cols[
.col[
**Superpowers** - katalog domowy

```
~/.claude/
├── CLAUDE.md          instrukcje
├── MEMORY.md          pamięć
├── settings.json      hooki
├── skills/            Twoje skille
├── plugins/        ← Superpowers
│   ├── cache/…/6.3.0/
│   └── marketplaces/
└── projects/       ← transkrypty
```

**memspec** - w repozytorium

```
<projekt>/.memspec/    magazyn
<projekt>/.mcp.json    podpięcie
~/.memspec/            warstwa globalna
```
]
.col[
**OpenClaw** - osobny proces

```
~/.openclaw/
├── openclaw.json      config
├── agents/            per agent
└── workspace/      ← pamięć
    ├── AGENTS.md
    ├── MEMORY.md
    ├── USER.md
    ├── DREAMS.md
    └── memory/
        ├── YYYY-MM-DD.md
        └── imports/
```

Workspace idzie do .u[osobnego, prywatnego] repo.
]
]

Zasada: **Superpowers instaluje się globalnie, memspec żyje w repo z kodem, OpenClaw ma własny katalog obok.**

<div class="terminal-demo">Terminal - pokaż: <code>ls ~/.claude</code>, <code>find ~/.claude -maxdepth 2</code> i trzy przestrzenie danych</div>

???
Ta mapa odpowiada na pytanie, które pada zawsze przy pierwszej awarii: gdzie to w ogóle jest. Bez niej ludzie szukają konfiguracji agenta w katalogu projektu, a ona siedzi w katalogu domowym i na odwrót.

Zwróćcie uwagę na jedną asymetrię. Wszystko, co dotyczy Claude Code i Superpowers, jest w katalogu domowym, czyli tylko wasze i nie do podzielenia się z zespołem. memspec jako jedyny siedzi w repozytorium, więc jedzie razem z kodem i wchodzi do review.

To ma bezpośrednie przełożenie na backup. Jak przesiadacie się na nową maszynę, to katalog projektu przenosi się sam przez gita, a wszystko z tilde trzeba przenieść świadomie albo stracicie.

Mała pułapka, którą warto znać: katalog `plugins/cache` puchnie przy każdej aktualizacji, bo stare wersje zostają. To zwykle nie są duże liczby, ale nikt tego nie sprząta za was.

---

## Trzy warstwy pamięci: gdzie co zapisać

.diagram[![Trzy warstwy pamięci](assets/pamiec.svg)]

Najczęstszy błąd: wrzucanie faktów o jednym repozytorium do pamięci globalnej. Rośnie wtedy koszt **każdej** sesji - także tych, które z tym repo nie mają nic wspólnego.

???
Pytanie, które warto sobie zadawać przy każdym zapisie, jest jedno: ile sesji na tym skorzysta. Jeżeli odpowiedź brzmi "tylko te w jednym repozytorium", a wpis ląduje globalnie, to płacicie za niego wszędzie, a korzystacie w jednym miejscu.

Mechanika tego kosztu jest bezlitosna, bo to mnożenie. Wpis wart dwieście tokenów, przy dwudziestu sesjach dziennie, daje cztery tysiące tokenów dziennie za jeden fakt, który przydaje się raz na tydzień.

Na tym slajdzie kończę część o samej pamięci, więc jedno zdanie podsumowania: zanim sięgniecie po memspec, warto sprawdzić, czy problem nie polega po prostu na tym, że wszystko wrzucacie do jednego worka.

Bardzo często porządek w tych trzech warstwach załatwia osiemdziesiąt procent sprawy bez instalowania czegokolwiek.

---

## Pamięć: trzy rozwiązania obok siebie

.big-table[
| Cecha              | `~/.claude/MEMORY.md` | `~/.claude/projects/…/memory/` | memspec        |
| ------------------ | --------------------- | ---------------------- | --------------------- |
| Zasięg             | globalny              | jeden projekt          | projekt + globalny    |
| W repozytorium     | nie                   | nie                    | **tak**               |
| Data ważności      | nie                   | nie                    | **tak** (TTL)         |
| Kotwica do kodu    | nie                   | nie                    | **tak** (SHA blobu)   |
| Cykl życia         | ręczny                | ręczny                 | **active → retired**  |
| Wyszukiwanie       | czytanie całości      | indeks + doczytywanie  | **FTS5 / BM25**       |
| Rozdział ról       | nie                   | nie                    | **operator / agent**  |
]

Pamięć Claude Code jest **prostsza i działa od razu**. memspec jest **dokładniejszy i kosztuje dyscyplinę**.

???
Dwa wiersze z tej tabeli decydują o wszystkim, reszta to szczegóły. Data ważności i kotwica do kodu - tylko memspec je ma i tylko dlatego ma sens jako osobne narzędzie.

Wiersz o wyszukiwaniu pokazuje, gdzie prosta pamięć się kończy. Przy pięćdziesięciu faktach czytanie całości jest tanie i działa. Przy pięciuset płacicie za każdy fakt w każdej sesji, niezależnie od tego, czy jest potrzebny.

Wiersz o rozdziale ról bywa lekceważony, a w praktyce dotyka realnego problemu. Jeżeli agent sam pisze do pamięci, to potrafi nadpisać wasze ustalenie własnym wnioskiem z jednej sesji, w której coś źle zrozumiał.

Moja praktyczna rada: zacznijcie od wbudowanej pamięci, bo jest za darmo i już ją macie. Po memspec sięgnijcie dopiero wtedy, kiedy pierwszy raz złapiecie agenta na działaniu według faktu, który przestał być prawdziwy trzy miesiące temu.

Ten moment zwykle przychodzi sam i jest dość bolesny, żeby go rozpoznać.

---

class: center, middle, section

# Część 5

## Zestawienie

???
Zostało nam kwadrans, więc resztę robimy szybciej i bardziej praktycznie niż poprzednie części.

Przez ostatnią godzinę pokazywałem te trzy narzędzia osobno. Teraz postawię je obok siebie i spróbuję odpowiedzieć na pytanie, od którego zacząłem: co z tego wybrać.

Uprzedzam, że odpowiedź brzmi "to zależy", ale pokażę wam, od czego dokładnie zależy.

---

## Porównanie: podstawy

.big-table[
| | **Superpowers** | **memspec** | **OpenClaw** |
| --- | --- | --- | --- |
| Kategoria | plugin / skille | CLI + MCP | samodzielny runtime |
| Instalacja | `/plugin install` | `npm i -g memspec` | osobna aplikacja |
| Warstwa | metodologia | pamięć | transport / kanały |
| Dane w | `~/.claude/plugins/` | `.memspec/` w repo | `~/.openclaw/workspace/` |
| W gicie | sam plugin nie, ale plany tak | **tak, cały magazyn** | osobne, prywatne repo |
| Zależy od Claude Code | nie (wiele agentów) | nie (MCP) | nie (wielu dostawców) |
| Licencja / model | open source | open source | open source, fundacja |
]

???
Wiersz, na którym zatrzymam się najdłużej, to ten o gicie, bo w pierwszej wersji miałem tam proste "nie, tak, nie" i to było nieuczciwe wobec dwóch narzędzi.

memspec faktycznie trzyma w repozytorium CAŁY swój magazyn - każdy fakt jedzie z kodem i wchodzi do review. Ale Superpowers też coś tam zostawia: plany z `writing-plans` lądują w `docs/superpowers/plans/`, czyli w waszym repo i w pull requeście. Sam plugin siedzi w katalogu domowym, plany nie. A OpenClaw ma to jeszcze inaczej - dokumentacja wprost zaleca, żeby workspace z pamięcią trzymać w PRYWATNYM repozytorium gita, tylko że osobnym, nie tym z kodem.

Czyli właściwe pytanie nie brzmi "czy w gicie", tylko "w czyim gicie i kto to zobaczy". Magazyn memspec widzi cały zespół na review. Prywatne repo OpenClaw widzicie tylko wy.

Wiersz o zależności od Claude Code też warto przeczytać uważnie, bo wszędzie jest "nie". Żadne z tych trzech narzędzi nie zamyka was u jednego dostawcy - Superpowers to markdown, memspec gada przez MCP, OpenClaw ma wtyczki modeli. To nie jest oczywiste w tym świecie i dlatego wszystkie trzy wybrałem do tej prezentacji.

Zwróćcie uwagę na wiersz z instalacją, bo on mówi coś o nakładzie pracy. Superpowers to jedna komenda i zapominacie o temacie. memspec to komenda plus decyzja, co i kiedy zapisujecie. OpenClaw to osobna usługa, którą ktoś musi utrzymywać w działaniu.

Pytanie, które w tym miejscu zwykle pada: czy któreś z nich coś kosztuje. Nie, wszystkie trzy są open source i nie mają hostowanej usługi z abonamentem. Płacicie wyłącznie za model, którego i tak używacie.

---

## Porównanie: feature po feature

Kolumna **CC** to samo Claude Code, bez żadnego dodatku - punkt odniesienia.

.big-table.dense-table[
| Funkcja | CC | SP | MS | OC |
| --- | :-: | :-: | :-: | :-: |
| Wymusza proces pracy (TDD, plan, review) | — | .y[✔] | — | — |
| Skille wyzwalane kontekstem | .y[✔] | .y[✔] | — | — |
| Subagenci / praca równoległa | .y[✔] | .y[✔] | — | — |
| Hook na starcie sesji | .y[✔] | .y[✔] | .y[✔] | — |
| Stan zadania przeżywa `/clear` (plan, ledger) | — | .y[✔] | — | — |
| Gromadzi wiedzę o projekcie | .y[✔] | — | .y[✔] | .y[✔] |
| TTL i wygasanie wiedzy | — | — | .y[✔] | — |
| Kotwiczenie w kodzie (SHA) | — | — | .y[✔] | — |
| Wyszukiwanie pełnotekstowe | — | — | .y[✔] | — |
| Serwer MCP | klient | — | .y[✔] | .y[✔] |
| Kanały czatowe (Slack, Telegram...) | — | — | — | .y[✔] |
| Aplikacje mobilne / natywne | — | — | — | .y[✔] |
| Wielu dostawców modeli | — | — | — | .y[✔] |
| Sama warstwa działa lokalnie, bez sieci | — | .y[✔] | .y[✔] | .y[✔] |
]

Stąd wniosek: **żadne z trzech nie jest warunkiem koniecznym**. Pamięć i skille Claude Code ma sam z siebie - pozostałe narzędzia dokładają to, czego mu brakuje.

???
Kolumnę CC dodałem po tym, jak pierwsza wersja tej tabeli wprowadziła w błąd mojego kolegę. Bez punktu odniesienia wychodzi z tego obrazek, w którym samo Claude Code nie potrafi nic, a to nieprawda - ma własne skille, własne subagenty i własną pamięć. Zanim coś doinstalujecie, warto wiedzieć, co już macie.

Dwa wiersze o pamięci rozbiłem świadomie, bo w pierwszej wersji tej tabeli był jeden i wprowadzał w błąd. Superpowers miało tam kreskę, a to nieprawda: plan i ledger to pliki, które przeżywają `/clear` i kompakcję. Tylko że przeżywają na czas zadania - kiedy ono się kończy, nic z tego nie staje się wiedzą o projekcie. Stąd ptaszek w pierwszym wierszu i kreska w drugim.

I zwróćcie uwagę, że te dwa wiersze są wobec siebie odwrotne. Superpowers pilnuje, gdzie jesteście w zadaniu, ale nie pamięta niczego o projekcie. Pozostała trójka pamięta fakty o projekcie, ale żadne z nich nie prowadzi ledgera niedokończonej roboty - memspec ma obserwacje z terminem ważności, co jest czymś innym niż mapa postępu. To są dwie różne rzeczy nazywane tym samym słowem i dlatego jeden wiersz musiał się rozpaść na dwa.

Zwróćcie uwagę na trzy wiersze w środku, te o TTL, kotwiczeniu i wyszukiwaniu. To jedyne miejsce w całej tabeli, gdzie memspec stoi sam, i to jest cała odpowiedź na pytanie, po co on w ogóle istnieje. Jeżeli te trzy rzeczy was nie bolą, memspec nie ma wam czego zaoferować.

Wiersz o pracy bez sieci bywa zaskoczeniem, bo przy Claude Code jest tam kreska. To nie jest przytyk, tylko fakt: model siedzi po drugiej stronie łącza. Ale same warstwy dookoła są lokalne, więc jak macie model uruchomiony u siebie przez OpenClaw, cały stos działa offline.

Pytanie, które często tu dostaję: skąd przy MCP wzięło się "klient" w kolumnie Claude Code. Stąd, że Claude Code sam nie jest serwerem MCP, tylko podłącza się do cudzych. To ważne przy planowaniu, bo znaczy, że musicie mieć co podłączać.

OpenClaw ma w tym wierszu ptaszka, bo potrafi obie rzeczy: podłącza cudze serwery jak każdy klient, a komenda `openclaw mcp serve` uruchamia własny serwer, który wystawia rozmowy z kanałów na zewnątrz. Czyli inny agent może czytać wasz Slack przez MCP.

Najważniejsze zdanie jest pod tabelą i chcę je powiedzieć głośno: żadne z tych trzech narzędzi nie jest warunkiem koniecznym, żeby sensownie pracować z agentem.

---

## Co z czym się łączy

.diagram[![Trzy warstwy: OpenClaw, Superpowers, memspec](assets/warstwy.svg)]

Konflikty są **dwa**. Budżet kontekstu: `memory/`, `MEMORY.md`, `memspec context` i hook Superpowers ładują się naraz. Oraz cichszy - **ta sama wiedza w dwóch magazynach potrafi się rozjechać**.

???
Ten schemat czyta się od dołu do góry albo od zewnątrz do środka, jak wam wygodniej. OpenClaw jest kanałem, przez który w ogóle docieracie do agenta. Superpowers siedzi w środku i pilnuje, jak on pracuje. memspec podaje mu, co już wiadomo o tym projekcie. Każda z tych warstw da się wyjąć osobno i reszta dalej działa.

Konflikty są dwa i to ważne rozróżnienie, bo pierwszy jest problemem kosztu, a drugi poprawności. Wszystko, co ma hook na starcie sesji, ładuje się w tej samej chwili do tego samego kontekstu, i żadne z tych narzędzi nie wie o pozostałych. Nikt tego za was nie koordynuje.

Drugi konflikt wyszedł mi z własnej wpadki, o której za chwilę. Jak ten sam fakt siedzi w dwóch magazynach, to prędzej czy później poprawicie go w jednym i zapomnicie o drugim. Wtedy agent dostaje dwie wersje prawdy naraz i nic mu nie mówi, która jest świeższa.

Policzmy na przykładzie, bo inaczej to brzmi abstrakcyjnie. Globalny `MEMORY.md`, indeks pamięci projektu, skill `using-superpowers`, `memspec context` i wasz `CLAUDE.md` - pięć źródeł, z których tylko dwa mają realny sufit, a żadne nie wie o pozostałych.

Mam z tego własną wpadkę: przez jakiś czas miałem podpięty i wbudowany hook pamięci, i `memspec context`, i dopiero po tygodniu zauważyłem, że część faktów dostaję dwa razy w tej samej sesji. Nic się nie psuło, tylko płaciłem podwójnie.

Praktyczna rada: jak włączacie drugie źródło pamięci, wyłączcie albo przytnijcie pierwsze. Nie zakładajcie, że sobie to jakoś ułożą.

---

## Koszt kontekstu na starcie sesji

Co ląduje w kontekście, zanim napiszesz pierwsze słowo:

.big-table[
| Źródło                          | Ile mniej więcej                     | Sufit             |
| ------------------------------- | ------------------------------------ | ----------------- |
| `~/.claude/CLAUDE.md`           | zależy od Ciebie                     | 4 MiB, potem pomijany |
| `~/.claude/MEMORY.md`           | u mnie 180 KB, ~46 tys. tokenów      | _brak_            |
| `~/.claude/projects/…/memory/MEMORY.md` | indeks, linia na pamięć      | **200 linii / 25 KB** |
| Hook Superpowers                | 3 KB (`using-superpowers`)           | _brak_            |
| `memspec context`               | budżetowane                          | **`max_tokens`**  |
]

Twardy budżet mają **dwa** źródła: auto memory i memspec. Bez sufitu rośnie to, co piszecie ręcznie.

Praktyczny wniosek: `MEMORY.md` trzymać jako **indeks z jednolinijkowymi hookami**, nigdy jako miejsce na treść.

???
W drugiej kolumnie celowo nie ma liczb i chcę to wytłumaczyć. Wpisałbym tam swoje, a u was wyszłoby coś zupełnie innego, bo to zależy od tego, ile sami napisaliście. Ważniejsze od konkretnej liczby jest to, że tylko jeden wiersz z pięciu ma jakikolwiek sufit.

Sprawdzenie tego u siebie zajmuje minutę: `wc -c` na pliku i dzielicie przez cztery, to daje przyzwoite oszacowanie liczby tokenów. Jak wyjdzie wam kilka tysięcy, to znaczy, że każde pytanie o literówkę zaczyna się od przeczytania całej waszej biografii.

Wniosek pod tabelą jest tym, co sam stosuję. `MEMORY.md` ma być indeksem, a nie miejscem na treść - jedna linia na fakt, wystarczająco opisowa, żeby agent wiedział, czy warto sięgnąć głębiej. Dokładnie ten sam trik stosują Superpowers ze swoimi skillami i wbudowana pamięć Claude Code.

I uczciwie przyznam się do niespójności: mój własny globalny plik ma pewne wpisy długie na pół ekranu, bo w tamtym momencie wydawało mi się, że każde słowo jest ważne. Jest na liście rzeczy do przepisania i wisi tam już drugi miesiąc.

Jeżeli mielibyście zrobić po tej prezentacji jedną rzecz, to właśnie tę: zajrzeć do swojego globalnego pliku z pamięcią i wyrzucić z niego wszystko, co nie jest już prawdą.

---

class: tight

## Jak sprawdzić, ile kontekstu zjadasz

.big-table[
| | Jak | Co zobaczysz |
| --- | --- | --- |
| **Claude Code** | `/context` | siatka z **rozbiciem**: prompt systemowy, narzędzia, pamięć, wiadomości |
| **Codex** | `/status` | model, katalog, procent zużycia - .u[bez rozbicia na źródła] |
| **Cursor** | wskaźnik w czacie | procent okna; .u[brak komendy], wskaźnik zmieniał miejsce między wersjami |
]

Tylko Claude Code odpowie na pytanie **„co konkretnie to zajmuje"** - a bez tego nie wiadomo, czy winna jest pamięć, czy definicje narzędzi.

Szybki szacunek dla dowolnego pliku, bez żadnego narzędzia:

```bash
$ wc -c ~/.claude/MEMORY.md     # bajty ÷ 4 ≈ tokeny
  184520
```

???
Przez całą tę prezentację straszę was kosztem kontekstu, więc wypada pokazać, jak go w ogóle zobaczyć. Bo dopóki nie zmierzycie, to są tylko moje opowieści.

W Claude Code jest komenda `/context` i to jest jedyne z trzech narzędzi, które daje prawdziwą odpowiedź. Rysuje siatkę i rozbija zajęte tokeny na kategorie: ile idzie na prompt systemowy, ile na definicje narzędzi i MCP, ile na pliki pamięci, ile na samą rozmowę. To rozbicie jest sednem, bo dopiero ono mówi, co zmienić. Jak widzicie, że połowę zjadają definicje narzędzi, to nie ma sensu skracać `MEMORY.md`.

W Codeksie jest `/status`, ale pokazuje mniej: model, katalog roboczy i procent zużycia. Dowiecie się, że jest ciasno, nie dowiecie się dlaczego. W repozytorium wiszą zresztą zgłoszenia z prośbą o pełniejsze dane, więc to może się zmienić.

W Cursorze nie ma komendy - jest wskaźnik procentowy w oknie czatu. Uprzedzam, bo sam się na to nabrałem przy przygotowaniach: ten wskaźnik w kolejnych wersjach zmieniał miejsce, a czasem znikał, i na forum są całe wątki ludzi szukających, gdzie się podział. Jeżeli go nie widzicie, to niekoniecznie wasza wina.

Ostatnia komenda działa wszędzie i nie wymaga żadnego narzędzia. Liczba bajtów podzielona przez cztery to przyzwoite przybliżenie liczby tokenów. Dla polskiego tekstu wyjdzie trochę więcej niż w rzeczywistości, bo polskie znaki zajmują po dwa bajty, ale jako rząd wielkości wystarcza.

Zróbcie to u siebie na swoim globalnym pliku pamięci, zanim wyjdziecie z sali. U mnie wyszło sto osiemdziesiąt kilobajtów, czyli około czterdziestu sześciu tysięcy tokenów w każdej sesji - i szczerze mówiąc, tego się nie spodziewałem, dopóki nie sprawdziłem.

---

## Kiedy co ma sens

**Sam Superpowers** - pracujesz w terminalu, chcesz uporządkowanego procesu, pamięć załatwia wbudowane `memory/`.

**Sam memspec** - projekt długi, wiedza się starzeje, zależy Ci na tym, żeby ustalenia były w repo i w review.

**Sam OpenClaw** - chcesz odpalać agenta spoza komputera, z czatu albo telefonu.

**Superpowers + memspec** - najczęstsze połączenie. Proces z jednego, pamięć z drugiego, nie zachodzą na siebie poza budżetem kontekstu.

**Wszystkie trzy** - agent z procesem i pamięcią, odpalany z dowolnego miejsca. Cena: trzy niezależne rzeczy do utrzymania i aktualizowania.

Świadomym wyborem jest też **żadne z nich**: `CLAUDE.md` plus dobre nawyki wystarczają w wielu projektach.

???
Powiem, co sam mam włączone, bo to chyba uczciwsze niż abstrakcyjne "to zależy". Na stałe chodzi u mnie Superpowers i wbudowana pamięć Claude Code z globalnym plikiem podpiętym symlinkiem do dotfiles. To jest cały mój zestaw i siedzę na nim od kilku miesięcy.

memspec testowałem i w tej chwili go nie używam na co dzień, ale nie dlatego, że jest słaby. Odbiłem się od niego przy pierwszym podejściu, bo wdrożyłem go do małego projektu, gdzie nie było czego pamiętać - magazyn stał pusty i zostało mi samo poczucie winy. Po miesiącu wrócę do tego w jednym długim projekcie, gdzie wiedza faktycznie się starzeje, i tam spodziewam się, że się zwróci.

OpenClaw odpuściłem świadomie i to jest miejsce, w którym moja rekomendacja się kończy, bo po prostu nie pracuję z telefonu. Jeżeli ktoś z was ma dyżury albo dużo pracy w ruchu, jego ocena będzie inna niż moja i będzie tak samo słuszna.

Pomyliłem się przy Superpowers w jednym: przez pierwsze dwa tygodnie walczyłem z tym, że agent chce robić brainstorming przy każdej drobnostce, i prawie to odinstalowałem. Rozwiązanie okazało się banalne - wystarczy powiedzieć "to drobiazg, zrób od razu" i problem znika. Straciłem dwa tygodnie na irytację zamiast na jedno zdanie.

Ostatnią linijkę na slajdzie traktujcie jak pełnoprawną odpowiedź, a nie jak żart. Obiecałem to na pierwszym slajdzie i podtrzymuję: dobrze napisany `CLAUDE.md` plus nawyk mówienia agentowi, żeby najpierw pokazał plan, załatwiają większość tego, co dają dwie pierwsze warstwy.

Moja kolejność dla kogoś, kto zaczyna dzisiaj: najpierw uporządkujcie `CLAUDE.md`, potem Superpowers, bo to jedna komenda i nic nie psuje. Po memspec sięgajcie dopiero wtedy, gdy realnie złapiecie agenta na działaniu według nieaktualnego faktu.

---

class: center, middle, title

# Dzięki

.sources[
**Źródła**

- AGENTS.md · https://agents.md
- Superpowers · https://claude.com/plugins/superpowers
- memspec · https://github.com/siimvene/memspec
- OpenClaw · https://openclaw.ai/
]

.callout[Dane o ścieżkach i liczbach zmierzone lokalnie 2026-09-21]

???
Jedna rzecz, którą chciałbym, żebyście stąd wynieśli: zanim wybierzecie narzędzie, nazwijcie problem. Proces, pamięć czy dostęp - to trzy różne bóle i żadne z tych trzech narzędzi nie leczy dwóch naraz.

Slajdy razem ze schematami wrzucam na naszego firmowego gita zaraz po warsztacie, więc nie musicie nic przepisywać. Wszystkie trzy adresy z tego slajdu prowadzą do oficjalnych źródeł, nie do przypadkowych forków - to ważne zwłaszcza przy OpenClaw.

Liczby i ścieżki, które pokazywałem, zmierzyłem u siebie dwudziestego pierwszego września, więc traktujcie je jako rząd wielkości, a nie jako stałą. U was wyjdą inne i to jest w porządku.

Dzięki za uwagę. Jak coś wam nie zadziała po powrocie do biurka, piszcie - najchętniej z konkretnym komunikatem błędu, bo większość problemów z tej trójki to jedna źle ustawiona ścieżka.
