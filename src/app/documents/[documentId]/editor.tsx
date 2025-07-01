'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Text from '@tiptap/extension-text'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Image from '@tiptap/extension-image'

import Underline from '@tiptap/extension-underline'
import { useEditorStore } from '@/store/use-editor-store'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import {Ruler} from './ruler'
import { useStorage } from '@liveblocks/react'

import { FontSizeExtension } from '@/extensions/font-size'
import { LineHeightExtension } from '@/extensions/line-height'

import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { Threads } from "./threads";

interface EditorProps{
  initialContent?: string | undefined;
}

const Tiptap = ({initialContent}:EditorProps) => {

  const liveblocksExtension = useLiveblocksExtension({
    initialContent,
    offlineSupport_experimental: true
  });
  const {setEditor} = useEditorStore();
  const leftMargin = useStorage((root)=>root.leftMargin);
  const rightMargin = useStorage((root)=>root.rightMargin);

  const editor = useEditor({
    immediatelyRender: false,
    onCreate: ({editor}) => {
      setEditor(editor);
    },
    onDestroy(){
      setEditor(null);
    },
    onUpdate: ({editor}) => {
      setEditor(editor);
    },
    onSelectionUpdate: ({editor}) => {
      setEditor(editor);
    },
    onTransaction: ({editor}) => {
      setEditor(editor);
    },
    onFocus: ({editor}) => {
      setEditor(editor);
    },
    onBlur: ({editor}) => {
      setEditor(editor);
    },
    onContentError: ({editor}) => {
      setEditor(editor);
    },
    editorProps: { 
      attributes: {
        style: `padding-left: ${leftMargin ?? 56}px; padding-right: ${rightMargin ?? 56}px;`,
        class: 'focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text', 
      }
    },
    extensions: [StarterKit.configure({history: false}), Document, Paragraph, TaskItem.configure({ nested: true }), TaskList, Text, Table, TableHeader, TableRow, TableCell, Image,
      Underline, FontFamily, TextStyle, Color, Highlight.configure({multicolor: true}), Link.configure({openOnClick: false, autolink: true, defaultProtocol: 'https'})
      , TextAlign.configure({types: ['heading', 'paragraph']}), FontSizeExtension, LineHeightExtension, liveblocksExtension
    ],
    content: ``,

  })

  return (
    <div className='size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible'>
      <Ruler/>
        <div className='min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0'>
            <EditorContent editor={editor} />
            <Threads editor={editor} />
        </div>
    </div>
  )
}

export default Tiptap