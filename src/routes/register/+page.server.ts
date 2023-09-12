import { TURNSTILE_SECRET } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import {pb} from "$lib/pocketbase";

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({request, getClientAddress}) => {
        const data = await request.formData();
        const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const name = data.get("name")?.toString()
        const email = data.get("email")?.toString()
        const password = data.get("password")?.toString()
        const passwordConfirm = data.get("passwordConfirm")?.toString();
        const turnstile = data.get("cf-turnstile-response")?.toString();
        if(!name || name == "") return fail(400, { nameData: { incorrect: true, message: "Name can't be empty."}});
        if(!email || email == "") return fail(400, { emailData : { incorrect: true, message: "E-Mail can't be empty." }});
        if(!password || password == "") return fail(400, { passwordData: { incorrect: true, message: "Password can't be empty."}});
        if(!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) return fail(400, { passwordData: { incorrect: true, message: "All of the requirements have to be met."}});
        if(passwordConfirm != password) return fail(400, { passwordConfirmData: {incorrect: true, message: "Passwords do not match."} });

        const formData = new FormData();
        formData.append("secret", TURNSTILE_SECRET)
        formData.append("response", turnstile as string)
        formData.append('remoteip', getClientAddress());
        const result = await fetch(url, {
            body: formData,
            method: 'POST',
        });
        const outcome = await result.json();
        if(!outcome.success) return fail(400, { turnstileData: { incorrect: true, message: "CAPTCHA failed! Please refresh this page."} });
        try{
            await pb.collection("users").create({
                email,
                name,
                password,
                passwordConfirm,
                pid: 0
            });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }catch(e: any){
            const emailError = e?.response?.data?.email;
            if(emailError) return fail(400, { emailData : { incorrect: true, message: "E-Mail is already in use." } });
        }
        return {success: true};
    }
}

/** @type {import('./$types').LayoutServerLoad} */
export function load() {
    if(pb.authStore.isValid) throw redirect(302, "/");
  }