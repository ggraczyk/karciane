# Gry Karciane

Aplikacja webowa do obliczania wyników gier karcianych – bryd¿a i kanasty – zbudowana na Internet Computer (ICP). Backend w Motoko przechowuje surowe dane gry na blockchainie, a frontend w SvelteKit oblicza wyniki lokalnie, co minimalizuje zu¿ycie cykli obliczeniowych na ICP. Ka¿dy u¿ytkownik otrzymuje unikalny PIN zapisywany w ciasteczkach, umo¿liwiaj¹cy trwa³e przechowywanie stanu gry.

## Funkcjonalnoœci
- **Bryd¿:** Punktacja sportowa (punkty czêœciowe, premie, kary) obliczana na podstawie kontraktu, lew, koloru i vulnerabilnoœci – wszystko po stronie klienta.
- **Kanasta:** Pe³na punktacja gry (kanasty, czerwone trójki, meldunki) obliczana lokalnie w przegl¹darce.
- **PIN-y:** Unikalny identyfikator gry zapisywany w ciasteczkach, powi¹zany z danymi na blockchainie.
- **Interfejs:** Spójny i prosty UI dla obu gier, z dynamicznym obliczaniem wyniku w formularzach.

## Wymagania
- Node.js (v16+)
- DFINITY Canister SDK (`dfx`) – do pracy z ICP
- Git

## Instalacja
1. **Sklonuj repozytorium:**
   ```bash
   git clone https://github.com/ggraczyk/karciane.git
   cd karcianedfx