import { serializeNonPOJOs } from '$lib/helpers';
import { error, redirect } from '@sveltejs/kit';
 
export const actions: import('./$types').Actions = {
  default: async ({request, locals, params}) => {
    const data = await request.formData();
    const files = data.getAll("files") as Array<File>;
    const formData = new FormData();
    for (const file of files) {
      if(file.name == "undefined") continue;
      console.log(file);
      formData.append('attachments', file);
    }
    const subject = data.get("subject");
    const content = data.get("content");
    let priority = data.get("priority");
    let category = data.get("category");
    const textLength = data.get("contentLength") as string;
    if(priority == "null"){
      priority = null;
    }
    if(category == "null"){
      category = null;
    }
    let status = 0;
    try{
      await locals.pb.collection("tickets").update(params.slug, {attachments: null, subject, text: content, priority, category});
      await locals.pb.collection("tickets").update(params.slug, formData);
    }catch(e){
      console.error(e);
    }
    if(subject == ""){
      return {
        subject: "Cannot be empty"
      }
    }
    if(parseInt(textLength) < 40){
      return {
        text: "Cannot be empty"
      }
    }
    if(priority == ''){
      return {
        priority: "Cannot be empty"
      }
    }
    if(category== ''){
      return {
        category: "Cannot be empty"
      }
    }
    status = 1;
    try{
      await locals.pb.collection("tickets").update(params.slug, {status});
    }catch(e){
      e;
    }
    return {success: true}
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