<script>
import { backend } from "$lib/canisters";
import { labels } from '$lib/shared.svelte.js';

    let info = ""
   // let values = {};

    let labelNS = labels.labelNS
    let labelWE = labels.labelWE

    async function reset() {
    
    await backend.resetHand().then((response) => {
        info = response;
    }
    
    )};
 
    async function b_reset() {
    
    await backend.resetHand().then((response) => {
        info = response;
    }
    
    )};


    async function changeLabel() {
        labels.labelNS = pair1.value
        labels.labelWE = pair2.value
   };   
    
    </script>
    


    <form action="#" on:submit|preventDefault={changeLabel}>

        <label for="pair1">{labelNS}: </label>
        <input id="pair1"  alt="pair1" type="text"  style="height:28px; width:30px; font-size:11pt;"/>


         <label for="pair2">{labelWE}: </label>
        <input id="pair2" alt="pair2" type="text"  style="height:28px;width:30px; font-size:11pt;"/>
          <div><button type="submit">Zmień opis</button></div>

      </form>

<br />

    
<section>
    <button on:click={reset}>restart kanasta </button>
</section>

<section>
    <button on:click={b_reset}>restart brydź </button>
</section> 
{info}



    <style>
    section {
        font-size: 0.9rem;
        }
    </style>