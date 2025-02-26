<script>


export let data;
let pin = data.pin; // Może być undefined, jeśli użytkownik jeszcze nie kliknął // Pobierz pin z query string, jeśli istnieje

let errorMessage = ''; // Dodaj zmienną dla błędów

  // async function handleSubmit(event) {
  //   event.preventDefault();
  //   const formData = new FormData(event.target);
  //   const pinInput = formData.get('pin');

  //   // Walidacja PIN (ta sama logika co w +page.server.js)
  //   if (!pinInput || pinInput.trim() === '') {
  //     errorMessage = 'PIN nie może być pusty';
  //     return;
  //   }
  //   if (!/^[a-zA-Z0-9-_]+$/.test(pinInput)) {
  //     errorMessage = 'PIN może zawierać tylko litery, cyfry i myślniki';
  //     return;
  //   }
  //   //method="POST" action="?/selectGameAndPin"
  //   try {
  //     const response = await fetch('?/selectGameAndPin', {
  //       method: 'POST',
  //       body: formData,
  //     });
  //     if (response.ok) {
  //       const redirectUrl = response.headers.get('location');
  //       if (redirectUrl) {
  //         window.location.href = redirectUrl; // Ręczne przekierowanie
  //       }
  //     } else {
  //       const text = await response.text();
  //       errorMessage = text || 'Wystąpił błąd podczas wysyłania formularza';
  //     }
  //   } catch (error) {
  //     errorMessage = 'Błąd sieciowy: ' + error.message;
  //   }
  //   // throw redirect(302, `/${gameType}?pin=${pin}`);
  // }

</script>    

<h1>Gry karciane</h1>
{#if pin}
<p>Twój poprzedni PIN: {pin}</p>
{/if}

<form method="POST" action="?/selectGameAndPin"> 
  <!-- <form on:submit={handleSubmit}> -->
  {#if errorMessage}
    <p style="color: red">{errorMessage}</p>
  {/if}
  <label for="pin">Zdefiniuj swój pin:</label>
  <input id="pin" name="pin" alt="pin" type="text" style="height:28px;font-size:12pt;width:98px"/> 

  <label for="gameType">Wybierz grę:</label>
  <select name="gameType" id="gameType">
    <option value="bridge">Brydż</option>
    <option value="canasta">Kanasta</option>
  </select>
  <button type="submit">Rozpocznij</button>
</form>

<style>
  h1 { font-size: 2em; text-align: center;  }
  form { max-width: 300px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; }
  label { display: block; margin-bottom: 10px; }
  select, button { width: 100%; padding: 8px; margin-top: 5px; }

</style>