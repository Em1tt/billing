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
    console.log(formData);
    try{
      await locals.pb.collection("tickets").update(params.slug, {attachments: null});
      console.log(formData);
      const res = await locals.pb.collection("tickets").update(params.slug, formData);
      console.log(res);
    }catch(e){
      console.error(e);
    }
  }
};

/** @type {import('./$types').LayoutServerLoad} */
export async function load({locals, url, params}) {
  if(!locals.pb.authStore.isValid) throw redirect(302, "/login");
  const token = await locals.pb.files.getToken();
  const ticket = await locals.pb.collection("tickets").getOne(params.slug, {expand: "user"});
  if(!ticket) throw error(404);
  return {
      token,
      ticket: serializeNonPOJOs(ticket)
  };
};