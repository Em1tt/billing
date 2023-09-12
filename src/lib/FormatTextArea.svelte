<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { Editor } from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'
    import Blockquote from '@tiptap/extension-blockquote';
    import BulletList from '@tiptap/extension-bullet-list';
    import OrderedList from '@tiptap/extension-ordered-list';
    import Code from '@tiptap/extension-code';
    import Link from '@tiptap/extension-link';
    import CharacterCount from '@tiptap/extension-character-count';
    import Paragraph from '@tiptap/extension-paragraph';
    import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
    import { LiteralTab } from '$lib/Indent';

    import css from 'highlight.js/lib/languages/css'
    import js from 'highlight.js/lib/languages/javascript'
    import ts from 'highlight.js/lib/languages/typescript'
    import html from 'highlight.js/lib/languages/xml'
    import { createLowlight } from 'lowlight'

    const lowlight = createLowlight();

    lowlight.register('html', html);
    lowlight.register('css', css);
    lowlight.register('js', js);
    lowlight.register('ts', ts);

    export let charLimit: number = 350;
    export let charWarningPercentage: number = 0.8;
    let element: HTMLElement;
    let editor: Editor;
    let charCount: number;
    onMount(() => {
      editor = new Editor({
        enableInputRules: false,
        enablePasteRules: false,
        element: element,
        extensions: [
          StarterKit,
          Blockquote.configure({
            HTMLAttributes: {
              class: "pl-2 border-l-2 border-slate-400 outline-none"
            }
          }),
          BulletList.configure({
            HTMLAttributes: {
              class: "list-disc pl-4"
            }
          }),
          OrderedList.configure({
            HTMLAttributes: {
              class: "list-decimal pl-4"
            }
          }),
          Code.configure({
            HTMLAttributes: {
              class: "text-black bg-slate-300 p-1 rounded my-0.5"
            }
          }),
          Link.configure({
            protocols: ["http", "https"],
            HTMLAttributes: {
              rel: 'noopener noreferrer',
              target: null,
              class: "text-sky-500 cursor-pointer"
            }
          }),
          CharacterCount.configure({
            limit: charLimit
          }),
          Paragraph.configure({
            HTMLAttributes: {
              class: "break-words whitespace-pre-wrap"
            },
          }),
          LiteralTab,
          CodeBlockLowlight.configure({
            lowlight,
            HTMLAttributes: {
              spellcheck: false,
              class: "bg-slate-900 p-2 rounded text-white my-0.5"
            }
          })
        ],
        editorProps: {
        attributes: {
          class: 'h-[600px] overflow-y-auto p-2 w-full break-words',
        },
      },
        onTransaction: () => {
          // force re-render so `editor.isActive` works as expected
          editor = editor
          charCount = parseInt(editor.storage.characterCount.characters());
        },
      })
    })
  
    onDestroy(() => {
      if (editor) {
        editor.destroy()
      }
    })
  </script>
  
  {#if editor}
    <div class="border border-slate-400/40 border-b-0 w-full p-2 rounded-t flex items-center gap-2">
      <!--
      <button
      on:click={() => editor.chain().focus().toggleHeading({ level: 1}).run()}
      class:active={editor.isActive('heading', { level: 1 })}
    >
      H1
    </button>
    <button
      on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      class:active={editor.isActive('heading', { level: 2 })}
    >
      H2
    </button>
    <button on:click={() => editor.chain().focus().setParagraph().run()} class:active={editor.isActive('paragraph')}>
      P
    </button>
    -->
    <button on:click={() => editor.chain().focus().toggleBold().run()} class:active={editor.isActive('bold')}>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 16">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 1h4.5a3.5 3.5 0 1 1 0 7H3m0-7v7m0-7H1m2 7h6.5a3.5 3.5 0 1 1 0 7H3m0-7v7m0 0H1"/>
          </svg>
    </button>
    <button on:click={() => editor.chain().focus().toggleItalic().run()} class:active={editor.isActive('italic')}>
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 16">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3.874 15 6.143-14M1 15h6.33M6.67 1H13"/>
      </svg>
    </button>
    <div class="w-0.5 bg-slate-400/40 block h-6 mx-2"></div>
    <button on:click={() => editor.chain().focus().toggleCode().run()} class:active={editor.isActive('code')}>
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4 1 8l4 4m10-8 4 4-4 4M11 1 9 15"/>
      </svg>
    </button>
    <button on:click={() => editor.chain().focus().toggleCodeBlock().run()} class:active={editor.isActive('codeBlock')}>
      <svg aria-hidden="true" class="stroke-current stroke-[3] w-12 h-12" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </button>
    <p class="pointer-events-none ml-auto {charCount == charLimit ? "text-red-500" : charCount > charLimit * charWarningPercentage ? "text-slate-600" : "text-slate-400"}">{charCount}/{charLimit}</p>
    </div>
  {/if}
  
  <div class="border border-slate-400/40 editor" bind:this={element}/>
  
  <style>
    button{
      @apply text-slate-400;
    }
    button.active {
      @apply text-slate-600;
    }
    button > svg{
      @apply w-4 h-4;
    }
    :global(.editor .tiptap){
      @apply outline-none whitespace-pre-wrap break-words hyphens-auto;
    }
    :global(.hljs-comment,
    .hljs-quote) {
      color: #616161;
    }

    :global(.hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class) {
      color: #F98181;
    }

    :global(.hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params) {
      color: #FBBC88;
    }

    :global(.hljs-string,
    .hljs-symbol,
    .hljs-bullet) {
      color: #B9F18D;
    }

    :global(.hljs-title,
    .hljs-section) {
      color: #FAF594;
    }

    :global(.hljs-keyword,
    .hljs-selector-tag) {
      color: #70CFF8;
    }

    :global(.hljs-emphasis) {
      font-style: italic;
    }

    :global(.hljs-strong) {
      font-weight: 700;
    }
  </style>