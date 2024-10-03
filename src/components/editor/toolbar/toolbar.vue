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
    LineChart,
    List,
    ListOrdered,
} from "lucide-vue-next"

import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"

import Link from "@/components/editor/toolbar/link.vue"
import Heading from "@/components/editor/toolbar/heading.vue"
import Image from "@/components/editor/toolbar/image.vue"
import { generateRandomGrowthData } from "@/data/line-chart"

const props = defineProps<{ editor: Editor }>()

const makeChart = () => {
    props.editor
        .chain()
        .insertContent({
            type: "LineChart",
            attrs: {
                data: generateRandomGrowthData(2000, 24),
            },
        })
        .run()
}
</script>

<template>
    <div
        class="sticky -top-2 z-10 flex h-10 w-full items-center gap-2 overflow-x-auto bg-background"
    >
        <Heading :editor="editor" />
        <Separator class="h-6" orientation="vertical" />
        <div class="flex items-center gap-2">
            <Tooltip>
                <TooltipTrigger as-child>
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
                <TooltipTrigger as-child>
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
                <TooltipTrigger as-child>
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
                <TooltipTrigger as-child>
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
        <div class="flex items-center gap-2">
            <Tooltip>
                <TooltipTrigger as-child>
                    <Toggle
                        :pressed="editor.isActive('bulletList')"
                        @update:pressed="editor.chain().toggleBulletList().focus().run()"
                        aria-label="Toggle bullet list"
                    >
                        <List class="h-4 w-4" />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                    Bullet list <Kbd class="ml-2">No shortcut yet</Kbd>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger as-child>
                    <Toggle
                        :pressed="editor.isActive('orderedList')"
                        @update:pressed="editor.chain().toggleOrderedList().focus().run()"
                        aria-label="Toggle ordered list"
                    >
                        <ListOrdered class="h-4 w-4" />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent :side-offset="10">
                    Ordered list <Kbd class="ml-2">No shortcut yet</Kbd>
                </TooltipContent>
            </Tooltip>
        </div>

        <Separator class="h-6" orientation="vertical" />

        <div class="flex items-center gap-1">
            <Tooltip>
                <TooltipTrigger as-child>
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
                <TooltipTrigger as-child>
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
                <TooltipTrigger as-child>
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
                <TooltipTrigger as-child>
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
            <Image :editor="editor" />
        </div>

        <Separator class="h-6" orientation="vertical" />

        <div class="flex items-center gap-1">
            <Tooltip>
                <TooltipTrigger as-child>
                    <Button @click="makeChart" variant="ghost" size="icon">
                        <LineChart class="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent> Add line chart <Kbd>Ctrl + Alt + L</Kbd> </TooltipContent>
            </Tooltip>
        </div>
    </div>
</template>
