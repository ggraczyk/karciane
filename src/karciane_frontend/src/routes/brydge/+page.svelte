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

async function czytajWyniki() {

  await backend.b_readHands().then((response) => {
                          wyniki = response;
                          sumaNS = 0;
                          sumaWE = 0;
        for (let i=0;i<wyniki.length; i++) {
          sumaNS += 0;
          sumaWE += wyniki[i].tricks;
	      };
        blokujDodaj=false;
  }
  
)};


  async function submitHandler() {
    blokujDodaj=true;
		try {
		//	await schema.validate(values, { abortEarly: false });
				errors = {};
       backend.b_addHand(side, selectedC , selectedV | 0, tricks | 0, double, redouble, values.miltons | 0 ).then((response) => {
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
onchange={() => (side = '')} style="height:28px;font-size:12pt;;width:60px"
>
{#each ["NS","WE"] as side}
  <option value={side}>
    {side}
  </option>
{/each}
</select>


<select
bind:value={selectedV}
onchange={() => (contractVol = '')} style="height:28px;font-size:12pt;;width:40px"
>
{#each [1,2,3,4,5,6,7] as contractVol}
  <option value={contractVol}>
    {contractVol}
  </option>
{/each}
</select>


    <select
		bind:value={selectedC}
		onchange={() => (contractName = '')} style="height:28px;font-size:12pt;;width:98px"
	>
		{#each ["trefl","karo","kier","pik","NT"] as contractName}
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
   {#each [0,1,2,3,4,5,6,7,8,9,10,11,12] as tricks}
     <option value={tricks}>
       {tricks}
     </option>
   {/each}
   </select>
<!-- 
    <input id="tricks" alt="tricks" type="text" bind:value={values.tricks} style="height:28px;font-size:12pt;width=8px"/> -->
    <span id="error">{#if errors.tricks}{errors.tricks}{/if}</span>
 <br/>
 Punktów:
 <input id="miltons" alt="miltons" type="text" bind:value={values.miltons} style="height:28px;font-size:12pt;;width:98px"/> 

    {#if blokujDodaj}
      <div><button type="submit" hidden>Dodaj</button></div>
    {:else}
      <div><button type="submit">Dodaj</button></div>
    {/if}
  </form>
  <br />



  <br /> 


<span >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{labelNS}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{labelWE}</span>


	<section id="wyniki">
    {#if wyniki.length>0}


    <div class= "array" >
      {#each wyniki as element, i (element)}

        <div animate:flip="{{ duration: 300 }}" out:scale="{{ duration: 250 }}" in:scale="{{ duration: 1250 }}">
          {#if wyniki.length - i < 5}
           <span id= "minusy">{#if element.ns<0}{"" + element.ns  }{/if}</span>
           <span          >{#if element.ns>=0}{"" + element.ns  }{/if}</span>
            { "............"  }
            <span id= "minusy">{#if element.we<0}{"" + element.we  }{/if}</span>
            <span          >{#if element.we>=0}{"" + element.we  }{/if}</span>
          {/if}
        </div>
      {/each}
<br />

     </div>  


    {/if}



  </section>
  
  <div id="suma" transition:blur={{ amount: 100,duration: 2900 }} >&nbsp;&nbsp;  &nbsp;&nbsp;
    <span id= "minusyP"   >{#if sumaNS<0}{"" + sumaNS  }{/if}</span>
    <span id= "pierwszyP">{#if sumaNS>=0 &&sumaNS<1500}{"" + sumaNS  }{/if}</span>
    <span id= "drugiP"   >{#if sumaNS>=1500 && sumaNS<3000}{"" + sumaNS  }{/if}</span>
    <span id= "trzeciP"  >{#if sumaNS>=3000 && sumaNS<5000}{"" + sumaNS  }{/if}</span>
    <span id= "czwartyP"  >{#if sumaNS>=5000 && sumaNS<7500}{"" + sumaNS  }{/if}</span>
    <span id= "piatyP"  >{#if sumaNS>=7500 && sumaNS<10000}{"" + sumaNS  }{/if}</span>
    <span id= "wygranyP"  >{#if sumaNS>=10000}{"" + sumaNS  }{/if}</span>
    ........
    
    <span id= "minusyP"   >{#if sumaWE<0}{"" + sumaWE  }{/if}</span>
    <span id= "pierwszyP">{#if sumaWE>=0 &&sumaWE<1500}{"" + sumaWE  }{/if}</span>
    <span id= "drugiP"   >{#if sumaWE>=1500 && sumaWE<3000}{"" + sumaWE  }{/if}</span>
    <span id= "trzeciP"  >{#if sumaWE>=3000 && sumaWE<5000}{"" + sumaWE  }{/if}</span>
    <span id= "czwartyP"  >{#if sumaWE>=5000 && sumaWE<7500}{"" + sumaWE  }{/if}</span>
    <span id= "piatyP"  >{#if sumaWE>=7500 && sumaWE<10000}{"" + sumaWE  }{/if}</span>
    <span id= "wygranyP"  >{#if sumaWE>=10000}{"" + sumaWE  }{/if}</span>  
  
  </div>
  <br />

  <div>

</div>
<div id="male">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<span id= "minusyP"  STYLE="font-size:0.9rem" >na 15</span>
<span id= "pierwszyP" STYLE="font-size:0.9rem">na 50</span>
<span id= "drugiP"   STYLE="font-size:0.9rem">na 90</span>
<span id= "trzeciP"  STYLE="font-size:0.9rem">na 120</span>
<span id= "czwartyP"  STYLE="font-size:0.9rem">na 150</span>
<span id= "piatyP" STYLE="font-size:0.9rem" >na kanastę</span>
</div>

  <br />  <button on:click={czytajWyniki} style="align:center">Czytaj </button>
  {#if sumaNS>=10000 || sumaWE >=10000}
  <div><button on:click={reset} >restart gry </button></div>
{:else}
  <div><button on:click={reset} hidden>restart gry </button></div>
{/if}
    


</main>

<style>
#wyniki {
  margin: 10px auto;
  padding: 10px 60px;
  border: 1px dashed #222;
  background-color:antiquewhite;
  justify-content: center;
}


#suma {
  color: #e00b0b;
  font-size: 2.0rem;
  background-color:rgb(98, 215, 176);
  /* border: 1px solid #222; */
}

#male {
  font-family: "Montserrat", sans-serif;
  font-size: 0.5rem;
}

#minusy {
  color: #e00b0b;
}
#minusyP {
  background-color: #c2b6f5;
}
#pierwszyP {
  background-color:rgb(98, 215, 176);
}

#drugiP {
  background-color: #9ced9b;
}

#trzeciP {
  background-color: #c8cf7b;
}

#czwartyP {
  background-color: #e5ca8a;
}

#piatyP {
  background-color: #f39b8e;
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
 