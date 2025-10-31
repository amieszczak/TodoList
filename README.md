# Opis zadania

Masz przed sobą działającą, lecz celowo nieestetyczną aplikację do zarządzania listą wydarzeń (todos). Twoim zadaniem jest poprawa wyglądu i funkcjonalności aplikacji przy użyciu Angular, Bootstrap 5 i SCSS.
## Zakres prac

1. Refaktoryzacja UI
   * popraw wygląd listy zadań,
   * zadbaj o estetykę, czytelność, spójność stylów oraz responsywność,
   * usuń niepotrzebne lub błędne style, popraw klasy Bootstrap,
   * popracuj nad rozwijaniem opisu
   
2. Dodaj filtry, które dynamicznie przefiltrują listę wydarzeń. Filtruj według:
   * nazwy wydarzenia, -
   * daty, -
   * statusu. -
   
3. Dodaj formularz dodawania nowego zadania (modal)
   * zadbaj o jego wygląd, 
   * dodaj walidację formularza (nazwa i data wymagane, data nie może być przeszła), -
   * po zapisaniu formularza zadanie powinno pojawić się na liście. -
4. (Opcjonalnie) Jeśli masz czas, to podziel aplikację na mniejsze komponenty 


## Jak uruchomić

```bash
npm install
```

```bash
npm run start
```

Projekt został stworzony za pomocą narzędzi z następującymi wersjami:

> node v22.14.0

> Angular CLI 19.2.0

## Dostarczenie rozwiązania

Spakuj projekt jako .zip lub prześlij link do repozytorium na GitHubie.

## Zrobiono

### 1. Refaktoryzacja UI
   
   - poprawiono wygląd listy zadań – dodano checkbox, czytelny układ elementów, statusy kolorami,
   - zadbano o estetykę i czytelność – dodano animacje, efekty hover, spójne kolory,
   - usunięto niepotrzebne style, poprawiono klasy Bootstrap,
   - rozwijanie opisu – dodano edytor z możliwością formatowania tekstu (pogrubienie, kursywa, podkreślenie, listy),
   - zadbano o responsywność – dostosowano interfejs do urządzeń mobilnych, tabletów i desktopów.

### 2. Dodaj filtry

   - filtrowanie według nazwy wydarzenia – pole wyszukiwania z dynamicznym filtrowaniem,
   - filtrowanie według daty – zakres dat od-do oraz sortowanie rosnąco/malejąco,
   - filtrowanie według statusu – możliwość wyboru: wszystkie, planned, completed,
   - dodano przycisk czyszczenia filtrów.

### 3. Dodaj formularz dodawania nowego zadania

   - zadbano o wygląd – responsywny modal z przejrzystym układem,
   - dodano walidację formularza – nazwa i data wymagane, data nie może być przeszła,
   - po zapisaniu formularza zadanie pojawia się na liście,
   - dodano możliwość edycji istniejących zadań,
   - dodano obsługę tagów.

### 4. Podział aplikacji na mniejsze komponenty

   - stworzono osobne komponenty: lista zadań, pojedynczy element zadania, modal, panel filtrów, pasek wyszukiwania, nagłówek,
   - stworzono komponenty ikon,
   - dodano serwis do zarządzania danymi.

### 5. Dodatkowe funkcjonalności

   - zapisywanie zadań w IndexedDB – dane pozostają po odświeżeniu strony,
   - system tagów – możliwość dodawania i usuwania tagów do zadań,
   - oznaczanie zadań flagą,
   - edytowalny tytuł strony,
   - menu kontekstowe z opcjami edycji i usuwania,
   - animacje i płynne przejścia.

