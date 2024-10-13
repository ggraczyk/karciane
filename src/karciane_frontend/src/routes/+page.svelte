<script>
  import "../index.scss";
  import { backend } from "$lib/canisters";
  import * as yup from 'yup';
  import { fade, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';

  let values = {};
	let errors = {};

    const schema = yup.object().shape({
      pair1: yup.string().required("uzupełnij pole").matches(/^[-,0-9]+5$|0$/,
                            "źle!"),
      pair2: yup.string().required("uzupełnij pole").matches(/^[-,0-9]+5$|0$/,
                            "źle!"),
    });

  //dfx canister call karciane_backend readHands 
  
  let greeting = "";
  let wyniki = [] ;
  
 
  const data = [ { id: 1, name: 'Alice', age: 30 }, { id: 2, name: 'Bob', age: 25 }];

   function onSubmit(event) {

    alert(JSON.stringify(values));

    const name = event.target.name.value;
    backend.greet(pair1).then((response) => {
      greeting = response;
    });
    return false;
  }


  function extractErrors(err) {
		return err.inner.reduce((acc, err) => {
			return { ...acc, [err.path]: err.message };
		}, {});
	}

async function czytajWyniki() {
  await backend.readHands().then((response) => {
   //await backend.greet(pair1.value ,pair2.value).then((response) => {
                                  wyniki = response;
                                 // wyniki = [...wyniki, response];
                                  //wyniki = wyniki;
                                });
}


  async function submitHandler() {
		try {
			// `abortEarly: false` to get all the errors
			await schema.validate(values, { abortEarly: false });
			//alert(JSON.stringify(values, null, 2));
			errors = {};
      //backend.addHand(pair1.value ,pair2.value ).then((response) => { //https://www.geeksforgeeks.org/convert-a-string-to-an-integer-in-javascript/
      
      backend.addHand(pair1.value | 0, pair2.value | 0).then((response) => {
        greeting = response;
      });
  
		} catch (err) {
			errors = extractErrors(err);
		}

  

	}


//  $:  console.log(JSON.stringify(wyniki, null, 2));

</script>

<main>
  
  <br />
  <br />
  <form action="#" on:submit|preventDefault={submitHandler}>
    <label for="pair1">Wynik WE: &nbsp;</label>
    <input id="pair1" alt="pair1" type="text" bind:value={values.pair1}/>
    <span>{#if errors.pair1}{errors.pair1}{/if}</span>
    <label for="pair2">Wynik NS: &nbsp;</label>
    <input id="pair2" alt="pair2" type="text" bind:value={values.pair2}/>
    <span>{#if errors.pair2}{errors.pair2}{/if}</span>
    <button type="submit">Dodaj</button>
  </form>
  <br />

  <button on:click={czytajWyniki}>
	    Czytaj 
  </button>

  <br /> 

<!-- 
  {@debug wyniki}   -->

  <!--  nie nie tędy droga
  
  {#await wyniki}
	<p>...waiting</p>
{:then wyniki}
	<p>The number is {wyniki}</p>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await} -->


<div class= "array">
	{#each wyniki as element, i (element)}
		<div animate:flip="{{ duration: 300 }}" out:scale="{{ duration: 250 }}" in:scale="{{ duration: 250 }}" class="element">{element}</div>
	{/each}
</div>

	<section id="wyniki">
    {#if wyniki.length>0}
		Wyniki: {JSON.stringify(wyniki, null, 2)}

    {/if}
	</section>

  <br />
  <br />
</main>
 