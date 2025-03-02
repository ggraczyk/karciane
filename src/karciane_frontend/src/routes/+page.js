export async function load({ url }) {
    const pin = url.searchParams.get('pin') || 'pin-default';
    return {
      pin: pin
    };
  }