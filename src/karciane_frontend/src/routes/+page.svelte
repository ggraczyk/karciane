<script>
  import "../index.scss";
  import { backend } from "$lib/canisters";
  import * as yup from 'yup';

  let values = {};
	let errors = {};

    const schema = yup.object().shape({
      pair1: yup.string().required("uzupełnij pole").matches(/^[-,0-9]+5$|0$/,
                            "źle!"),
      pair2: yup.string().required("uzupełnij pole").matches(/^[-,0-9]+5$|0$/,
                            "źle!"),
    });

   
  
  let greeting = "";

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

  async function submitHandler() {
		try {
			// `abortEarly: false` to get all the errors
			await schema.validate(values, { abortEarly: false });
			//alert(JSON.stringify(values, null, 2));
			errors = {};
		} catch (err) {
			errors = extractErrors(err);
		}


	}


  // $: console.log({greeting});

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
  
  <section id="greeting">{greeting}</section>

</main>
 