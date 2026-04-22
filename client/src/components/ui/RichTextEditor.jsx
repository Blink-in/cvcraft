import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { useEffect } from 'react'
import { Bold, Italic, UnderlineIcon, List, ListOrdered } from 'lucide-react'

function ToolbarBtn({ onClick, active, children, title }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      title={title}
      className={`p-1.5 rounded transition-colors ${active ? 'bg-amber-500/20 text-amber-400' : 'text-obsidian-400 hover:text-obsidian-200 hover:bg-obsidian-700'}`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({ content, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Sync external content changes (e.g. AI generation)
  useEffect(() => {
    if (!editor) return
    const currentHTML = editor.getHTML()
    if (content !== currentHTML) {
      editor.commands.setContent(content || '', false)
    }
  }, [content])

  if (!editor) return null

  return (
    <div className="border border-obsidian-700 rounded-lg overflow-hidden focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-obsidian-700 bg-obsidian-800/50">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold size={13} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic size={13} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <UnderlineIcon size={13} />
        </ToolbarBtn>
        <div className="w-px h-4 bg-obsidian-700 mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List size={13} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">
          <ListOrdered size={13} />
        </ToolbarBtn>
      </div>

      {/* Editor area */}
      <div className="p-3 min-h-[160px] relative">
        {!content && (
          <p className="absolute top-3 left-3 text-obsidian-600 text-sm pointer-events-none select-none">
            {placeholder}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
