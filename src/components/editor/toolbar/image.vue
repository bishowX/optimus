<script setup lang="ts">
import { ref } from "vue"
import type { Editor } from "@tiptap/vue-3"
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/valibot"
import * as v from "valibot"
import { CloudUploadIcon, ImagePlus } from "lucide-vue-next"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const props = defineProps<{ editor: Editor }>()

const imgDialogOpen = ref(false)

const imgForm = useForm({
    validationSchema: toTypedSchema(
        v.object({ url: v.pipe(v.string("Image url is required"), v.url("Invalid image url")) }),
    ),
})

const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    imgForm.setFieldValue("url", URL.createObjectURL(file) || "")
}

const handleImageFormSubmit = imgForm.handleSubmit((values) => {
    imgDialogOpen.value = false
    props.editor
        .chain()
        .focus()
        .setImage({
            src: values.url,
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
    imgForm.setFieldValue("url", URL.createObjectURL(file) || "")
}
</script>

<template>
    <Dialog :open="imgDialogOpen" @update:open="(open) => (imgDialogOpen = open)">
        <Tooltip>
            <DialogTrigger as-child>
                <TooltipTrigger as-child>
                    <Button variant="ghost" size="icon">
                        <ImagePlus class="w-4 h-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent> Add image </TooltipContent>
            </DialogTrigger>
        </Tooltip>
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
                        v-if="imgForm.values.url && imgForm.isFieldValid('url')"
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
                    <Button type="submit">Upload</Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
</template>
