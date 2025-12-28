import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
  console.log('handleFetch');
  const response = await fetch(request);
  return response;
};

