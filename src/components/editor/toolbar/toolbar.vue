<script setup lang="ts">
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

defineProps<{ editor: Editor }>()
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
            <Dialog>
                <DialogTrigger>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button variant="ghost" size="icon">
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
                    <div class="grid gap-4 py-4">
                        <div
                            class="group relative flex h-40 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted transition-colors hover:border-primary"
                        >
                            <div
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
                            />
                        </div>
                        <div class="grid grid-cols-[1fr_auto] items-center gap-4">
                            <Input placeholder="Enter image URL" class="w-full" />
                            <Button>Upload</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>
