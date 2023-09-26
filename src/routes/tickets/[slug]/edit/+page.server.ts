import { serializeNonPOJOs } from '$lib/helpers';
import { error, redirect } from '@sveltejs/kit';
 
export const actions: import('./$types').Actions = {
  default: async ({request, locals, params}) => {
    const data = await request.formData();
    const files = data.getAll("files") as Array<File>;
    console.log(files);
    const formData = new FormData();
    if(files){
      for (const file of files) {
        if(file.name == "undefined") continue;
        formData.append('attachments', file);
      }
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
    try{
      await locals.pb.collection("tickets").update(params.slug, {subject, text: content, priority, category});
      if(files){
      await locals.pb.collection("tickets").update(params.slug, {attachments: null});
      await locals.pb.collection("tickets").update(params.slug, formData);
      }
    }catch(e){
      console.error(e);
    }
    if(subject == ""){
      return {
        subject: "Cannot be empty"
      }
    }
    if(parseInt(textLength) < 10){
      return {
        text: "Cannot be less than 10 characters long"
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
    try{
      await locals.pb.collection("tickets").update(params.slug, {status: 1});
    }catch(e){
      e;
    }
    return {success: true}
  }
};

/** @type {import('./$types').LayoutServerLoad} */
export async function load({locals, url, params}) {
  if(!locals.pb.authStore.isValid) throw redirect(302, "/login");
  const token = await locals.pb.files.getToken();
  const ticket = await locals.pb.collection("tickets").getOne(params.slug, {expand: "user,priority,category"});
  let priorities, categories;
  try{
    priorities = await locals.pb.collection("ticket_priorities").getList(0, 50);
    categories = await locals.pb.collection("ticket_categories").getList(0, 50);
  }catch(e){
    e;
  }
  if(!ticket) throw error(404);
  return {
      token,
      ticket: serializeNonPOJOs(ticket),
      priorities: priorities ? serializeNonPOJOs(priorities?.items.map(i => { return {id: i.id, name: i.name}})) : [],
      categories: categories ? serializeNonPOJOs(categories?.items.map(i => { return {id: i.id, name: i.name}})) : [],
  };
};