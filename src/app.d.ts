// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			currentUser: Writable<Record | Admin | null>
		}
		interface LayoutData{
			isValid: boolean
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
