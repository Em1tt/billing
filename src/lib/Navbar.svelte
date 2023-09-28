<script lang="ts">
	import type { Admin, Record } from 'pocketbase';
	import Dropdown from './Dropdown.svelte';
	import { invalidateAll } from '$app/navigation';
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
					<Dropdown text="Order" urls={[{text: "Minecraft Servers", url:"/"}]}/>
				</li>
				<li class="relative">
					<Dropdown text="Support" urls={[{text:"View Tickets", url: "/tickets"}, {text:"Join our Discord", url: "/"}, {text: "Knowledgebase", url: "/"}]}/>
				</li>
				<li class="relative">
					<Dropdown text="More"/>
				</li>
			</ul>
		</nav>
		<div class="w-64 flex items-center">
			<ul class="text-slate-600 relative">
				{#if user}
					<li>
						<Dropdown text="Profile" urls={[{text: "Edit Profile", url: "/profile"}, {text:" Sign Out", emphasis: "danger", form: {action: "/logout", method: "POST", enhance(){invalidateAll()}}}]}/>
					</li>
				{:else}
					<li>
						<Dropdown text="Login" urls={[{text: "Login", url: "/login"}, {text: "Register", url: "/register"}]}/>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</div>
