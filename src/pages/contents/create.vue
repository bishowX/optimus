<script setup lang="ts">
import { computed } from "vue"
import slugify from "slugify"

import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/valibot"
import * as v from "valibot"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Editor } from "@/components/editor"
import { useStorage } from "@vueuse/core"
import { useRouter } from "vue-router"
import type { Content } from "@/data/content"

const formSchema = toTypedSchema(
    v.object({
        title: v.pipe(v.string(), v.minLength(2, "Title cannot be less then 2 characters")),
        snippet: v.pipe(
            v.string(),
            v.minLength(2, "Snippet cannot be less then 2 characters"),
            v.maxLength(2000),
        ),
        content: v.pipe(v.string(), v.minLength(1, "Content cannot be empty")),
        publishedOn: v.string(), // Changed to v.string()
    }),
)

const { handleSubmit, values, setFieldValue } = useForm({
    validationSchema: formSchema,
    initialValues: {
        content: "",
        snippet: "",
        title: "",
        publishedOn: new Date().toISOString(),
    },
})

const slug = computed(() => slugify(values.title as string, { lower: true }))

const contents = useStorage<Content[]>("contents", [])

const router = useRouter()

const handleFormSubmit = handleSubmit((values) => {
    contents.value.push({
        ...values,
        slug: slug.value,
        publishedOn: values.publishedOn,
    })
    router.push("/contents")
})
</script>

<template>
    <form @submit="handleFormSubmit" class="space-y-6">
        <!-- Title -->
        <FormField v-slot="{ componentField }" name="title">
            <FormItem v-auto-animate>
                <FormLabel>Title</FormLabel>
                <FormControl>
                    <Input placeholder="title" v-bind="componentField" />
                </FormControl>
                <FormDescription />
                <FormMessage />
            </FormItem>
        </FormField>

        <!-- Published On  -->
        <FormField v-slot="{ componentField }" name="publishedOn">
            <FormItem v-auto-animate>
                <FormLabel>Published On</FormLabel>
                <FormControl>
                    <Input type="date" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <!-- Title slug -->
        <FormField v-slot="{ componentField }" name="titleSlug">
            <FormItem>
                <FormLabel
                    >Slug <span class="text-xs text-gray-500">(Auto generated)</span></FormLabel
                >
                <FormControl>
                    <Input disabled :value="slug" v-bind="componentField" />
                </FormControl>
                <FormDescription />
                <FormMessage />
            </FormItem>
        </FormField>

        <!-- snippet -->
        <FormField v-slot="{ componentField }" name="snippet">
            <FormItem v-auto-animate>
                <FormLabel>Snippet</FormLabel>
                <FormControl>
                    <Textarea placeholder="snippet" class="resize-none" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <!-- content -->
        <FormField v-slot="{ componentField }" name="content">
            <FormItem v-auto-animate>
                <FormLabel>Content</FormLabel>
                <FormControl>
                    <Editor
                        @update="
                            (props) => {
                                const html = props.editor.getHTML()
                                setFieldValue('content', props.editor.getText().trim() ? html : '')
                            }
                        "
                        @blur="({ event }) => componentField.onBlur(event)"
                        content=""
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <Button type="submit">Submit</Button>
    </form>
</template>
