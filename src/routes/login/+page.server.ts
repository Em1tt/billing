import { TURNSTILE_SECRET } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import { currentUser, pb } from '$lib/pocketbase';
import { get } from "svelte/store";
export const actions: import('./$types').Actions = {
    default: async ({request, getClientAddress}) => {
        const data = await request.formData();
        const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();
        const turnstile = data.get("cf-turnstile-response")?.toString();
        if(!email || email == "") return fail(400, { emailData : { incorrect: true, message: "E-Mail can't be empty." }});
        if(!password || password == "") return fail(400, { passwordData: { incorrect: true, message: "Password can't be empty."}});

        const formData = new FormData();
        formData.append("secret", TURNSTILE_SECRET)
        formData.append("response", turnstile as string)
        formData.append('remoteip', getClientAddress());
        const result: Response = await fetch(url, {
            body: formData,
            method: 'POST',
        });
        const outcome = await result.json();
        if(!outcome.success) return fail(400, { turnstileData: { incorrect: true, message: "CAPTCHA failed! Please refresh this page."} });
        
        try{
            const user = await pb.collection("users").authWithPassword(email, password);
            console.log(user);
        }catch(e: unknown){
            console.log(e);
            return fail(400, { emailData : { incorrect: true, message: "E-Mail doesn't exist or password incorrect." } });
        }
        return {success: true};
    }
};

/** @type {import('./$types').LayoutServerLoad} */
export function load() {
    console.log("e");
  }