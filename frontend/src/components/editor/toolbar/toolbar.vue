<script setup lang="ts">
import { ref } from "vue"
import type { Editor } from "@tiptap/vue-3"
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignCenter,
    AlignLeft,
    AlignRight,
    AlignJustify,
    ImagePlus,
    CloudUploadIcon
} from "lucide-vue-next"
import * as v from "valibot"

import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import Link from "./link.vue"
import Heading from "./heading.vue"
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/valibot"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

const props = defineProps<{ editor: Editor }>()

const imgDialogOpen = ref(false)

const imgForm = useForm({
    validationSchema: toTypedSchema(
        v.object({ url: v.pipe(v.string("Image url is required"), v.url("Invalid image url")) })
    )
})

const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    const fileSize = file.size * 1024 * 1024 // In MB

    imgForm.setFieldValue("url", URL.createObjectURL(file) || "")
}

const handleImageFormSubmit = imgForm.handleSubmit((values) => {
    imgDialogOpen.value = false
    props.editor
        .chain()
        .focus()
        .setImage({
            src: values.url
        })
        .run()
})

const dragenter = (e: DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
}

const dragover = (e: DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
}

const drop = (e: DragEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const file = e.dataTransfer?.files?.[0]

    // only few image format don't have mime type starting with 'image/', see: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#image_file_type_details
    if (!file || !file.type || !file.type.startsWith("image/")) return

    const fileSize = file.size * 1024 * 1024 // In MB

    imgForm.setFieldValue("url", URL.createObjectURL(file) || "")
}
</script>

<template>
    <div class="w-full flex items-center gap-2">
        <Heading :editor="editor" />
        <Separator class="h-6" orientation="vertical" />
        <div class="flex items-center gap-2">
            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        :pressed="editor.isActive('bold')"
                        @update:pressed="editor.chain().toggleBold().focus().run()"
                        aria-label="Toggle bold"
                    >
                        <Bold class="h-4 w-4" />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent> Toggle bold <Kbd class="ml-2">Ctrl + B</Kbd> </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        :pressed="editor.isActive('italic')"
                        @update:pressed="editor.chain().toggleItalic().focus().run()"
                        aria-label="Toggle italic"
                    >
                        <Italic class="h-4 w-4" />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent :side-offset="10">
                    Toggle italic <Kbd class="ml-2">Ctrl + I</Kbd>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        :pressed="editor.isActive('underline')"
                        @update:pressed="editor.chain().toggleUnderline().focus().run()"
                        aria-label="Toggle underline"
                    >
                        <Underline class="h-4 w-4" />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent> Toggle underline <Kbd class="ml-2">Ctrl + U</Kbd> </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        :pressed="editor.isActive('strike')"
                        @update:pressed="editor.chain().toggleStrike().focus().run()"
                        aria-label="Toggle strike"
                    >
                        <Strikethrough class="h-4 w-4" />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                    Toggle strike <Kbd class="ml-2">Ctrl + Shift + S</Kbd>
                </TooltipContent>
            </Tooltip>
        </div>

        <Separator class="h-6" orientation="vertical" />

        <div class="flex items-center gap-1">
            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        :pressed="editor.isActive({ textAlign: 'left' })"
                        @update:pressed="editor.chain().focus().setTextAlign('left').run()"
                        aria-label="Text align left"
                    >
                        <AlignLeft class="h-4 w-4" />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                    Text align left <Kbd class="ml-2">Ctrl + Shift + L</Kbd>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        :pressed="editor.isActive({ textAlign: 'center' })"
                        @update:pressed="editor.chain().focus().setTextAlign('center').run()"
                        aria-label="Text align center"
                    >
                        <AlignCenter class="h-4 w-4" />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                    Text align center <Kbd class="ml-2">Ctrl + Shift + E</Kbd>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        :pressed="editor.isActive({ textAlign: 'justify' })"
                        @update:pressed="editor.chain().focus().setTextAlign('justify').run()"
                        aria-label="Text align justify"
                    >
                        <AlignJustify class="h-4 w-4" />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                    Text align justify <Kbd class="ml-2">Ctrl + Shift + J</Kbd>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        :pressed="editor.isActive({ textAlign: 'right' })"
                        @update:pressed="editor.chain().focus().setTextAlign('right').run()"
                        aria-label="Text align right"
                    >
                        <AlignRight class="h-4 w-4" />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                    Text align right <Kbd class="ml-2">Ctrl + Shift + R</Kbd>
                </TooltipContent>
            </Tooltip>
        </div>

        <Separator class="h-6" orientation="vertical" />

        <div class="flex items-center gap-1">
            <Link :editor="editor" />

            <Dialog :open="imgDialogOpen" @update:open="(open) => (imgDialogOpen = open)">
                <DialogTrigger>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button type="button" variant="ghost" size="icon">
                                <ImagePlus class="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent> Add image </TooltipContent>
                    </Tooltip>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Upload Image</DialogTitle>
                        <DialogDescription>
                            Drag and drop an image or enter an image URL to upload.
                        </DialogDescription>
                    </DialogHeader>
                    <form @submit="handleImageFormSubmit" class="grid gap-4 py-4">
                        <div
                            @dragenter="dragenter"
                            @dragover="dragover"
                            @drop="drop"
                            class="group relative flex h-64 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted transition-colors hover:border-primary"
                        >
                            <img
                                class="h-full rounded-md"
                                v-if="imgForm.values.url"
                                :src="imgForm.values.url"
                                alt=""
                            />
                            <div
                                v-else
                                class="z-10 flex flex-col items-center justify-center space-y-2 text-center text-muted-foreground"
                            >
                                <CloudUploadIcon class="h-8 w-8" />
                                <p class="text-sm font-medium">
                                    Drag and drop an image or
                                    <span class="text-primary">browse</span>
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                class="absolute z-10 inset-0 h-full w-full cursor-pointer opacity-0"
                                @change="handleFileChange"
                            />
                        </div>
                        <div class="grid grid-cols-[1fr_auto] items-start gap-4">
                            <FormField name="url" v-slot="{ componentField }">
                                <FormItem v-auto-animate>
                                    <FormControl>
                                        <Input
                                            v-bind="componentField"
                                            placeholder="Enter image URL"
                                            class="w-full"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormField>
                            <Button>Upload</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>
