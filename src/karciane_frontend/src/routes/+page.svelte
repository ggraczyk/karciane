<script>
  import "../index.scss";
  import { backend } from "$lib/canisters";
  import * as yup from 'yup';

  let values = {};
	let errors = {};

    const schema = yup.object().shape({
      name: yup.string().required("uzupełnij pole").matches(/^[-,0-9]+5$|0$/,
                            "tylko liczby podzielne przez 5!"
    ),
    });

   
  
  let greeting = "";

   function onSubmit(event) {

    alert(JSON.stringify(values));

    const name = event.target.name.value;
    backend.greet(name).then((response) => {
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
    <label for="name">Wynik WE: &nbsp;</label>
  
    <input id="name" alt="Name" type="text" bind:value={values.name}/>
    <span>{#if errors.name}{errors.name}{/if}</span>
    <button type="submit">Click Me!</button>
  </form>
  
  <section id="greeting">{greeting}</section>

</main>
 