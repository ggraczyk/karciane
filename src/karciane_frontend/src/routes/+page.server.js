javascript
import { redirect } from '@sveltejs/kit';

export const load = ({ cookies }) => {
  let pin = cookies.get('game_pin');
  if (!pin) {
    pin = 'pin-' + Math.random().toString(36).substring(2, 15);
    cookies.set('game_pin', pin, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  }
  return { pin };
};

export const actions = {
  selectGame: async ({ request, cookies }) => {
    const formData = await request.formData();
    const gameType = formData.get('gameType');
    const pin = cookies.get('game_pin');
    throw redirect(302, `/${gameType}?pin=${pin}`);
  }
};
