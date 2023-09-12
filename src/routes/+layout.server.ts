export const ssr = true;
import { pb } from '$lib/pocketbase';

/** @type {import('./$types').LayoutServerLoad} */
export function load() {
    if(!pb.authStore.isValid){
        pb.authStore.clear();
        return {
            authValid: false
        };
    }
    return {
        authValid: true
    };
  }