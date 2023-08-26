import { pb } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';
export const actions: import('./$types').Actions = {
    default: async () => {
        pb.authStore.clear();
        console.log(pb.authStore.clear());
        throw redirect(301, "/");
    }
};