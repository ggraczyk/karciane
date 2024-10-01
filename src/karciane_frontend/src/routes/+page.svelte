<script>
  import "../index.scss";
  import { backend } from "$lib/canisters";

  let greeting = "";

   function onSubmit(event) {
    const name = event.target.name.value;
    backend.greet(name).then((response) => {
      greeting = response;
    });
    return false;
  }

  $: console.log({greeting});

</script>

<main>
  
  <br />
  <br />
  <form action="#" on:submit|preventDefault={onSubmit} >
    <label for="name">Wynik WE: &nbsp;</label>
    <input id="name" alt="Name" type="text" required />
    <button type="submit">Click Me!</button>
  </form>
  <section id="greeting">{greeting}</section>

</main>
 