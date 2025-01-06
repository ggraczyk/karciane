<script>

let values = {};
let greeting = "";

async function addPin(pin) {
    values.pin = pin;
    await   backend.addPin(pin ).then((response) => {
         greeting = response;
    }
)};
</script>    

Graj i wygrywaj !!!

podaj swój pin do gry:

<form action="#" on:submit|preventDefault={addPin}>
<input id="pin" alt="pin" type="text" bind:value={values.pin} style="height:28px;font-size:12pt;width:98px"/> 


<div><button type="submit">Dodaj PIN</button></div>

</form>

{greeting}