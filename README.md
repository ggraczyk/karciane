# Gry Karciane

Aplikacja webowa do obliczania wyników gier karcianych – bryd¿a i kanasty – zbudowana na Internet Computer (ICP) z backendem w Motoko i frontendem w SvelteKit. U¿ytkownicy mog¹ zapisywaæ stan gry na blockchainie za pomoc¹ unikalnego PIN-u, a wyniki s¹ obliczane zgodnie z regu³ami sportowymi.

## Funkcjonalnoœci
- **Bryd¿:** Obliczanie punktacji sportowej (punkty czêœciowe, premie, kary) na podstawie kontraktu, lew, koloru i vulnerabilnoœci.
- **Kanasta:** Pe³na punktacja gry, w tym premie za kanasty, czerwone trójki i meldunki.
- **PIN-y:** Unikalny PIN dla ka¿dego u¿ytkownika, umo¿liwiaj¹cy prowadzeniu wielu gier jednoczeœnie.

## Wymagania
- Node.js (v16+)
- DFINITY Canister SDK (`dfx`) – do pracy z ICP
- Git

## Wdro¿enie
cd src/karciane_frontend
npm run build
cd ../..
dfx deploy --network ic

## weryfikacje i zatrzymywanie
dfx canister --network ic status karciane_backend
dfx canister --network ic status karciane_frontend

# zatrzymanie czasami wymaga powtórnej próby
dfx canister --network ic stop karciane_frontend
dfx canister --network ic stop karciane_backend

## powa¿ne deinstalacje (zmiana bibliotek) wymagaj¹ usuwanie poprzednich
dfx canister --network ic delete karciane_frontend
dfx canister --network ic delete karciane_backend


dfx wallet --network ic balance


ZamroŸ kanistry:
   ```bash
   dfx canister --network ic update-settings karciane_backend --freezing-threshold 2592000
   dfx canister --network ic update-settings karciane_frontend --freezing-threshold 2592000
   ```
   - Parametr `--freezing-threshold 2592000` ustawia próg zamro¿enia na 30 dni (w sekundach). Jeœli kanister nie bêdzie u¿ywany przez 30 dni, zostanie automatycznie zamro¿ony.
   - Zamro¿one kanistry nie zu¿ywaj¹ cykli na obliczenia, ale nadal zajmuj¹ pamiêæ, co mo¿e wi¹zaæ siê z minimalnymi op³atami.



SprawdŸ szczegó³y kanistra:
   ```bash
   dfx canister --network ic info karciane_backend
   ```
   To poka¿e informacje o kanistrze, w tym jego identyfikator i zu¿ycie cykli (jeœli kanister istnieje).


U¿yj polecenia `dfx wallet` do monitorowania:
   ```bash
   dfx wallet --network ic history



npm install vite@5.4.8 --save-dev
npm install @sveltejs/vite-plugin-svelte@3.1.2 --save-dev
npm install @sveltejs/kit@2.17.3 --save-dev
npm install -D @sveltejs/adapter-auto
npm install svelte@4.2.19 --save-dev
