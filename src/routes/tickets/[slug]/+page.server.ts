import { serializeNonPOJOs } from '$lib/helpers';
import { error, redirect } from '@sveltejs/kit';
 
export const actions: import('./$types').Actions = {
  close: async ({request, locals, params}) => {
    try {
      locals.pb.collection("tickets").update(params.slug, {status: 4});
    }catch(e){
      e;
    }
    return {success: true};
  },
  open: async ({request, locals, params}) => {
    try {
      locals.pb.collection("tickets").update(params.slug, {status: 1});
    }catch(e){
      e;
    }
    return {success: true};
  }
};

/** @type {import('./$types').LayoutServerLoad} */
export async function load({locals, params}) {
  if(!locals.pb.authStore.isValid) throw redirect(302, "/login");
  const ticket = await locals.pb.collection("tickets").getOne(params.slug, {expand: "user,priority,category"});
  if(!ticket) throw error(404);
  if(ticket.status == 0) throw redirect(303, `/tickets/${ticket.id}/edit`);
  let priorities, categories;
  try{
    priorities = await locals.pb.collection("ticket_priorities").getList(0, 50);
    categories = await locals.pb.collection("ticket_categories").getList(0, 50);
  }catch(e){
    e;
  }
  const token = await locals.pb.files.getToken();
  return {
      token,
      ticket: serializeNonPOJOs(ticket),
      priorities: priorities ? serializeNonPOJOs(priorities?.items.map(i => { return {id: i.id, name: i.name}})) : [],
      categories: categories ? serializeNonPOJOs(categories?.items.map(i => { return {id: i.id, name: i.name}})) : [],
  };
};