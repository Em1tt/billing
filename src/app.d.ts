import PocketBase, {Record, Admin} from "pocketbase";
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			authExpired: boolean, //True when token was invalidated on request.
			pb: PocketBase,
			user: Record | Admin | null
		}
		interface LayoutData{
			isValid: boolean
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
