import { serializeNonPOJOs } from '$lib/helpers.js';

export const ssr = true;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
    try{
        if(locals.pb.authStore.isValid){
            try{
            await locals.pb.collection("users").authRefresh();
            }catch(e){
                locals.pb.authStore.clear();
            }
        }
    }catch(e){
        console.log(e);
    };
    if (locals.user){
        return {
            user: serializeNonPOJOs(locals.user)
        }
    }
    return {
        user: null
    };
  }