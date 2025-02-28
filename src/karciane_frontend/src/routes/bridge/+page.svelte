<script>
 import "../../index.scss";
  import { backend } from "$lib/canisters";
  import * as yup from 'yup';
  import { fade, blur, fly, slide, scale, draw , crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
  import { labels } from '$lib/shared.svelte.js';
  import { onMount } from 'svelte';

  export let data;
  let pin = data?.pin; // Pobierz pin z query string, jeśli istnieje
  let actor;
  let message = '';
  let gameData = null;



  if (!pin) {
    const url = new URL(window.location.href);
    pin = url.searchParams.get('pin');
  }

  let values = {};
	let errors = {};
  let suma = 0 ;
  let sumaNS = 0;
  let sumaWE = 0;
  let sumaIMP=0;
  $: blokujDodaj = !(
    pin &&
    side &&
    selectedC &&
    selectedV &&
    tricks > 0 &&
    typeof double === 'boolean' &&
    typeof redouble === 'boolean' &&
    values.pc > 0 &&
    typeof vulnerable === 'boolean'
  );
  let labelNS = labels.labelNS;
  let labelWE = labels.labelWE;
  let double = false;
  let redouble = false;
  let vulnerable =false;
  let ileGier=0;

  const sleep = ms => new Promise(f => setTimeout(f, ms));

  let side = "";
  let selectedC = "";
  let selectedV = 0;
  let contractName ="";
  let contractVol ="";
  let tricks = 0;
  let pc = 0;
  let miltons = 0;
   let greeting = "";
   let wyniki = [] ;
   let idh = 1;

//    onMount(async () => {
//     if (!pin) {
//       const url = new URL(window.location.href);
//       pin = url.searchParams.get('pin');
//       if (!pin) {
//         pin = document.cookie
//           .split('; ')
//           .find(row => row.startsWith('game_pin='))
//           ?.split('=')[1] || 'pin-default'; // Domyślny PIN, jeśli brak
//     }
//     const agent = new HttpAgent({ host: 'http://localhost:4943' });
//     if (agent.isLocal()) { agent.fetchRootKey(); }
//     actor = Actor.createActor(idlFactory, { agent, canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai' });
//     await actor.addGame(pin, 'bridge');
//     await fetchGameData();
//   }
// }
// );

  // async function fetchGameData() {
  //   const result = await actor.getGame(pin);
  //   if (result && 'Bridge' in result) {
  //     gameData = result.Bridge;
  //     contract = gameData.contract;
  //     tricks = gameData.tricks;
  //     suit = gameData.suit;
  //     beforeParty = gameData.beforeParty;
  //     afterParty = gameData.afterParty;
  //     calculateScore();
  //   }
  // }

  // async function updateGame() {
  //   message = await actor.updateBridgeGame(pin, contract, tricks, suit, beforeParty, afterParty);
  //   await fetchGameData();
  // }



  async function reset() {
    
    await backend.b_resetHand().then((response) => {
        //info = response;
        czytajWyniki();
    }
    
    )};

 
 //////////////////////////////////////////////////
    function count_chicago(
 //////////////////////////////////////////////////     
  id,
  side,
  contract,
  suit,
  tricks,
  double,
  redouble,
  vulnerable,
  handPoints // Punkty (PC) linii rozgrywającej
) {
  let score = 0; // Punktacja Chicago
  let expectedScore = 0; // Oczekiwany wynik z tabeli
  let imp = 0; // Punktacja IMP
  let trickValue = 0;
  const requiredTricks = 6 + contract;
  const undertricks = requiredTricks - tricks;
  const overtricks = tricks - requiredTricks;

  // Oblicz punktację Chicago
  if (overtricks >= 0) {
    if (["♣", "♦"].includes(suit)) {
      trickValue = 20;
    } else if (["♥", "♠"].includes(suit)) {
      trickValue = 30;
    } else { // NT
      trickValue = 40;
    }

    let pcScore = suit === 'NT' && tricks > 6 ? 40 + (tricks - 6 - 1) * 30 : trickValue * (tricks - 6);
    score += pcScore;

    if (pcScore >= 100) {
      score += vulnerable ? 500 : 300;
    } else {
      score += 50;
    }

    if (contract === 6) score += vulnerable ? 750 : 500;
    if (contract === 7) score += vulnerable ? 1500 : 1000;

    if (overtricks > 0) {
      score += overtricks * trickValue * (vulnerable ? 2 : 1);
    }
  } else {
    score = undertricks * (vulnerable ? 100 : 50) * -1;
  }

  // Tabela wartości oczekiwanych (expectedScore) dla PC
  const expectedTable = [
    { pcMin: 0, pcMax: 15, expectedBefore: 0, expectedAfter: 0 },
    { pcMin: 16, pcMax: 19, expectedBefore: 0, expectedAfter: 110 },
    { pcMin: 20, pcMax: 22, expectedBefore: 0, expectedAfter: 110 },
    { pcMin: 23, pcMax: 25, expectedBefore: 110, expectedAfter: 110 },
    { pcMin: 26, pcMax: 28, expectedBefore: 110, expectedAfter: 400 },
    { pcMin: 29, pcMax: 31, expectedBefore: 110, expectedAfter: 400 },
    { pcMin: 32, pcMax: 34, expectedBefore: 400, expectedAfter: 400 },
    { pcMin: 35, pcMax: 37, expectedBefore: 400, expectedAfter: 600 },
    { pcMin: 38, pcMax: Infinity, expectedBefore: 400, expectedAfter: 600 }
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
    razem: imp+"("+score+")",
    handPoints: handPoints || 0, // Punkty karne linii rozgrywającej
    expectedScore: expectedScore // Oczekiwany wynik (dla debugowania)
  };

  //return score +" : "+imp;
  //return imp;

}

async function czytajWyniki() {

  await backend.b_readHands().then((response) => {
                          wyniki = response; 
                          suma = 0;
                          sumaNS = 0;
                          sumaWE = 0;


        for (let i=0;i<wyniki.length; i++) {
         // console.log(wyniki[i])
          
          sumaIMP +=  count_chicago(wyniki[i].id,wyniki[i].side, wyniki[i].contractVol, wyniki[i].contractName ,wyniki[i].tricks, wyniki[i].doubled, wyniki[i].redoubled,  wyniki[i].vulnerable, wyniki[i].pc).impScore;

          if (wyniki[i].side === "NS") { sumaNS = sumaIMP };
          if (wyniki[i].side === "WE") { sumaWE = sumaIMP };
          ileGier += 1;
        };

        blokujDodaj=false;
  }
  
)};

// async function onChange(){
//    if (pin&& side&& selectedC && selectedV && tricks && pc &&  vulnerable){
//   blokujDodaj=false;}
//  }

  async function submitHandler() {
    blokujDodaj=true;
    //console.log('debug1:', pin, side, selectedC , selectedV | 0, tricks | 0, double, redouble, pc | 0,  vulnerable);
		try {
		//	await schema.validate(values, { abortEarly: false });
				errors = {};
        //vulnerable = false;
        //console.log('debug1:', pin, side, selectedC , selectedV | 0, tricks | 0, double, redouble, pc | 0,  vulnerable);
       // if (hands[idh].vul === side )  vulnerable = true;
       backend.b_addHand(pin, side, selectedC , selectedV | 0, tricks | 0, double, redouble, values.pc | 0,  vulnerable ).then((response) => {
        greeting = response;
      });
      await sleep(4000);
      await czytajWyniki();
      side=null;
      selectedC=null;
      selectedV=null;
      tricks=null;
      double=null;
      redouble=null;
      values.pc=null;
  
		} catch (err) {
      blokujDodaj=false;
		//	errors = extractErrors(err);
		}

	}


  //$:  console.log(JSON.stringify(wyniki.toString(), null, 2));
 
</script>

<main>



  <form action="#" on:submit|preventDefault={submitHandler} >
  Założenia:

	<label>		<input			type="radio"			name="vulnerable"			value=false	checked="checked"	/>	</label> przed
  <label>		<input			type="radio"			name="vulnerable"			value=true		/>	</label> po

<br/>
  <!-- Rozdaje: <span id="zalozenia" style="font-size:16pt;"> {hands[idh].dealer} </span>po partii: <span id="zalozenia" style="font-size:16pt;">{hands[idh].vul}</span> <br/> -->
  Kontrakt: <br/>





    <!-- TODO zamień na listę  -->

<!-- <input id="contractVol" alt="contractVol" type="text" bind:value={values.contractVol} style="height:28px;font-size:12pt;width:28px"/>
<span id="error">{#if errors.contractVol}{errors.contractVol}{/if}</span> -->

<select
bind:value={side}
onchange={() => (side = '')} style="height:30px;font-size:12pt;;width:60px"
>
{#each ["NS","WE"] as side}
  <option value={side}>
    {side}
  </option>
{/each}
</select>


<select
bind:value={selectedV}
onchange={() => (contractVol = '')} style="height:30px;font-size:12pt;;width:40px"
>
{#each [1,2,3,4,5,6,7] as contractVol}
  <option value={contractVol}>
    {contractVol}
  </option>
{/each}
</select>


    <select
		bind:value={selectedC}
		onchange={() => (contractName = '')} style="height:30px;font-size:14pt;width:98px"
	>
		{#each ["♣","♦","♥","♠","NT"] as contractName}
			<option value={contractName}>
				{contractName}
			</option>
		{/each}
	</select>
  k<input type="checkbox" value={double}>
  r<input type="checkbox" value={redouble}>

   <!-- <input id="contractName" size="20.px" alt="contractName" type="text" bind:value={values.contractName} style="height:28px;font-size:11pt;"/>
   -->


   <span id="error">{#if errors.contractVol}{errors.contractVol}{/if}</span> <br />

Lew: 
   <select
   bind:value={tricks}
   onchange={() => (tricks = '')} style="height:28px;font-size:12pt;;width:98px"
   >
   {#each [0,1,2,3,4,5,6,7,8,9,10,11,12,13] as tricks}
     <option value={tricks}>
       {tricks}
     </option>
   {/each}
   </select>
<!-- 
    <input id="tricks" alt="tricks" type="text" bind:value={values.tricks} style="height:28px;font-size:12pt;width=8px"/> -->
    <span id="error">{#if errors.tricks}{errors.tricks}{/if}</span>
 <br/>
 PC:
 <input id="pc" alt="pc" type="number" bind:value={values.pc} style="height:28px;font-size:12pt;width:98px"/> 

    {#if blokujDodaj}
      <div><button type="submit" hidden>Dodaj</button></div>
    {:else}
      <div><button type="submit">Dodaj</button></div>
    {/if}
  </form>
  <br />



  <br /> 



	<section id="wyniki">
    {#if wyniki.length>0}


    <div class= "array" >
      {#each wyniki as element, i (element)}

        <div animate:flip="{{ duration: 300 }}" out:scale="{{ duration: 250 }}" in:scale="{{ duration: 1250 }}">
          <!-- <span id="zalozenia">{hands[element.id].dealer}&nbsp;{hands[element.id].vul}</span> -->
           <span >{element.side}&nbsp;{element.contractVol}{element.contractName}&nbsp;</span>
            <span> {#if 6 + element.contractVol - element.tricks > 0} - {6 + element.contractVol - element.tricks} 
                   {:else if  element.tricks - (6 + element.contractVol)  > 0} + {element.tricks - (6 + element.contractVol)}
                   {:else}--- 
                   {/if} </span>
            <span style="font-size:12pt">  [{element.pc}  PC] ->  </span>
            <!-- <span>   {count_milton(element.id,element.side, element.contractVol,element.contractName,element.tricks,element.doubled,element.redoubled, element.vulnerable)} </span> -->
            <span>  {count_chicago(element.id,element.side, element.contractVol,element.contractName,element.tricks,element.doubled,element.redoubled, element.vulnerable,element.pc).razem} </span>         
          </div>
        
      {/each}
<br />

     </div>  


    {/if}

  </section>

 
  <span >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{labelNS}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{labelWE}</span>


  <div id="suma" transition:blur={{ amount: 100,duration: 2900 }} >&nbsp;&nbsp;  &nbsp;&nbsp;
    <span id= "minusyP"   >{sumaNS}</span>

    ........
    

    <span id= "PierwszyP"  >{sumaWE}</span>  
  
  </div>
  <br />

  <br />  <button on:click={czytajWyniki} style="align:center">Czytaj PIN {pin} </button>
  {#if ileGier>8}
  <div><button on:click={reset} >restart gry </button></div>
{:else}
  <div><button on:click={reset} hidden>restart gry </button></div>
{/if}
    


</main>

<style>
#zalozenia{
  background-color:rgb(232, 145, 31);
  font-size:8pt;
  justify-content: center;
}  
#wyniki {
  margin: 5px auto;
  padding: 10px 10px;
  border: 1px dashed #222;
  background-color:antiquewhite;
  justify-content: center;
}


#suma {
  color: #e00b0b;
  font-size: 1.8rem;
  background-color:rgb(98, 215, 176);
  /* border: 1px solid #222; */
}
</style>
 