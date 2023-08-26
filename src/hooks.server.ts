import { currentUser } from '$lib/pocketbase';
import { get } from 'svelte/store';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    event.locals.currentUser = get(currentUser);
    const response = await resolve(event);

    return response;
  }