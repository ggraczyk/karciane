<script>
  import "../../index.scss";
  import { backend } from "$lib/canisters";
  import * as yup from 'yup';
  import { fade, blur, fly, slide, scale, draw, crossfade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { labels } from '$lib/shared.svelte.js';
  import { onMount } from 'svelte';
  import { json } from '@sveltejs/kit';

  export let data;
  let pin = data?.pin; // Pobierz pin z query string, jeśli istnieje
  let actor;
  let message = '';
  let gameData = null;

  if (!pin) {
    const url = new URL(window.location.href);
    pin = url.searchParams.get('pin');
  }

  let values = { pc: 0 };
  let errors = {};
  let suma = 0;
  let sumaNS = 0;
  let sumaWE = 0;
  let sumaIMP = 0;
  let side = '';
  let selectedC = '';
  let selectedV = 0;
  let contractVol = selectedV;
  let contractName = selectedC;
  let tricks = 0;
  let double = false;
  let redouble = false;
  let vulnerable = false;
  let blokujDodaj = true;
// Reaktywne wyrażenie do aktualizacji blokujDodaj
  $: blokujDodaj = !(
    pin &&
    side &&
    selectedC &&
    selectedV > 0 &&
    tricks > 0 &&
    typeof double === 'boolean' &&
    typeof redouble === 'boolean' &&
    values.pc > 0 &&
    typeof vulnerable === 'boolean'
  );

  // Reaktywne wyświetlanie wyniku przed zapisem na blockchain
  $: podgladWyniku = count_chicago(selectedV, selectedC, tricks, double, redouble, vulnerable, values.pc).chicagoScore;

  let labelNS = labels.labelNS;
  let labelWE = labels.labelWE;
  let ileGier = 0;
  let wyniki = [];
  let greeting = "";
  //let idh = 1;
  let navigationAttempts = 0;

  const sleep = ms => new Promise(f => setTimeout(f, ms));

  // Funkcja count_chicago
  function count_chicago(
    contract,
    suit,
    tricks,
    double,
    redouble,
    vulnerable,
    handPoints // Punkty (PC) linii rozgrywającej
  ) {
    let score = 0;
    let expectedScore = 0;
    let imp = 0;
    let trickValue = 0;
    let requiredTricks = 6 + contract;
    let undertricks = requiredTricks - tricks;
    let overtricks = tricks - requiredTricks;

    let multiplier = 1;
    if (double) {
      multiplier = 2;
    }
    if (redouble) {
    multiplier = 4; // Rekontra: mnożnik x4
    }


  // Oblicz punktację Chicago

      if (["♣", "♦"].includes(suit)) {
        trickValue = 20;
      } else if (["♥", "♠"].includes(suit)) {
        trickValue = 30;
      } else { // NT
        trickValue = 30;  // dodatkowe 10 uwzględnione gdzieś indziej
      }
   // Oblicz punktację kontraktową z uwzględnieniem kontry/rekontry
     if (overtricks >= 0) {
           score = trickValue * (tricks - 6);   // 30 * (8-1) > 60
                 if ( suit === 'NT' ) {score +=10;}  // 60+10=70
                 console.log('score1:',score);
              // let basePcScore = pcScore;
              // pcScore *= multiplier; 
       //       score += pcScore;  //70
              console.log('score2:',score);
            // Premie za dograną
            if (score * multiplier >= 100 && (
                                            (["♣", "♦"].includes(suit) && contract >=5 ) ||
                                            (["♥", "♠"].includes(suit) && contract >=4 ) ||
                                            (["NT"].includes(suit) && contract >=4 ) 
                                          )     )                          
              {
                      score += vulnerable ? 500 : 300;
                      console.log('score3:',score);
                      if (double) score += 50;
                      console.log('score4:',score);
                      if (redouble) score += 100;
                      console.log('score5:',score);
              } 
              else 
              { // Częściówka
                if (redouble) {score += 200;
                               console.log('score6:',score); 
                              }  //270
                 
                else {
                      if (double) {score += 100
                                    console.log('score7:',score);
                                  }  //170
                         else score +=50;        //120
                         console.log('score8a:',score);
                      }
              }


              // szlemik szlem
              if (contract === 6) score += vulnerable ? 750 : 500;
              if (contract === 7) score += vulnerable ? 1500 : 1000;
              console.log('score8b:',score);
            // Nadróbki, normalne już uwzględnione wcześniej 
              if (overtricks > 0) {
                console.log('score9:',score);
                if (double || redouble){
                  console.log('scoreXX  :',score);
                     score -= overtricks * trickValue; // jeśłi konta/rekontra wycofaj naliczenie standardowe 170-30=140  (40+30+100-30)
                     score +=  redouble ? 200*overtricks :100*overtricks; //140 + 1*100 = 240
                      //score += overtricks * trickValue * (vulnerable ? 2 : 1);
                      console.log('score10  :',score);
                }
              }

              console.log('tricks:',tricks,  'trickValue:',trickValue, 'requiredTricks:',requiredTricks, 'overtricks:',overtricks, 'score:',score);

    // /////////////////////////////////  Wpadki ////////////////////////
                                    //           *       *
//     Za wpadkę - pierwsza lewa	          5o	100	1oo	200

//     Za wpadkę - druga i trzecia lewa	    50	200	100	300
//                                          50	200	100	300

//     Za wpadkę - czwarta lewa i pozostałe	5o	300	1oo	300
//                                          50	300	100	300
//                                          50	300	100	300
    } else {
            if (undertricks>=4) {
                              score = vulnerable ? -100*(undertricks-3) : -50*(undertricks-3); //TODO ale też 3,2,1 !!!
                              console.log ('wp1a', undertricks,score);
                              score = double&&vulnerable ?  score * 3 : score;
                              console.log ('wp1b', undertricks,score);
                              score = redouble ?  score * 2 : score;
                              console.log ('wp1c', undertricks,score);
                              undertricks = 3;
            } ;
            
            if (undertricks>=2) {
                              score += vulnerable ? -100*(undertricks-1) : -50*(undertricks-1);   // TODO oddzielnie druga i pierwsza
                              console.log ('wp2a', undertricks,score);
                              score = double&&vulnerable ?  score * 3 : score;
                              console.log ('wp2b', undertricks,score)
                              score = redouble ?  score * 2 : score;
                              console.log ('wp2c', undertricks,score);
                              undertricks = 1;
            };
                    
            if (undertricks===1) {    // jedna jedyna wpaadak
                              score += vulnerable ? -100 : -50;
                              console.log ('wp3a', undertricks,score);
                              score = double ? score *2 : score;
                              console.log ('w3b', undertricks,score);
                              score = redouble ? score *2 : score;
                              console.log ('wp3c', undertricks,score);
            };
                            console.log ('------------');
      };


   console.log('score13b  :',score);
  // Tabela wartości oczekiwanych (expectedScore) dla PC
    const expectedTable = [
      { pcMin: 0, pcMax: 4, expectedBefore: -1400, expectedAfter: -2100 },
      { pcMin: 5, pcMax: 5, expectedBefore: -1200, expectedAfter: -1800 },
      { pcMin: 6, pcMax: 6, expectedBefore: -1000, expectedAfter: -1500 },
      { pcMin: 7, pcMax: 7, expectedBefore: -900, expectedAfter: -1350 },
      { pcMin: 8, pcMax: 8, expectedBefore: -700, expectedAfter: -1050 },
      { pcMin: 9, pcMax: 9, expectedBefore: -600, expectedAfter: -800 },
      { pcMin: 10, pcMax: 10, expectedBefore: -490, expectedAfter: -690 },
      { pcMin: 11, pcMax: 11, expectedBefore: -460, expectedAfter: -660 },
      { pcMin: 12, pcMax: 12, expectedBefore: -430, expectedAfter: -630 },
      { pcMin: 13, pcMax: 13, expectedBefore: -400, expectedAfter: -600 },
      { pcMin: 14, pcMax: 14, expectedBefore: -350, expectedAfter: -520 },
      { pcMin: 15, pcMax: 15, expectedBefore: -300, expectedAfter: -440 },
      { pcMin: 16, pcMax: 16, expectedBefore: -200, expectedAfter: -290 },
      { pcMin: 17, pcMax: 17, expectedBefore: -110, expectedAfter: -110 },
      { pcMin: 18, pcMax: 18, expectedBefore: -70, expectedAfter: -70 },
      { pcMin: 19, pcMax: 19, expectedBefore: -50, expectedAfter: -50 },
      { pcMin: 20, pcMax: 20, expectedBefore: 0, expectedAfter: 0 },
      { pcMin: 21, pcMax: 21, expectedBefore: 50, expectedAfter: 50 },
      { pcMin: 22, pcMax: 22, expectedBefore: 70, expectedAfter: 70 },
      { pcMin: 23, pcMax: 23, expectedBefore: 110, expectedAfter: 110 },
      { pcMin: 24, pcMax: 24, expectedBefore: 200, expectedAfter: 290 },
      { pcMin: 25, pcMax: 25, expectedBefore: 300, expectedAfter: 440 },
      { pcMin: 26, pcMax: 26, expectedBefore: 350, expectedAfter: 520 },
      { pcMin: 27, pcMax: 27, expectedBefore: 400, expectedAfter: 600 },
      { pcMin: 28, pcMax: 28, expectedBefore: 430, expectedAfter: 630 },
      { pcMin: 29, pcMax: 29, expectedBefore: 460, expectedAfter: 660 },
      { pcMin: 30, pcMax: 30, expectedBefore: 490, expectedAfter: 690 },
      { pcMin: 31, pcMax: 31, expectedBefore: 600, expectedAfter: 800 },
      { pcMin: 32, pcMax: 32, expectedBefore: 700, expectedAfter: 1050 },
      { pcMin: 33, pcMax: 33, expectedBefore: 900, expectedAfter: 1350 },
      { pcMin: 34, pcMax: 34, expectedBefore: 1000, expectedAfter: 1500 },
      { pcMin: 35, pcMax: 35, expectedBefore: 1100, expectedAfter: 1650 },
      { pcMin: 36, pcMax: 36, expectedBefore: 1200, expectedAfter: 1800 },
      { pcMin: 37, pcMax: 40, expectedBefore: 1400, expectedAfter: 2100 }
    ];

 // Znajdź oczekiwany wynik na podstawie PC i vulnerabilności
    for (let i = 0; i < expectedTable.length; i++) {
      const range = expectedTable[i];
      if (handPoints >= range.pcMin && handPoints <= range.pcMax) {
        expectedScore = vulnerable ? range.expectedAfter : range.expectedBefore;
        break;
      }
    }

  // Oblicz różnicę między wynikiem a oczekiwanym
    const pointDifference = score - expectedScore;
    console.log(score,expectedScore, pointDifference);
 // Tabela przeliczeniowa na IMP
    const impTable = [
      { diff: 10, imp: 0 },
      { diff: 40, imp: 1 },
      { diff: 80, imp: 2 },
      { diff: 120, imp: 3 },
      { diff: 160, imp: 4 },
      { diff: 210, imp: 5 },
      { diff: 260, imp: 6 },
      { diff: 310, imp: 7 },
      { diff: 360, imp: 8 },
      { diff: 420, imp: 9 },
      { diff: 490, imp: 10 },
      { diff: 590, imp: 11 },
      { diff: 690, imp: 12 },
      { diff: 790, imp: 13 },
      { diff: 890, imp: 14 },
      { diff: 990, imp: 15 },
      { diff: 1490, imp: 16 },
      { diff: 1990, imp: 17 },
      { diff: Infinity, imp: 18 }
    ];

  // Oblicz IMP na podstawie różnicy punktów
    for (let i = 0; i < impTable.length; i++) {
      const range = impTable[i];
      if (Math.abs(pointDifference) <= range.diff) {
        imp = pointDifference >= 0 ? range.imp : -range.imp;
        break;
      }
    }

  // Zwróć obiekt z wynikami
    return {
    chicagoScore: score, // Punktacja w systemie Chicago
    impScore: imp, // Punktacja IMP
    razem: imp+" ("+score+")",
    handPoints: handPoints || 0, // Punkty karne linii rozgrywającej
    expectedScore: expectedScore // Oczekiwany wynik (dla debugowania)
    };
  }

  async function czytajWyniki() {
    await backend.b_readHands().then((response) => {
      wyniki = response;
      suma = 0;
      sumaNS = 0;
      sumaWE = 0;
      sumaIMP = 0;

      ileGier = wyniki.length;
      for (let i = 0; i < wyniki.length; i++) {
        sumaIMP = count_chicago(
          wyniki[i].contractVol,
          wyniki[i].contractName,
          wyniki[i].tricks,
          wyniki[i].doubled,
          wyniki[i].redoubled,
          wyniki[i].vulnerable,
          wyniki[i].pc
        ).impScore;

        if (wyniki[i].side === "NS") {
          sumaNS += sumaIMP;
        }
        if (wyniki[i].side === "WE") {
          sumaWE += sumaIMP;
        }
        
      }

      blokujDodaj = true;
    });
  }

  async function reset() {
    await backend.b_resetHand().then((response) => {
      czytajWyniki();
    });
  }

  async function submitHandler() {
    blokujDodaj = true;
   // console.log('debug1:', pin, side, selectedC, selectedV, tricks, double, redouble, values.pc, vulnerable);

    try {
      errors = {};
      await backend.b_addHand(pin, side, selectedC, selectedV, tricks, double, redouble, values.pc, vulnerable).then((response) => {
        greeting = response;
      });
      await sleep(4000);
      await czytajWyniki();

      // Resetuj formularz
      side = '';
      selectedC = '';
      selectedV = 0;
      contractVol = 0;
      contractName = '';
      tricks = 0;
      double = false;
      redouble = false;
      values.pc = 0;
      vulnerable = false;
    } catch (err) {
      blokujDodaj = false;
      console.error('Błąd przy przesyłaniu formularza:', err);
    }
  }

  // onMount(() => {
  //   czytajWyniki();
  // });


  onMount(() => {
    if (navigationAttempts >= 3) {
      console.error('Zbyt wiele prób nawigacji, zatrzymuję ładowanie danych.');
      return;
    }
    navigationAttempts += 1;
    czytajWyniki();
  });


</script>

<main>
  <form action="#" on:submit|preventDefault={submitHandler}>
    Założenia:
    <label>
      <input type="radio" name="vulnerable" value={false} bind:group={vulnerable} checked /> przed
    </label>
    <label>
      <input type="radio" name="vulnerable" value={true} bind:group={vulnerable} /> po
    </label>
    <br>

    Kontrakt: <br/>
    <select bind:value={side} style="height:30px;font-size:12pt;width:60px">
      <option value="">Wybierz stronę</option>
      {#each ["NS", "WE"] as opt}
        <option value={opt}>{opt}</option>
      {/each}
    </select>

    <select bind:value={selectedV} style="height:30px;font-size:12pt;width:40px">
      <option value={0}>Wybierz kontrakt</option>
      {#each [1,2,3,4,5,6,7] as vol}
        <option value={vol}>{vol}</option>
      {/each}
    </select>

    <select bind:value={selectedC} style="height:30px;font-size:14pt;width:98px">
      <option value="">Wybierz kolor</option>
      {#each ["♣", "♦", "♥", "♠", "NT"] as name}
        <option value={name}>{name}</option>
      {/each}
    </select>

    <label>k <input type="checkbox" bind:checked={double}></label>
    <label>r <input type="checkbox" bind:checked={redouble}></label>
    <br>

    <label>Lew:
      <select bind:value={tricks} style="height:28px;font-size:12pt;width:98px">
        <option value={0}>Wybierz lewy</option>
        {#each [0,1,2,3,4,5,6,7,8,9,10,11,12,13] as t}
          <option value={t}>{t}</option>
        {/each}
      </select>
    </label>
 
    <label>PC:
      <input id="pc" alt="pc" type="number" bind:value={values.pc} style="height:28px;font-size:12pt;width:98px"/>
    </label>

    {#if blokujDodaj}
      <div><button type="submit" hidden>Dodaj</button></div>
    {:else}
      <br/><div style="color:grey">{podgladWyniku}
      <br/><button type="submit">Dodaj</button></div><br/>
    {/if}
  </form>

  <section id="wyniki">
    {#if wyniki.length > 0}
      <div class="array">
        {#each wyniki as element, i (element)}
          <div animate:flip="{{ duration: 300 }}" out:scale="{{ duration: 250 }}" in:scale="{{ duration: 1250 }}">
            {#if element.vulnerable}
              <span style="color:red">{element.side} {element.contractVol}{element.contractName}</span>
              {#if element.doubled} <span>*</span> {/if}
              {#if element.redoubled} <span>*</span> {/if}
              <span style="color:red">
                {#if 6 + element.contractVol - element.tricks > 0}
                  - {6 + element.contractVol - element.tricks}
                {:else if element.tricks - (6 + element.contractVol) > 0}
                  + {element.tricks - (6 + element.contractVol)}
                {:else}
                  ---
                {/if}
              </span>
              <span style="font-size:12pt;color:red">[{element.pc} PC] -> </span>
              <span style="color:red">{count_chicago(element.contractVol, element.contractName, element.tricks, element.doubled, element.redoubled, element.vulnerable, element.pc).razem}</span>
            {:else}
              <span style="color:black">{element.side} {element.contractVol}{element.contractName}</span>
              {#if element.doubled} <span>*</span> {/if}
              {#if element.redoubled} <span>*</span> {/if}
              <span style="color:black">
                {#if 6 + element.contractVol - element.tricks > 0}
                  - {6 + element.contractVol - element.tricks}
                {:else if element.tricks - (6 + element.contractVol) > 0}
                  + {element.tricks - (6 + element.contractVol)}
                {:else}
                  ---
                {/if}
              </span>
              <span style="font-size:12pt;color:black">[{element.pc} PC] -> </span>
              <span style="color:black">{count_chicago(element.contractVol, element.contractName, element.tricks, element.doubled, element.redoubled, element.vulnerable, element.pc).razem}</span>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </section>

 
  <span >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{labelNS}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{labelWE}</span>


  <div id="suma" transition:blur={{ amount: 100,duration: 2900 }} >&nbsp;&nbsp;  &nbsp;&nbsp;
    <span id= "minusyP"   >{sumaNS}</span>

    ........
    <span id="PierwszyP">{sumaWE}</span>
  </div>
  <br>

  <button on:click={czytajWyniki} style="align:center">Czytaj PIN {pin}</button>
  {#if ileGier >= 8}
    <div><button on:click={reset}>Restart gry</button></div>
  {:else}
    <div><button on:click={reset} hidden>Restart gry</button></div>
  {/if}
</main>

<style>
  #wyniki {
    margin: 5px auto;
    padding: 10px 10px;
    border: 1px dashed #222;
    background-color: antiquewhite;
    justify-content: center;
  }

  #suma {
    color: #e00b0b;
    font-size: 1.8rem;
    background-color: rgb(98, 215, 176);
  }
</style>