export const onRequestGet = () =>
  new Response(JSON.stringify({ status: 'OK', data: 'Hello' }), {
    headers: { 'Content-Type': 'application/json' }
  });
