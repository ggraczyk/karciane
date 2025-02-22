<script>
  export let data;
  let pin = data.pin;
</script>

<h1>Gry karciane</h1>
<p>Twój PIN: {pin}</p>
<form method="POST" action="?/selectGame">
  <label>Wybierz grę:</label>
  <select name="gameType">
    <option value="bridge">Brydż</option>
    <option value="canasta">Kanasta</option>
  </select>
  <button type="submit">Rozpocznij</button>
</form>

<style>
  h1 { font-size: 2em; text-align: center; }
  form { max-width: 300px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; }
  label { display: block; margin-bottom: 10px; }
  select, button { width: 100%; padding: 8px; margin-top: 5px; }
</style>
