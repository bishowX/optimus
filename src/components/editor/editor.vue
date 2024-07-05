<script setup lang="ts">
import { onBeforeUnmount } from "vue"

// Tiptap
import { Editor, EditorContent, type Content, type EditorEvents } from "@tiptap/vue-3"
import Document from "@tiptap/extension-document"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import Heading from "@tiptap/extension-heading"
import Bold from "@tiptap/extension-bold"
import Italic from "@tiptap/extension-italic"
import Underline from "@tiptap/extension-underline"
import Strike from "@tiptap/extension-strike"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import DropCursor from "@tiptap/extension-dropcursor"
import { Image } from "@/lib/tiptap/image"
import { Toolbar } from "@/components/editor/toolbar"

const props = defineProps<{
    content?: Content
}>()

const emits = defineEmits<{
    (e: "update", props: EditorEvents["update"]): void
    (e: "blur", props: EditorEvents["blur"]): void
}>()

const editor = new Editor({
    content: props.content,
    extensions: [
        Document,
        Paragraph,
        Text,
        Heading,
        Bold,
        Italic,
        Underline,
        Strike,
        Subscript,
        Superscript,
        Link.extend({ inclusive: false }).configure({
            openOnClick: false,
            HTMLAttributes: { class: "cursor-pointer" }
        }),
        TextAlign.configure({
            types: ["heading", "paragraph"]
        }),
        Image,
        DropCursor
    ],
    onUpdate(props) {
        emits("update", props)
    },
    onBlur(props) {
        emits("blur", props)
    },
    editorProps: {
        attributes: {
            class: "w-full min-h-72 max-w-full prose dark:prose-invert prose-sm sm:prose sm:max-w-full lg:prose-lg focus:outline-none"
        }
    }
})
onBeforeUnmount(() => {
    editor.destroy()
})
</script>

<template>
    <div
        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
    >
        <Toolbar :editor="editor" />
        <div class="h-2"></div>
        <EditorContent :editor="editor" />
    </div>
</template>
