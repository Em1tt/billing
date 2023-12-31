import { serializeNonPOJOs } from '$lib/helpers';
import { fail, redirect } from '@sveltejs/kit';

export const actions: import('./$types').Actions = {
    createTicket: async ({locals}) => {
        //Only keep logged-in users
        if(!locals.pb.authStore.isValid) throw redirect(302, "/login"); 
        if(!locals.user) throw redirect(302, "/login");
        const ticket = await locals.pb.collection("tickets").create({
            user: locals.user.id
        });
        if(!ticket) return fail(400, {});
        const ticketID = ticket.id;
        throw redirect(302, `/tickets/${ticketID}/edit`);
        
    },
    removeTickets: async({locals, request}) => {
        if(!locals.pb.authStore.isValid) throw redirect(302, "/login");
        if(!locals.user) throw redirect(302, "/login");

        const formData = await request.formData();
        const data = Array.from(formData).map(checkbox => checkbox[0]).filter(i => i != "select-all");
        for(let i = 0; i < data.length; i++){
            await locals.pb.collection("tickets").delete(data[i]);
        };
        return {success: true};
    },
    getMoreTickets: async({locals, request}) => {
        const data = await request.formData()
        const page = data.get("page")?.toString();
        if(!page) return fail(400);
        if(isNaN(parseInt(page))) return fail(400);
        const tickets = await locals.pb.collection("tickets").getList(parseInt(page), 10, {expand: "category,priority", sort: "-created"});
        if(!tickets.items.length) return fail(404);
        return {
            tickets: serializeNonPOJOs(tickets)
        }
    }
};
/** @type {import('./$types').LayoutServerLoad} */
export async function load({locals, url}) {
    if(!locals.pb.authStore.isValid) throw redirect(302, "/login");
    const tickets = await locals.pb.collection("tickets").getList(1, 10, {expand: "category,priority", sort: "-created"});
    return {
        tickets: serializeNonPOJOs(tickets)
    }
  }

  