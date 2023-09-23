// lib/notification.ts

import { writable } from 'svelte/store'

type ImageModal = {name: string, url: string};

export const modal = writable<ImageModal | null>(null)

export function shootImageModal(name: string, url: string) {
  modal.set({name, url});
};

export function removeModal() {
  modal.set(null);
};
