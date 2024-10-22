<script>
  import "../index.scss";
  import { backend } from "$lib/canisters";
  import * as yup from 'yup';
  import { fade, blur, fly, slide, scale, draw , crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

  let values = {};
	let errors = {};
  let sumaNS = 0;
  let sumaWE = 0;
  let blokujDodaj = false;
 
  const sleep = ms => new Promise(f => setTimeout(f, ms));

    const schema = yup.object().shape({
      pair1: yup.string().required("uzupełnij pole").matches(/^[-,0-9]+5$|0$/,
                            "źle!"),
      pair2: yup.string().required("uzupełnij pole").matches(/^[-,0-9]+5$|0$/,
                            "źle!"),
    });

  //dfx canister call karciane_backend readHands 
  
  let greeting = "";
  let wyniki = [] ;
  
 
  //  function onSubmit(event) {

  //   alert(JSON.stringify(values));

  //   const name = event.target.name.value;
  //   backend.greet(pair1).then((response) => {
  //     greeting = response;
  //   });
   
  //   return false;
  // }


  function extractErrors(err) {
		return err.inner.reduce((acc, err) => {
			return { ...acc, [err.path]: err.message };
		}, {});
    
	}


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
      //backend.addHand(pair1.value ,pair2.value ).then((response) => { //https://www.geeksforgeeks.org/convert-a-string-to-an-integer-in-javascript/
      
      backend.addHand(pair1.value | 0, pair2.value | 0).then((response) => {
        greeting = response;
      });
      await sleep(4000);
      await czytajWyniki();
  
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
    <label for="pair1">Wynik WE: </label>
    <input id="pair1" alt="pair1" type="text" bind:value={values.pair1}/>
    <span>{#if errors.pair1}{errors.pair1}{/if}</span>
     <label for="pair2">Wynik NS: </label>
    <input id="pair2" alt="pair2" type="text" bind:value={values.pair2}/>
    <span>{#if errors.pair2}{errors.pair2}{/if}</span>
    {#if blokujDodaj}
      <div><button type="submit" hidden>Dodaj</button></div>
    {:else}
      <div><button type="submit">Dodaj</button></div>
    {/if}
  </form>
  <br />



  <br /> 


  <!-- {@debug wyniki}   -->

  <!--  nie nie tędy droga
  
  {#await wyniki}
	<p>...waiting</p>
{:then wyniki}
	<p>The number is {wyniki}</p>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await} -->





	<section id="wyniki">
    {#if wyniki.length>0}
		<!-- Wyniki: {JSON.stringify(wyniki, null, 2)}  -->

    <!-- {#each wyniki as element, i (element)}
       {element.ns}
    {/each} -->


    <div class= "array" >
      {#each wyniki as element, i (element)}

        <div animate:flip="{{ duration: 300 }}" out:scale="{{ duration: 250 }}" in:scale="{{ duration: 1250 }}">
          {#if wyniki.length - i < 5}
           <span id= "minusy">{#if element.ns<0}{"" + element.ns  }{/if}</span>
           <span          >{#if element.ns>=0}{"" + element.ns  }{/if}</span>
            { "........."  }
            <span id= "minusy">{#if element.we<0}{"" + element.we  }{/if}</span>
            <span          >{#if element.we>=0}{"" + element.we  }{/if}</span>
          {/if}
        </div>
      {/each}
<br />

     </div>  


    {/if}



  </section>
  
  <div id="suma" transition:blur={{ amount: 100,duration: 2900 }} >&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
    <span id= "minusyP"   >{#if sumaNS<=0}{"" + sumaNS  }{/if}</span>
    <span id= "pierwszyP">{#if sumaNS>0 &&sumaNS<1500}{"" + sumaNS  }{/if}</span>
    <span id= "drugiP"   >{#if sumaNS>=1500 && sumaNS<3000}{"" + sumaNS  }{/if}</span>
    <span id= "trzeciP"  >{#if sumaNS>=3000 && sumaNS<5000}{"" + sumaNS  }{/if}</span>
    <span id= "wygranyP"  >{#if sumaNS>=5000}{"" + sumaNS  }{/if}</span>
    ........
    
    <span id= "minusyP"   >{#if sumaWE<0}{"" + sumaWE  }{/if}</span>
    <span id= "pierwszyP">{#if sumaWE>=0 &&sumaWE<1500}{"" + sumaWE  }{/if}</span>
    <span id= "drugiP"   >{#if sumaWE>=1500 && sumaWE<3000}{"" + sumaWE  }{/if}</span>
    <span id= "trzeciP"  >{#if sumaWE>=3000 && sumaWE<5000}{"" + sumaWE  }{/if}</span>
    <span id= "wygranyP"  >{#if sumaWE>=5000}{"" + sumaWE  }{/if}</span>  
  
  </div>
  <br />

  <div>
  <button on:click={czytajWyniki} >
    Czytaj 
</button>
</div>
<span id= "minusyP"   font-size=10px >na 15</span>
<span id= "pierwszyP">na 50</span>
<span id= "drugiP"   >na 90</span>
<span id= "trzeciP"  >na 120</span>
<span id= "czwartyP"  >na 150</span>
<span id= "piatyP"  >na kanastę</span>

  <br /><br />
</main>

<style>
#wyniki {
  margin: 10px auto;
  padding: 10px 60px;
  border: 1px solid #222;
  background-color:antiquewhite;
  justify-content: center;
}


#suma {
  color: #e00b0b;
  font-family: "Montserrat", sans-serif;
  font-size: 1.5rem;
  background-color:whitesmoke;
  border: dashed;
}

#minusy {
  color: #e00b0b;
}
#minusyP {
  background-color: #8871ee;
}
#pierwszyP {
  background-color:rgb(90, 221, 231);
}

#drugiP {
  background-color: #37e334;
}

#trzeciP {
  background-color: #d0d536;
}

#czwartyP {
  background-color: #e7ab1e;
}

#piatyP {
  background-color: #ec8123;
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
 