<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { pb } from '$lib/pocketbase';
	import { Turnstile } from 'svelte-turnstile';
	let email: HTMLInputElement;
	let emailMessage: string = 'Please enter a valid e-mail address.';
	let password: HTMLInputElement;
	let passwordMessage: string;
	let turnstileMessage: string;

	function validateEmail() {
		if (email.value.trim() == '') {
			emailMessage = "E-Mail can't be empty.";
		} else if (
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
				email.value.trim()
			)
		) {
			emailMessage = '';
		} else {
			emailMessage = 'Please enter a valid E-Mail address.';
		}
		email.setCustomValidity(emailMessage);
	}

	let loading: boolean = false;
	let reset: () => void | undefined;
</script>

<div class="grid w-full h-full place-items-center">
	<div class="px-20 py-8 border border-slate-400/40 rounded">
		<h1 class="text-slate-600 text-3xl font-semibold text-center">Login</h1>
		<form
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					await applyAction(result);
					const { emailData, passwordData, turnstileData } = $page.form;
					if (emailData) {
						emailMessage = emailData.message;
						email.setCustomValidity(emailMessage);
					}
					if (passwordData) {
						passwordMessage = passwordData.message;
						password.setCustomValidity(passwordMessage);
					}
					if (turnstileData) {
						turnstileMessage = turnstileData.message;
					} else {
						turnstileMessage = '';
					}
					reset?.();
					loading = false;
					if ($page.form.success) {
						try {
							await pb.collection('users').authWithPassword(email.value, password.value);
							await goto('/');
						} catch (e) {
							console.log(e);
						}
					}
				};
			}}
			method="POST"
		>
			<fieldset class="relative mt-8 flex items-center gap-2">
				<input
					on:input={validateEmail}
					bind:this={email}
					placeholder=" "
					type="email"
					name="email"
					id="email"
					class="p-2 w-full bg-transparent border border-slate-400 invalid:border-red-500 invalid:text-red-500 placeholder-shown:border-slate-400/40 rounded focus:border-sky-500 outline-none text-slate-600 focus:text-sky-500 peer"
				/>
				<label
					for="email"
					class="absolute pointer-events-none duration-100 peer-invalid:text-red-500 motion-reduce:duration-0 text-slate-400 -top-3 left-1 peer-focus:-top-3 peer-focus:left-1 bg-slate-200 rounded-full px-1 peer-focus:text-sky-500 py-0 h-5 peer-placeholder-shown:top-2 peer-placeholder-shown:text-slate-400 peer-placeholder-shown:left-3"
					>E-Mail</label
				>
				<div class="hidden peer-invalid:block text-red-500 relative">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6 peer"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
						/>
					</svg>
					<div
						class="hidden peer-hover:block absolute bottom-8 left-2 border border-red-400 py-1 px-2 pointer-events-none bg-red-200 rounded rounded-bl-none w-fit max-w-[240px]"
					>
						<p class="text-sm block min-w-[120px]">{emailMessage}</p>
						<div class="relative">
							<div
								class="absolute h-2 w-2 border-t-8 border-l-0 border-r-8 border-b-0 border-transparent border-t-red-400 top-1 -left-[9px]"
							/>
						</div>
					</div>
				</div>
			</fieldset>
			<fieldset class="relative mt-3 flex items-center gap-2">
				<input
					on:change={validateEmail}
					bind:this={password}
					placeholder=" "
					type="password"
					name="password"
					id="password"
					class="p-2 bg-transparent w-full border border-slate-400 invalid:border-red-500 invalid:text-red-500 placeholder-shown:border-slate-400/40 rounded focus:border-sky-500 outline-none text-slate-600 focus:text-sky-500 peer"
				/>
				<label
					for="password"
					class="absolute pointer-events-none duration-100 peer-invalid:text-red-500 motion-reduce:duration-0 text-slate-400 -top-3 left-1 peer-focus:-top-3 peer-focus:left-1 bg-slate-200 rounded-full px-1 peer-focus:text-sky-500 py-0 h-5 peer-placeholder-shown:top-2 peer-placeholder-shown:text-slate-400 peer-placeholder-shown:left-3"
					>Password</label
				>
				<div class="hidden peer-invalid:block text-red-500 relative">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6 peer"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
						/>
					</svg>
					<div
						class="hidden peer-hover:block absolute bottom-8 left-2 border border-red-400 py-1 px-2 pointer-events-none bg-red-200 rounded rounded-bl-none w-fit max-w-[240px]"
					>
						<p class="text-sm block min-w-[120px]">{passwordMessage}</p>
						<div class="relative">
							<div
								class="absolute h-2 w-2 border-t-8 border-l-0 border-r-8 border-b-0 border-transparent border-t-red-400 top-1 -left-[9px]"
							/>
						</div>
					</div>
				</div>
			</fieldset>
			<fieldset class="relative mt-3 flex items-center gap-2">
				<button
					type="submit"
					class="p-2 cursor-pointer bg-sky-200 border border-sky-400 text-sky-600 hover:text-sky-800 hover:border-sky-600 w-full rounded"
				>
					{#if loading}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6 mx-auto animate-spin"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
							/>
						</svg>
					{:else}
						Login
					{/if}
				</button>
			</fieldset>
			{#if turnstileMessage && turnstileMessage != ''}
				<p class="text-center text-red-500">{turnstileMessage}</p>
			{/if}
			<Turnstile siteKey="0x4AAAAAAAJRELri_iqccqJu" size="invisible" bind:reset />
		</form>
	</div>
</div>
