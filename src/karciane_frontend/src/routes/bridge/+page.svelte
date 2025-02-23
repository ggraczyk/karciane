<script>
  import { Actor, HttpAgent } from '@dfinity/agent';
  import { idlFactory } from 'declarations/karciane_backend';
  import { onMount } from 'svelte';

  export let data;
  let pin = data.pin;
  let actor;
  let message = '';
  let gameData = null;
  let contract = 1;
  let tricks = 0;
  let suit = 'trefl';
  let beforeParty = false;
  let afterParty = false;
  let score = 0;

  onMount(async () => {
    const agent = new HttpAgent({ host: 'http://localhost:4943' });
    if (agent.isLocal()) { agent.fetchRootKey(); }
    actor = Actor.createActor(idlFactory, { agent, canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai' });
    await actor.addGame(pin, 'bridge');
    await fetchGameData();
  });

  async function fetchGameData() {
    const result = await actor.getGame(pin);
    if (result && 'Bridge' in result) {
      gameData = result.Bridge;
      contract = gameData.contract;
      tricks = gameData.tricks;
      suit = gameData.suit;
      beforeParty = gameData.beforeParty;
      afterParty = gameData.afterParty;
      calculateScore();
    }
  }

  async function updateGame() {
    message = await actor.updateBridgeGame(pin, contract, tricks, suit, beforeParty, afterParty);
    await fetchGameData();
  }

  function calculateScore() {
    const vulnerable = afterParty;
    const requiredTricks = 6 + contract;
    const trickValue = suit === 'trefl' ? 20 :
                       suit === 'karo' ? 20 :
                       suit === 'kier' ? 30 :
                       suit === 'pik' ? 30 :
                       suit === 'BA' ? 40 : 20;
    let pcScore = suit === 'BA' && tricks > 6 ? 40 + (tricks - 6 - 1) * 30 : trickValue * (tricks - 6);
    if (tricks < 7) pcScore = 0;
    score = pcScore;

    if (tricks >= requiredTricks) {
      if (pcScore >= 100) {
        score += vulnerable ? 500 : 300;
      } else {
        score += 50;
      }
      const overtricks = tricks - requiredTricks;
      if (overtricks > 0) {
        score += overtricks * trickValue * (vulnerable ? 2 : 1);
      }
      if (contract === 6) score += vulnerable ? 750 : 500;
      if (contract === 7) score += vulnerable ? 1500 : 1000;
    } else {
      const undertricks = requiredTricks - tricks;
      score = undertricks * (vulnerable ? 100 : 50);
    }
  }
</script>

<h1>Brydż</h1>
<p>PIN: {pin}</p>
<p>{message}</p>

<form on:submit|preventDefault={updateGame}>
  <label>Poziom kontraktu (1-7): <input type="number" min="1" max="7" bind:value={contract} on:input={calculateScore} /></label>
  <label>Liczba lew: <input type="number" min="0" max="13" bind:value={tricks} on:input={calculateScore} /></label>
  <label>Kolor:
    <select bind:value={suit} on:change={calculateScore}>
      <option value="trefl">Trefl</option>
      <option value="karo">Karo</option>
      <option value="kier">Kier</option>
      <option value="pik">Pik</option>
      <option value="BA">Bez Atu</option>
    </select>
  </label>
  <label>Przed partią: <input type="checkbox" bind:checked={beforeParty} on:change={calculateScore} /></label>
  <label>Po partii: <input type="checkbox" bind:checked={afterParty} on:change={calculateScore} /></label>
  <button type="submit">Zapisz na blockchain</button>
</form>

{#if gameData}
  <div class="result">
    <h2>Wynik: {score}</h2>
    <p>Kontrakt: {gameData.contract} {gameData.suit}</p>
    <p>Liczba lew: {gameData.tricks}</p>
    <p>Vulnerable: {gameData.afterParty ? 'Tak' : 'Nie'}</p>
  </div>
{/if}

<style>
  h1 { font-size: 2em; text-align: center; }
  form { max-width: 400px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; }
  label { display: block; margin: 10px 0; }
  input, select { width: 100%; padding: 8px; }
  .result { text-align: center; margin-top: 20px; }
</style>