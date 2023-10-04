import { serializeNonPOJOs } from '$lib/helpers';
import { error, fail, redirect } from '@sveltejs/kit';
 
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
  },
  sendMessage: async ({request, locals, params}) => {
    const data = await request.formData();
    const content = data.get("content");
    const ticket = data.get("ticket");
    try{
      await locals.pb.collection("tickets_messages").create({content, ticket, author: locals.pb.authStore.model?.id});
      await locals.pb.collection("tickets").update(params.slug, {status: 1});
    }catch(e){
      console.log(e);
    }
    return {success: true};
  },
  deleteMessage: async ({request, locals, params, url}) => {
    const id = url.searchParams.get("id");
    if(!id) return fail(404);
    try{
      await locals.pb.collection("tickets_messages").delete(id);
    }catch(e){
      console.log(e);
    }
    return {success: true};
  }
};

/** @type {import('./$types').LayoutServerLoad} */
export async function load({locals, params}) {
  if(!locals.pb.authStore.isValid) throw redirect(302, "/login");
  const ticket = await locals.pb.collection("tickets").getOne(params.slug, {expand: "user,priority,category"});
  const messages = await locals.pb.collection("tickets_messages").getList(1, 500, {expand: "author", sort: "-created", filter: `ticket="${params.slug}"`});
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
      messages: serializeNonPOJOs(messages)
  };
};