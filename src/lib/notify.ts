// lib/notification.ts

import { writable } from 'svelte/store'

type Notification = {message: string, type: "error" | "warn" | "success"};

export const notifications = writable<Notification[]>([])

export function toast(message: string, type: "error" | "warn" | "success", time: number) {
  notifications.update((state) => [{message, type}, ...state]);
  setTimeout(removeToast, time);
}

function removeToast() {
  notifications.update((state) => {
    return [...state.slice(0, state.length - 1)]
  })
}
