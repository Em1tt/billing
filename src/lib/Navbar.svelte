<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { Admin, Record } from 'pocketbase';
	import Dropdown from './Dropdown.svelte';
	export let user: Record | Admin | null = null;
</script>

<div class="border-b border-b-slate-400/40 bg-slate-200 fixed top-0 left-0 w-screen px-2 py-0.5 z-50">
	<div class="max-w-7xl px-10 mx-auto flex justify-between gap-4">
		<div class="w-64">
			<a href="/" class="flex flex-row items-center text-slate-700 w-fit">
				<img src="/AmetrineSmall.webp" alt="logo" />
				<p class="text-lg block">Ametrine.host</p>
			</a>
		</div>
		<nav class="flex justify-start items-center w-full mx-12">
			<ul class="flex flex-row items-center gap-6 text-slate-600">
				<li><a href="/" class="hover:text-slate-800">Home</a></li>
				<li class="relative">
					<Dropdown text="Order">
						<ul class="leading-loose">
							<li>
								<a href="/order" class="w-40 block hover:text-slate-800 focus:text-slate-800 px-2"
									>Minecraft Servers</a
								>
							</li>
						</ul>
					</Dropdown>
				</li>
				<li class="relative">
					<Dropdown text="Support">
						<ul class="leading-loose">
							<li>
								<a href="/tickets" class="w-40 block hover:text-slate-800 focus:text-slate-800 px-2"
									>View tickets</a
								>
							</li>
							<li>
								<a href="/" class="w-40 block hover:text-slate-800 focus:text-slate-800 px-2"
									>Join our Discord</a
								>
							</li>
							<li>
								<a href="/" class="w-40 block hover:text-slate-800 focus:text-slate-800 px-2"
									>Knowledgebase</a
								>
							</li>
						</ul>
					</Dropdown>
				</li>
				<li class="relative">
					<Dropdown text="More" />
				</li>
			</ul>
		</nav>
		<div class="w-64 flex items-center">
			<ul class="text-slate-600 relative">
				{#if user}
					<li>
						<Dropdown text="Profile">
							<ul class="leading-loose">
								<li>
									<a href="/profile" class="w-40 block hover:text-slate-800 focus:text-slate-800 px-2"
										>Edit Profile</a
									>
								</li>
								<li>
									<form on:submit action="/logout" class="text-left" method="POST">
										<button type="submit" class="w-40 block hover:text-slate-800 focus:text-slate-800 px-2 text-left">Sign out</button>
									</form>
								</li>
							</ul>
						</Dropdown>
					</li>
				{:else}
					<li>
						<Dropdown text="Login">
							<ul class="leading-loose">
								<li>
									<a href="/login" class="w-40 block hover:text-slate-800 focus:text-slate-800 px-2"
										>Login</a
									>
								</li>
								<li>
									<a
										href="/register"
										class="w-40 block hover:text-slate-800 focus:text-slate-800 px-2">Register</a
									>
								</li>
							</ul>
						</Dropdown>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</div>
