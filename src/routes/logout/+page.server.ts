import { redirect } from '@sveltejs/kit';
export const actions: import('./$types').Actions = {
    default: async ({locals}) => {
        locals.pb.authStore.clear();
        throw redirect(301, "/");
    }
};