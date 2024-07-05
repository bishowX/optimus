<script setup lang="ts">
import { computed } from "vue"
import type { Editor } from "@tiptap/vue-3"
import { ChevronDown } from "lucide-vue-next"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioItem,
    DropdownMenuRadioGroup,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

const props = defineProps<{ editor: Editor }>()

const levelToFontSizeClass = {
    "0": "text-base",
    "6": "text-base",
    "5": "text-lg",
    "4": "text-xl",
    "3": "text-2xl",
    "2": "text-3xl",
    "1": "text-4xl"
}

const textLevels = [
    {
        level: "0",
        label: "Normal text"
    },
    {
        level: "1",
        label: "Heading 1"
    },
    {
        level: "2",
        label: "Heading 2"
    },
    {
        level: "3",
        label: "Heading 3"
    },
    {
        level: "4",
        label: "Heading 4"
    },
    {
        level: "5",
        label: "Heading 5"
    },
    {
        level: "6",
        label: "Heading 6"
    }
] as const

const level = computed(() =>
    !props.editor.isActive("heading") ? "0" : String(props.editor.getAttributes("heading").level)
)

const handleHeadingLevelSelection = (level: string) => {
    if (level === "0") props.editor.chain().setParagraph().run()
    else
        props.editor
            .chain()
            .setHeading({ level: parseInt(level) as any }) // using `as any` as we know level cannot be other then 0-6
            .run()

    // for some reason the editor is focused out even after calling `.focus()`
    // that's why I'm using `setTimeout` until I find what's causing this issue.
    setTimeout(() => {
        props.editor.commands.focus()
    }, 200)
}
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button class="min-w-[133.93px]" variant="ghost"
                >{{ level === "0" ? "Normal text" : `Heading ${level}` }}
                <ChevronDown class="w-4 h-4 ml-2"
            /></Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
            <DropdownMenuRadioGroup
                :model-value="level"
                @update:model-value="handleHeadingLevelSelection"
            >
                <DropdownMenuRadioItem
                    v-for="textLevel in textLevels"
                    :key="textLevel.level"
                    :value="textLevel.level"
                    class="justify-between gap-4"
                    :class="levelToFontSizeClass[textLevel.level]"
                    >{{ textLevel.label }}
                    <Kbd>Ctrl+Alt+{{ textLevel.level }}</Kbd>
                </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
