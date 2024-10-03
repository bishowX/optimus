<script setup lang="ts">
import { computed, ref } from "vue"
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
import { api } from "@/lib/axios"

const formSchema = toTypedSchema(
    v.object({
        title: v.pipe(v.string(), v.minLength(2, "Title cannot be less then 2 characters")),
        snippet: v.pipe(
            v.string(),
            v.minLength(2, "Snippet cannot be less then 2 characters"),
            v.maxLength(2000),
        ),
        content: v.pipe(v.string(), v.minLength(1, "Content cannot be empty")),
    }),
)

const { handleSubmit, values, setFieldValue } = useForm({
    validationSchema: formSchema,
    initialValues: {
        content: "",
        snippet: "",
        title: "",
    },
})

const slug = computed(() => slugify(values.title as string, { lower: true }))

const router = useRouter()

const loading = ref(false)
const handleFormSubmit = handleSubmit(async (values) => {
    try {
        loading.value = true
        await api.post("/contents", values)
        router.push("/contents")
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="flex w-full items-center justify-between border-b px-4 py-3">
        <h1 class="text-2xl">Create content</h1>
        <div class="flex items-center gap-4">
            <Button :disabled="loading" @click="handleFormSubmit">
                <span v-if="loading">Saving</span>
                <span v-else>Save</span>
            </Button>
        </div>
    </div>
    <form @submit="handleFormSubmit" class="space-y-6 p-4">
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
    </form>
</template>
