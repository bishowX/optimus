<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3"
import { defineProps } from "vue"

defineProps<{
    editor: Editor
}>()
</script>

<template>
    <button
        type="button"
        @click="editor.chain().toggleHeading({ level: 1 }).run()"
        :class="{ 'bg-red-300': editor.isActive('heading', { level: 1 }) }"
    >
        H1
    </button>
</template>
