<script>
  import { Actor, HttpAgent } from '@dfinity/agent';
  import { idlFactory } from '../../declarations/karciane_backend';// Poprawiona ścieżka
  import { onMount } from 'svelte';

  export let data;
  let pin = data.pin;
  let actor;
  let message = '';
  let gameData = null;
  let redThrees = 0;
  let canastas = 0;
  let cleanCanastas = 0;
  let dirtyCanastas = 0;
  let cardsPoints = 0;
  let meldPoints = 0;
  let finalPoints = 0;
  let onTable = false;
  let finished = false;
  let score = 0;

  onMount(async () => {
    const agent = new HttpAgent({ host: 'http://localhost:4943' });
    if (agent.isLocal()) { agent.fetchRootKey(); }
    actor = Actor.createActor(idlFactory, { agent, canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai' });
    await actor.addGame(pin, 'canasta');
    await fetchGameData();
  });

  async function fetchGameData() {
    const result = await actor.getGame(pin);
    if (result && 'Canasta' in result) {
      gameData = result.Canasta;
      redThrees = gameData.redThrees;
      canastas = gameData.canastas;
      cleanCanastas = gameData.cleanCanastas;
      dirtyCanastas = gameData.dirtyCanastas;
      cardsPoints = gameData.cardsPoints;
      meldPoints = gameData.meldPoints;
      finalPoints = gameData.finalPoints;
      onTable = gameData.onTable;
      finished = gameData.finished;
      calculateScore();
    }
  }

  async function updateGame() {
    message = await actor.updateCanastaGame(pin, redThrees, canastas, cleanCanastas, dirtyCanastas, cardsPoints, meldPoints, finalPoints, onTable, finished);
    await fetchGameData();
  }

  function calculateScore() {
    score = meldPoints + cardsPoints;
    if (!finished) {
      score -= finalPoints;
    } else {
      score += finalPoints + 100;
    }
    if (onTable) score += 100;
    score += (redThrees * 100) + (cleanCanastas * 500) + (dirtyCanastas * 300);
  }
</script>

<h1>Kanasta</h1>
<p>PIN: {pin}</p>
<p>{message}</p>

<form on:submit|preventDefault={updateGame}>
  <label>Czerwone trójki: <input type="number" min="0" bind:value={redThrees} on:input={calculateScore} /></label>
  <label>Kanasty (ogółem): <input type="number" min="0" bind:value={canastas} on:input={calculateScore} /></label>
  <label>Czyste kanasty: <input type="number" min="0" bind:value={cleanCanastas} on:input={calculateScore} /></label>
  <label>Brudne kanasty: <input type="number" min="0" bind:value={dirtyCanastas} on:input={calculateScore} /></label>
  <label>Punkty za karty: <input type="number" min="0" bind:value={cardsPoints} on:input={calculateScore} /></label>
  <label>Punkty za meldunki: <input type="number" min="0" bind:value={meldPoints} on:input={calculateScore} /></label>
  <label>Punkty końcowe: <input type="number" min="0" bind:value={finalPoints} on:input={calculateScore} /></label>
  <label>Na stole: <input type="checkbox" bind:checked={onTable} on:change={calculateScore} /></label>
  <label>Zakończona: <input type="checkbox" bind:checked={finished} on:change={calculateScore} /></label>
  <button type="submit">Zapisz na blockchain</button>
</form>

{#if gameData}
  <div class="result">
    <h2>Wynik: {score}</h2>
    <p>Czerwone trójki: {gameData.redThrees}</p>
    <p>Kanasty: {gameData.canastas}</p>
    <p>Czyste kanasty: {gameData.cleanCanastas}</p>
    <p>Brudne kanasty: {gameData.dirtyCanastas}</p>
    <p>Punkty za karty: {gameData.cardsPoints}</p>
    <p>Punkty za meldunki: {gameData.meldPoints}</p>
    <p>Punkty końcowe: {gameData.finalPoints}</p>
    <p>Na stole: {gameData.onTable ? 'Tak' : 'Nie'}</p>
    <p>Zakończona: {gameData.finished ? 'Tak' : 'Nie'}</p>
  </div>
{/if}

<style>
  h1 { font-size: 2em; text-align: center; }
  form { max-width: 400px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; }
  label { display: block; margin: 10px 0; }
  input { width: 100%; padding: 8px; } /* Usunięto select, bo nie używany */
  .result { text-align: center; margin-top: 20px; }
</style>