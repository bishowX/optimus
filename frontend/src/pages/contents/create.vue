<script setup lang="ts">
import { computed } from "vue"
import slugify from "slugify"

// form
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/valibot"
import * as v from "valibot"
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
import { Editor } from "@/components/editor"
import { useStorage } from "@vueuse/core"
import { useRouter } from "vue-router"

const formSchema = toTypedSchema(
    v.object({
        title: v.pipe(v.string(), v.minLength(2, "Title cannot be less then 2 characters")),
        snippet: v.pipe(
            v.string(),
            v.minLength(2, "Snippet cannot be less then 2 characters"),
            v.maxLength(2000)
        ),
        content: v.pipe(v.string(), v.minLength(1, "Content cannot be empty"))
    })
)

const { handleSubmit, values, setFieldValue } = useForm({
    validationSchema: formSchema,
    initialValues: {
        content: "",
        snippet: "",
        title: ""
    }
})

const slug = computed(() => slugify(values.title as string, { lower: true }))

const contents = useStorage<typeof values & { slug: string }[]>("contents", [])

const router = useRouter()

const handleFormSubmit = handleSubmit((values) => {
    contents.value.push({ ...values, slug: slug.value })
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

        <!-- Title slug -->
        <FormField v-slot="{ componentField }" name="titleSlug">
            <FormItem>
                <FormLabel>Slug</FormLabel>
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
                                console.log(props.editor.getJSON());
                                
                            }
                        "
                        @blur="componentField.onBlur"
                        :content="`
        <p>
          This is still the text editor you’re used to, but enriched with node views.
        </p>
        <vue-component count='0'></vue-component>
        <p>
          Did you see that? That’s a Vue component. We are really living in the future.
        </p>
      `"
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <Button>Submit</Button>
    </form>
</template>
