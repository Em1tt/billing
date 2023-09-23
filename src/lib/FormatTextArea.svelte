<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import StarterKit from '@tiptap/starter-kit';
	import Blockquote from '@tiptap/extension-blockquote';
	import BulletList from '@tiptap/extension-bullet-list';
	import OrderedList from '@tiptap/extension-ordered-list';
	import Code from '@tiptap/extension-code';
	//Read alert in TipTap config
	//import Link from '@tiptap/extension-link';
	import CharacterCount from '@tiptap/extension-character-count';
	import Paragraph from '@tiptap/extension-paragraph';
	import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
	import { LiteralTab } from '$lib/Indent';

	import css from 'highlight.js/lib/languages/css';
	import js from 'highlight.js/lib/languages/javascript';
	import ts from 'highlight.js/lib/languages/typescript';
	import html from 'highlight.js/lib/languages/xml';
	import { createLowlight } from 'lowlight';
	import { Editor } from '@tiptap/core';

	const lowlight = createLowlight();

	lowlight.register('html', html);
	lowlight.register('css', css);
	lowlight.register('js', js);
	lowlight.register('ts', ts);

	export let charLimit: number = 2000;
	export let charWarningPercentage: number = 0.8;
	export let text: string;
	export let invalid: boolean;
	export let editable: boolean = true;
	let element: HTMLElement;
	export let editor: Editor;
	export let charCount: number;
	console.log(text);
	onMount(() => {
		editor = new Editor({
			editable,
			content: text,
			enableInputRules: false,
			enablePasteRules: false,
			element: element,
			extensions: [
				StarterKit,
				Blockquote.configure({
					HTMLAttributes: {
						class: 'pl-2 border-l-2 border-slate-400 outline-none'
					}
				}),
				BulletList.configure({
					HTMLAttributes: {
						class: 'list-disc pl-4'
					}
				}),
				OrderedList.configure({
					HTMLAttributes: {
						class: 'list-decimal pl-4'
					}
				}),
				Code.configure({
					HTMLAttributes: {
						class: 'text-black bg-slate-300 p-1 rounded my-0.5'
					}
				}),
				/* ! Dangerous, user can rewrite what the anchor says without changing the redirect URL
          Link.configure({
            protocols: ["http", "https"],
            HTMLAttributes: {
              rel: 'noopener noreferrer',
              target: null,
              class: "text-sky-500 cursor-pointer underline"
            },
            autolink: false,
            linkOnPaste: false
          }),*/
				CharacterCount.configure({
					limit: charLimit
				}),
				Paragraph.configure({
					HTMLAttributes: {
						class: 'break-words whitespace-pre-wrap'
					}
				}),
				LiteralTab,
				CodeBlockLowlight.configure({
					lowlight,
					HTMLAttributes: {
						spellcheck: false,
						class: 'bg-slate-900 p-2 rounded text-white my-0.5'
					}
				})
			],
			editorProps: {
				attributes: {
					class: `${editable ? "h-[500px]" : "max-h-[300px] h-auto"} overflow-y-auto p-2 w-full break-words rounded-b text-slate-600`
				}
			},
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
				charCount = parseInt(editor.storage.characterCount.characters());
				invalid = false;
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

{#if editor && editable}
	<div class="border border-b-0 w-full p-2 rounded-t flex items-center gap-1 {invalid ? "border-red-500" : "border-slate-400/40" }">
		<button
			type="button"
			on:click={() => editor.chain().focus().toggleBold().run()}
			class:active={editor.isActive('bold')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="icon icon-tabler icon-tabler-bold"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6z" />
				<path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7" />
			</svg>
		</button>
		<button
			type="button"
			on:click={() => editor.chain().focus().toggleItalic().run()}
			class:active={editor.isActive('italic')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="icon icon-tabler icon-tabler-italic"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M11 5l6 0" />
				<path d="M7 19l6 0" />
				<path d="M14 5l-4 14" />
			</svg>
		</button>
		<div class="w-0.5 bg-slate-400/40 block h-6 mx-2" />
		<button
			type="button"
			on:click={() => editor.chain().focus().toggleBulletList().run()}
			class:active={editor.isActive('bulletList')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="icon icon-tabler icon-tabler-list"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M9 6l11 0" />
				<path d="M9 12l11 0" />
				<path d="M9 18l11 0" />
				<path d="M5 6l0 .01" />
				<path d="M5 12l0 .01" />
				<path d="M5 18l0 .01" />
			</svg>
		</button>
		<button
			type="button"
			on:click={() => editor.chain().focus().toggleOrderedList().run()}
			class:active={editor.isActive('orderedList')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="icon icon-tabler icon-tabler-list-numbers"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M11 6h9" />
				<path d="M11 12h9" />
				<path d="M12 18h8" />
				<path d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4" />
				<path d="M6 10v-6l-2 2" />
			</svg>
		</button>
		<div class="w-0.5 bg-slate-400/40 block h-6 mx-2" />
		<button
			type="button"
			on:click={() => editor.chain().focus().toggleBlockquote().run()}
			class:active={editor.isActive('blockquote')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="icon icon-tabler icon-tabler-blockquote"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M6 15h15" />
				<path d="M21 19h-15" />
				<path d="M15 11h6" />
				<path d="M21 7h-6" />
				<path d="M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" />
				<path d="M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" />
			</svg>
		</button>
		<div class="w-0.5 bg-slate-400/40 block h-6 mx-2" />
		<button
			type="button"
			on:click={() => editor.chain().focus().toggleCode().run()}
			class:active={editor.isActive('code')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="icon icon-tabler icon-tabler-code"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M7 8l-4 4l4 4" />
				<path d="M17 8l4 4l-4 4" />
				<path d="M14 4l-4 16" />
			</svg>
		</button>
		<button
			type="button"
			on:click={() => editor.chain().focus().toggleCodeBlock().run()}
			class:active={editor.isActive('codeBlock')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="icon icon-tabler icon-tabler-source-code"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M14.5 4h2.5a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-5" />
				<path d="M6 5l-2 2l2 2" />
				<path d="M10 9l2 -2l-2 -2" />
			</svg>
		</button>
		<p
			class="pointer-events-none ml-auto {charCount == charLimit
				? 'text-red-500'
				: charCount > charLimit * charWarningPercentage
				? 'text-slate-600'
				: 'text-slate-400'}"
		>
			{charCount}/{charLimit}
		</p>
	</div>
{/if}

<div class="border-slate-400/40 border {editable ? "" : "rounded"} {invalid ? "border-red-500" : ""} editor" bind:this={element} />

<style>
	button {
		@apply text-slate-400;
	}
	button.active {
		@apply text-slate-600;
	}
	button > svg {
		@apply w-5 h-5;
	}
	:global(.editor .tiptap) {
		@apply outline-none whitespace-pre-wrap break-words hyphens-auto;
	}
	:global(.hljs-comment, .hljs-quote) {
		color: #616161;
	}

	:global(
			.hljs-variable,
			.hljs-template-variable,
			.hljs-attribute,
			.hljs-tag,
			.hljs-name,
			.hljs-regexp,
			.hljs-link,
			.hljs-name,
			.hljs-selector-id,
			.hljs-selector-class
		) {
		color: #f98181;
	}

	:global(
			.hljs-number,
			.hljs-meta,
			.hljs-built_in,
			.hljs-builtin-name,
			.hljs-literal,
			.hljs-type,
			.hljs-params
		) {
		color: #fbbc88;
	}

	:global(.hljs-string, .hljs-symbol, .hljs-bullet) {
		color: #b9f18d;
	}

	:global(.hljs-title, .hljs-section) {
		color: #faf594;
	}

	:global(.hljs-keyword, .hljs-selector-tag) {
		color: #70cff8;
	}

	:global(.hljs-emphasis) {
		font-style: italic;
	}

	:global(.hljs-strong) {
		font-weight: 700;
	}
</style>
