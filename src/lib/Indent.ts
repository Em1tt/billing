import { Extension } from '@tiptap/core';

export const LiteralTab = Extension.create({
  name: 'literalTab',

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        console.log('test');
        return this.editor.commands.insertContent('\t')
      }
    }
  }

})