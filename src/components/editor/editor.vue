<script setup lang="ts">
import { onBeforeUnmount } from "vue"

// Tittap
import { Editor, EditorContent, type Content, type EditorEvents } from "@tiptap/vue-3"
import Document from "@tiptap/extension-document"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import Heading from "@tiptap/extension-heading"

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
    }
})
onBeforeUnmount(() => {
    editor.destroy()
})
</script>

<template>
    <EditorContent :editor="editor" />
</template>
