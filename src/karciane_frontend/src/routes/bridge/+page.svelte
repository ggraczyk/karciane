<script>
 import "../../index.scss";
  import { backend } from "$lib/canisters";
  import * as yup from 'yup';
  import { fade, blur, fly, slide, scale, draw , crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
  import { labels } from '$lib/shared.svelte.js';

  let values = {};
	let errors = {};
  let sumaNS = 0;
  let sumaWE = 0;
  let blokujDodaj = false;
  let labelNS = labels.labelNS;
  let labelWE = labels.labelWE;
  let double = false;
  let redouble = false;

  const sleep = ms => new Promise(f => setTimeout(f, ms));

  let side = "";
  let selectedC = "";
  let selectedV = 0;
  let contractName ="";
  let contractVol ="";
  let tricks = 0;
  let pc = 0;
  let miltons = 0;
  
    // const schema = yup.object().shape({
    //   pair1: yup.string().required("uzupełnij pole").matches(/^[-,0-9]+5$|0$/,
    //                         "źle!"),
    //   pair2: yup.string().required("uzupełnij pole").matches(/^[-,0-9]+5$|0$/,
    //                         "źle!"),
    // });

  
   let greeting = "";
   let wyniki = [] ;

 
  //  function extractErrors(err) {
	// 	return err.inner.reduce((acc, err) => {
	// 		return { ...acc, [err.path]: err.message };
	// 	}, {});
    
	// }



  async function reset() {
    
    await backend.b_resetHand().then((response) => {
        //info = response;
        czytajWyniki();
    }
    
    )};

function count_milton(side, v, con ,t, double, redouble, PC  ){ 
  let score = 0;
  let extraNT = 0;
  let bonus = 0;
  let penalty = 0;
  let sumScore = 0;
  let overtricks = t - ( 6 + v ) ;  
  let undertrics = ( 6 + v ) - t ;
 
 
  //ugrana
  if (overtricks >=0 ){ 
        if (["♣","♦"].includes(con) ) //"♣","♦","♥","♠","NT"
         {score = 20}
        else if (["♥","♠"].includes(con) ) 
         {score = 30} 
        else {  //NT
            score = 30;
            if (v>=3) {extraNT=10};
          } 

         
  }
  //wpadki
  else { penalty=50*undertrics};

// nadróbki
 if (overtricks>0) {bonus=(score+extraNT) * overtricks}

 sumScore = (score * (v) ) + extraNT + bonus - penalty;

   return sumScore};

async function czytajWyniki() {

  await backend.b_readHands().then((response) => {
                          wyniki = response;
                          sumaNS = 0;
                          sumaWE = 0;
        for (let i=0;i<wyniki.length; i++) {
          if (wyniki[i].side == "NS") {sumaNS += count_milton(wyniki[i].side, wyniki[i].contractVol, wyniki[i].contractName ,wyniki[i].tricks, wyniki[i].double, wyniki[i].redouble, wyniki[i].pc  )};
          if (wyniki[i].side == "WE") {sumaWE += count_milton(wyniki[i].side, wyniki[i].contractVol, wyniki[i].contractName ,wyniki[i].tricks, wyniki[i].double, wyniki[i].redouble, wyniki[i].pc  )};
	      };
        blokujDodaj=false;
  }
  
)};


  async function submitHandler() {
    blokujDodaj=true;
		try {
		//	await schema.validate(values, { abortEarly: false });
				errors = {};
       backend.b_addHand(side, selectedC , selectedV | 0, tricks | 0, double, redouble, values.pc | 0 ).then((response) => {
        greeting = response;
      });
      await sleep(4000);
      await czytajWyniki();
  
		} catch (err) {
      blokujDodaj=false;
		//	errors = extractErrors(err);
		}

	}


  //$:  console.log(JSON.stringify(wyniki.toString(), null, 2));

</script>

<main>
  
  Kontrakt: <br/>

  <form action="#" on:submit|preventDefault={submitHandler}>
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
  k<input type="checkbox" bind:checked={double}>
  r<input type="checkbox" bind:checked={redouble}>

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
 <input id="pc" alt="pc" type="text" bind:value={values.pc} style="height:28px;font-size:12pt;;width:98px"/> 

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
           <span >{element.side}&nbsp;{element.contractVol}{element.contractName}&nbsp;&nbsp;</span>
            <span> {#if 6 + element.contractVol - element.tricks > 0} - {6 + element.contractVol - element.tricks} 
             {:else if  element.tricks - (6 + element.contractVol)  > 0} + {element.tricks - (6 + element.contractVol)}
             {:else}--- 
                   {/if} </span>
            <span style="font-size:12pt">  [{element.pc}  PC] ->  </span>
            <span>   {count_milton(element.side, element.contractVol,element.contractName,element.tricks,element.double,element.redouble,element.pc)} </span>

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

  <br />  <button on:click={czytajWyniki} style="align:center">Czytaj </button>
  {#if sumaNS>=10000 || sumaWE >=10000}
  <div><button on:click={reset} >restart gry </button></div>
{:else}
  <div><button on:click={reset} hidden>restart gry </button></div>
{/if}
    


</main>

<style>
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


#wygranyP {
  animation: blink 1s linear infinite;
  }
  @keyframes blink {
    50% {
      opacity: 0;
    }
}


</style>
 