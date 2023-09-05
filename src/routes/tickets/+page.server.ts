import { fail, redirect } from '@sveltejs/kit';
import { currentUser, pb } from '$lib/pocketbase';
import { get } from "svelte/store";
export const actions: import('./$types').Actions = {
    createTicket: async ({request}) => {
        //Only keep logged-in users
        if(!pb.authStore.isValid) throw redirect(302, "/login"); 
        const ticket = await pb.collection("tickets").create({
            user: get(currentUser)?.id
        });
        if(!ticket) return fail(400, {});
        const ticketID = ticket.id;
        throw redirect(302, `/tickets/${ticketID}`);
    },
};

/** @type {import('./$types').LayoutServerLoad} */
export function load() {
    if(!pb.authStore.isValid) throw redirect(302, "/login"); 
  }