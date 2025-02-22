<script>
import { backend } from "$lib/canisters";

let values = {};
let globalPIN = "";

async function submitHandler() {
    await   backend.addPin(values.pin).then((response) => {
        globalPIN = response;
           }
         )
}
;
</script>    

Graj i wygrywaj !!!

podaj swój pin do gry:

<form action="#" on:submit|preventDefault={submitHandler}>
<input id="pin" alt="pin" type="text" bind:value={values.pin} style="height:28px;font-size:12pt;width:98px"/> 


<div><button type="submit">Dodaj PIN</button></div>

</form>

{globalPIN}