<script>
 import "../../index.scss";
  import { backend } from "$lib/canisters";
  import * as yup from 'yup';
  import { fade, blur, fly, slide, scale, draw , crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
  import { labels } from '$lib/shared.svelte.js';

  let minusNS = false;
  let minusWE = false;
  let minNS=1;
  let minWE=1;
  let values = {};
	let errors = {};
  let sumaNS = 0;
  let sumaWE = 0;
  let blokujDodaj = false;
  let labelNS = labels.labelNS;
  let labelWE = labels.labelWE;

  const sleep = ms => new Promise(f => setTimeout(f, ms));

    const schema = yup.object().shape({
      pair1: yup.string().required("uzupełnij pole").matches(/^[-,0-9]+5$|0$/,
                            "źle!"),
      pair2: yup.string().required("uzupełnij pole").matches(/^[-,0-9]+5$|0$/,
                            "źle!"),
    });

  
  let greeting = "";
  let wyniki = [] ;
  
 
   function extractErrors(err) {
		return err.inner.reduce((acc, err) => {
			return { ...acc, [err.path]: err.message };
		}, {});
    
	}

  async function reset() {
    
    await backend.resetHand().then((response) => {
        //info = response;
        czytajWyniki();
    }
    
    )};

async function czytajWyniki() {

  await backend.readHands().then((response) => {
                          wyniki = response;
                          sumaNS = 0;
                          sumaWE = 0;
        for (let i=0;i<wyniki.length; i++) {
          sumaNS += wyniki[i].ns;
          sumaWE += wyniki[i].we;
	      };
        blokujDodaj=false;
  }
  
)};


  async function submitHandler() {
    blokujDodaj=true;
		try {
			// `abortEarly: false` to get all the errors
			await schema.validate(values, { abortEarly: false });
			//alert(JSON.stringify(values, null, 2));
			errors = {};
      minNS=1;
      minWE=1; 
            //backend.addHand(pair1.value ,pair2.value ).then((response) => { //https://www.geeksforgeeks.org/convert-a-string-to-an-integer-in-javascript/
      
      if (minusNS) {minNS=-1}
      if (minusWE) {minWE=-1}      
      backend.addHand(minNS * pair1.value , minWE * pair2.value ).then((response) => {
        greeting = response;
      });
      await sleep(4000);
      await czytajWyniki();
      pair1.value = null;
      pair2.value =null;
  
		} catch (err) {
      blokujDodaj=false;
			errors = extractErrors(err);
		}

	}


  //$:  console.log(JSON.stringify(wyniki.toString(), null, 2));

</script>

<main>
  
  <br />

  <form action="#" on:submit|preventDefault={submitHandler}>
    <label for="pair1">Wynik {labelNS}: </label>
    <input type="checkbox" bind:checked={minusNS}  /> minus
    <input id="pair1"  alt="pair1" type="number" bind:value={values.pair1} style="height:28px;font-size:11pt;width:60px"/>
    <span id="error">{#if errors.pair1}{errors.pair1}{/if}</span> <br />
     <label for="pair2">Wynik {labelWE}: </label>
     <input type="checkbox" bind:checked={minusWE} /> minus
    <input  id="pair2" alt="pair2" type="number" bind:value={values.pair2} style="height:28px;font-size:11pt;width:60px"/>
    <span id="error">{#if errors.pair2}{errors.pair2}{/if}</span>
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
            { ".........."  }
            <span id= "minusy">{#if element.we<0}{"" + element.we  }{/if}</span>
            <span          >{#if element.we>=0}{"" + element.we  }{/if}</span>
          {/if}
        </div>
      {/each}
<br />

     </div>  


    {/if}



  </section>
  
  <div id="suma" transition:blur={{ amount: 100,duration: 2900 }} >&nbsp;&nbsp; 
    <span >{#if sumaNS<0}{"" + sumaNS  }   <span STYLE="font-size:0.8rem" > 15</span>  {/if} </span>
    <span >{#if sumaNS>=0 &&sumaNS<1500}{"" + sumaNS  } <span id= "pierwszyP" STYLE="font-size:0.8rem"> 50</span> {/if}</span>
    <span >{#if sumaNS>=1500 && sumaNS<3000}{"" + sumaNS  }<span  STYLE="font-size:0.8rem"> 90</span>{/if}</span>
    <span >{#if sumaNS>=3000 && sumaNS<5000}{"" + sumaNS  }<span  STYLE="font-size:0.8rem"> 120</span>{/if}</span>
    <span >{#if sumaNS>=5000 && sumaNS<7500}{"" + sumaNS }<span  STYLE="font-size:0.8rem"> 150</span>{/if}</span>
    <span >{#if sumaNS>=7500 && sumaNS<10000}{"" + sumaNS  }<span  STYLE="font-size:0.8rem"> kanastę</span>{/if}</span>
    <span >{#if sumaNS>=10000}{"" + sumaNS  }{/if}</span>
    ....
    
    <span >{#if sumaWE<0}{"" + sumaWE  } <span  STYLE="font-size:0.8rem" > 15</span> {/if} </span>
    <span >{#if sumaWE>=0 &&sumaWE<1500}{"" + sumaWE  }<span id= "pierwszyP" STYLE="font-size:0.8rem"> 50</span> {/if}</span>
    <span >{#if sumaWE>=1500 && sumaWE<3000}{"" + sumaWE  }<span  STYLE="font-size:0.8rem"> 90</span>{/if}</span>
    <span >{#if sumaWE>=3000 && sumaWE<5000}{"" + sumaWE  }<span  STYLE="font-size:0.8rem"> 120</span>{/if}</span>
    <span >{#if sumaWE>=5000 && sumaWE<7500}{"" + sumaWE  }<span  STYLE="font-size:0.8rem"> 150</span>{/if}</span>
    <span >{#if sumaWE>=7500 && sumaWE<10000}{"" + sumaWE  }<span  STYLE="font-size:0.8rem"> kanastę</span>{/if}</span>
    <span >{#if sumaWE>=10000}{"" + sumaWE  }{/if}</span>  
  
  </div>
  <br />

  <div>

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
 