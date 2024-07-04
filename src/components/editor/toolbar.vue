<script setup lang="ts">
import { computed, ref, watch } from "vue"
import type { Editor } from "@tiptap/vue-3"
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    ChevronDown,
    Link,
    AlignCenter,
    AlignLeft,
    AlignRight,
    AlignJustify
} from "lucide-vue-next"
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import z from "zod"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioItem,
    DropdownMenuRadioGroup,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Kbd } from "@/components/ui/kbd"

const props = defineProps<{
    editor: Editor
}>()

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

const level = computed(() =>
    props.editor.isActive("paragraph") ? "0" : String(props.editor.getAttributes("heading").level)
)

const linkDialogOpen = ref(false)

const linkFormSchema = toTypedSchema(
    z.object({
        url: z.string().url(),
        displayText: z.string().optional(),
        openInSameTab: z.boolean().default(false)
    })
)

const linkForm = useForm({
    initialValues: {
        url: "",
        displayText: "",
        openInSameTab: false
    },
    validationSchema: linkFormSchema
})

watch(linkDialogOpen, (n) => {
    const selection = props.editor.state.selection
    if (n) {
        linkForm.setFieldValue(
            "displayText",
            props.editor.state.doc.textBetween(selection.$from.pos, selection.$to.pos, " ")
        )
    }
})

const handleFormSubmit = linkForm.handleSubmit((values) => {
    linkForm.resetForm()
    linkDialogOpen.value = false

    props.editor
        .chain()
        .focus()
        .insertContent({
            type: "text",
            text: values.displayText || values.url,
            marks: [
                {
                    type: "link",
                    attrs: {
                        href: values.url,
                        target: values.openInSameTab ? "_self" : "_blank"
                    }
                }
            ]
        })
        .run()
})

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
</script>

<template>
    <div class="w-full flex items-center gap-2">
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
                        <Badge variant="outline" class="rounded-sm !text-[10px]"
                            >Ctrl+Alt+{{ textLevel.level }}</Badge
                        >
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
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
            <Popover v-model:open="linkDialogOpen">
                <PopoverTrigger>
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                @update:pressed="linkDialogOpen = true"
                            >
                                <Link class="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent> Create link </TooltipContent>
                    </Tooltip>
                </PopoverTrigger>
                <PopoverContent class="w-96">
                    <form @submit="handleFormSubmit" class="flex flex-col gap-4">
                        <FormField
                            v-slot="{ componentField }"
                            name="url"
                            :validate-on-model-update="linkForm.submitCount.value > 0"
                            :validate-on-blur="false"
                        >
                            <FormItem>
                                <FormLabel>Url</FormLabel>
                                <FormControl>
                                    <Input
                                        :default-value="editor.getAttributes('link').href"
                                        v-bind="componentField"
                                        placeholder="https://www.example.com"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" name="displayText">
                            <FormItem>
                                <FormLabel
                                    >Display text
                                    <span class="text-muted-foreground">(optional)</span></FormLabel
                                >
                                <FormControl>
                                    <Input v-bind="componentField" placeholder="Example" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ value, handleChange }" name="openInSameTab">
                            <FormItem
                                class="flex flex-row items-center justify-between rounded-lg border p-4"
                            >
                                <div class="space-y-0.5">
                                    <FormLabel class="text-base"> Open in same tab </FormLabel>
                                    <FormDescription>
                                        Control whether links open in the same tab or a new tab.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch :checked="value" @update:checked="handleChange" />
                                </FormControl>
                            </FormItem>
                        </FormField>
                        <!-- For submitting form on Enter -->
                        <input type="submit" hidden />
                    </form>
                </PopoverContent>
            </Popover>
        </div>
    </div>
</template>
