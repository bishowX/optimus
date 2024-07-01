<script setup lang="ts">
import { onBeforeUnmount } from "vue"
import { Editor, EditorContent } from "@tiptap/vue-3"
import Document from "@tiptap/extension-document"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import Heading from "@tiptap/extension-heading"

// form
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import * as z from "zod"

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const formSchema = toTypedSchema(
    z.object({
        title: z.string().min(2).max(100).default(""),
        snippet: z.string().min(2).max(500).default(""),
        content: z.string().min(1).max(5000).default("")
    })
)

const { handleSubmit, values, setValues } = useForm({
    validationSchema: formSchema
})

const editor = new Editor({
    content: "<p>I’m running Tiptap with Vue.js. 🎉</p>",
    extensions: [Document, Paragraph, Text, Heading],
    onUpdate(props) {
        const html = props.editor.getHTML()
        setValues({
            content: html === "<p></p>" ? "" : html
        })
    }
})

const handleFormSubmit = handleSubmit((values) => {
    console.log(values)
})

onBeforeUnmount(() => {
    editor.destroy()
})
</script>

<template>
    <form @submit="handleFormSubmit" class="space-y-6">
        <!-- Title -->
        <FormField v-slot="{ componentField }" name="title">
            <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                    <Input placeholder="title" v-bind="componentField" />
                </FormControl>
                <FormDescription />
                <FormMessage />
            </FormItem>
        </FormField>
        <!-- Title slug -->
        <FormField v-slot="{ componentField }" name="titleSlug">
            <FormItem>
                <FormLabel>Title Slug</FormLabel>
                <FormControl>
                    <Input disabled :model-value="values.title" v-bind="componentField" />
                </FormControl>
                <FormDescription />
                <FormMessage />
            </FormItem>
        </FormField>
        <!-- snippet -->
        <FormField v-slot="{ componentField }" name="snippet">
            <FormItem>
                <FormLabel>Snippet</FormLabel>
                <FormControl>
                    <Textarea placeholder="snippet" class="resize-none" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <!-- content -->

        <FormField v-slot="{ componentField }" name="content">
            <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                    <EditorContent :editor="editor" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <Button>Submit</Button>
    </form>
</template>
