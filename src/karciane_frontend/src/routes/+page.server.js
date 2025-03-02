import { redirect, error, json } from '@sveltejs/kit';
import { backend } from '$lib/canisters';

//export const load = ({ cookies }) => {
 // let pin = cookies.get('game_pin');




//  export const load = ({ url }) => {
//   let pin = url.searchParams.get('pin'); // Pobierz pin z query string
//   return { pin }; // Zwracaj istniej¹cy PIN lub undefined, jeœli brak
// };

export async function load({ url }) {
  const pin = url.searchParams.get('pin') || 'pin-default';
  try {
    const wyniki = await backend.b_readHands();
    return {
      pin,
      wyniki
    };
  } catch (err) {
    console.error('B??d w load:', err);
    // Zamiast zwraca? b??d, który prowadzi do zap?tlonego od?wie?ania,
    // zwró? puste wyniki i status b??du
    return {
      pin,
      wyniki: [],
      error: 'Nie uda?o si? za?adowa? danych z backendu: ' + err.message
    };
  }
}



export const actions = {
  //selectGameAndPin: async ({ request, cookies }) => {
    selectGameAndPin: async ({ request }) => {

      const formData = await request.formData();
      const gameType = formData.get('gameType');
      const pin = formData.get('pin');

      // Loguj dane dla debugowania
     // console.log('Otrzymane dane formularza:', { gameType, pin });

      // Walidacja PIN
      // if (!pin || pin.trim() === '') {
      //   throw error(400, 'PIN nie mo?e by? pusty');
      // }
      // if (!/^[a-zA-Z0-9-]+$/.test(pin)) {
      //   throw error(400, 'PIN mo?e zawiera? tylko litery, cyfry i my?lniki');
      // }

      // Ustaw ciasteczko z PIN
      // i ile ustawianie ciasteczka jest ok, o tyle dalsze próby odczytu baardzo skoplikowane CSR, co siedziej na kliencie co na serwerze itp
      // ogólnie wiêcej k³opotów ni¿ po¿ytku
      //cookies.set('game_pin', pin, { path: '/', maxAge: 60 * 60 * 24 * 30 });

      // Loguj przed przekierowaniem
      //console.log('Przekierowanie do:', `/${gameType}?pin=${pin}`);


      //dlatego piny bêd¹ utzrymywane za pomoc¹ parametrtów 
      throw redirect(302, `/${gameType}?pin=${pin}`);
    } 
};

export const prerender = false;