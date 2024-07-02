<script setup lang="ts">
import { onBeforeUnmount } from "vue"

// Tittap
import { Editor, EditorContent, type Content, type EditorEvents } from "@tiptap/vue-3"
import Document from "@tiptap/extension-document"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import Heading from "@tiptap/extension-heading"
import Toolbar from "./toolbar.vue"

const props = defineProps<{
    content?: Content
}>()

const emits = defineEmits<{
    (e: "update", props: EditorEvents["update"]): void
    (e: "blur", props: EditorEvents["blur"]): void
}>()

const editor = new Editor({
    content: props.content,
    extensions: [Document, Paragraph, Text, Heading],
    onUpdate(props) {
        emits("update", props)
    },
    onBlur(props) {
        emits("blur", props)
    },
    editorProps: {
        attributes: {
            class: "outline-none"
        }
    }
})
onBeforeUnmount(() => {
    editor.destroy()
})
</script>

<template>
    <div
        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none placeholder:text-muted-foreground has-[.ProseMirror-focused]:outline-none has-[.ProseMirror-focused]:ring-1 has-[.ProseMirror-focused]:ring-ring has-[.ProseMirror-focused]:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
    >
        <Toolbar :editor="editor" />
        <EditorContent :editor="editor" />
    </div>
</template>
