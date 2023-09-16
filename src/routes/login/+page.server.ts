import { TURNSTILE_SECRET } from '$env/static/private';
import { PUBLIC_DEV, PUBLIC_TURNSTILE_URL } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';

export const actions: import('./$types').Actions = {
    default: async ({request, getClientAddress, locals}) => {
        const data = await request.formData();

        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();
        const turnstile = data.get("cf-turnstile-response")?.toString();

        if(!email || email == "") return fail(400, { emailData : { incorrect: true, message: "E-Mail can't be empty." }});
        if(!password || password == "") return fail(400, { passwordData: { incorrect: true, message: "Password can't be empty."}});

        const formData = new FormData();
        if(PUBLIC_DEV != "true") {
            formData.append("secret", TURNSTILE_SECRET)
            formData.append("response", turnstile as string)
            formData.append('remoteip', getClientAddress());
            const result: Response = await fetch(PUBLIC_TURNSTILE_URL, {
                body: formData,
                method: 'POST',
            });
            const outcome = await result.json();
            if(!outcome.success) return fail(400, { turnstileData: { incorrect: true, message: "CAPTCHA failed! Please refresh this page."} });
        }
        try{
            await locals.pb.collection("users").authWithPassword(email, password);
        }catch(e: unknown){
            return fail(400, { emailData : { incorrect: true, message: "E-Mail doesn't exist or password incorrect." } });
        }
        throw redirect(303, "/");
    }
};

/** @type {import('./$types').LayoutServerLoad} */
export function load({locals}) {
    if(locals.pb.authStore.isValid) throw redirect(302, "/");
  }