<script setup lang="ts">
import { ref, watch } from "vue"
import { BubbleMenu, type Editor } from "@tiptap/vue-3"
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/valibot"
import * as v from "valibot"
import { Edit, Link, SquareArrowOutUpRight, Unlink } from "lucide-vue-next"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Toggle } from "@/components/ui/toggle"
import { Input } from "@/components/ui/input"

const props = defineProps<{
    editor: Editor
}>()

const formSchema = toTypedSchema(
    v.object({
        url: v.pipe(v.string(), v.url("Invalid Url")),
        displayText: v.optional(v.string()),
        openInSameTab: v.optional(v.boolean())
    })
)

const form = useForm({
    initialValues: {
        url: "",
        displayText: "",
        openInSameTab: false
    },
    validationSchema: formSchema
})

const dialogOpen = ref(false)

watch(dialogOpen, (newDialogOpen) => {
    if (!newDialogOpen) return

    const state = props.editor.state

    const { $from, $to } = state.selection
    const currentNode = state.doc.nodeAt($from.pos)
    const linkMark = currentNode?.marks?.find((m) => m.type.name === "link")

    // if the cursor is on a link, set the `displayText` to that link's displayText
    // else set it to selected text
    if (linkMark) {
        form.setFieldValue("displayText", currentNode?.text || "")
        form.setFieldValue("openInSameTab", linkMark.attrs.target === "_self")
    } else {
        form.setFieldValue("displayText", state.doc.textBetween($from.pos, $to.pos, " "))
    }

    form.setFieldValue("url", props.editor.getAttributes("link").href || "")
})

const openLink = () => {
    window.open(props.editor.getAttributes("link").href, "_blank")
}

const handleFormSubmit = form.handleSubmit((values) => {
    form.resetForm()
    dialogOpen.value = false

    if (props.editor.getAttributes("link").href) {
        props.editor
            .chain()
            .extendMarkRange("link")
            .updateAttributes("link", { href: values.url })
            .run()
    }

    props.editor
        .chain()
        .focus()
        .insertContent({
            type: "text",
            text: values.displayText || values.url, //use url as displayText it not provided by the user
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

const shouldShowLinkToolbar: InstanceType<typeof BubbleMenu>["$props"]["shouldShow"] = (props) => {
    const { $from } = props.state.selection

    const currentNode = props.state.doc.nodeAt($from.pos)
    const isLinkMark = currentNode?.marks?.find((m) => m.type.name === "link")

    const hasEditorFocus = props.view.hasFocus()

    if (!hasEditorFocus || !props.editor.isEditable || !isLinkMark) {
        return false
    }

    return true
}
</script>

<template>
    <BubbleMenu :should-show="dialogOpen ? () => false : shouldShowLinkToolbar" :editor="editor">
        <div class="flex gap-x-1 items-center rounded-md border bg-background p-1">
            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        @update:pressed="editor.chain().focus().unsetLink().run()"
                        aria-label="Remove link"
                    >
                        <Unlink class="h-4 w-4" />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent> Remove link </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Button
                        variant="ghost"
                        size="icon"
                        @click="dialogOpen = true"
                        aria-label="Edit link"
                        type="button"
                    >
                        <Edit class="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent> Edit link </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Button
                        variant="ghost"
                        size="icon"
                        @click="openLink"
                        aria-label="Open link in a new tab"
                    >
                        <SquareArrowOutUpRight class="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent> Open link in a new tab </TooltipContent>
            </Tooltip>
        </div>
    </BubbleMenu>
    <Popover v-model:open="dialogOpen">
        <PopoverTrigger :disabled="editor.isActive('link')">
            <Tooltip>
                <TooltipTrigger as-child>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        @update:pressed="dialogOpen = true"
                        :disabled="editor.isActive('link')"
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
                    :validate-on-model-update="form.submitCount.value > 0"
                    :validate-on-blur="false"
                >
                    <FormItem>
                        <FormLabel>Url</FormLabel>
                        <FormControl>
                            <Input v-bind="componentField" placeholder="https://www.example.com" />
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
</template>
