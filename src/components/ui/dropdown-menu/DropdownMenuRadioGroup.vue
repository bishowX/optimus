<script setup lang="ts">
import {
    DropdownMenuRadioGroup,
    type DropdownMenuRadioGroupProps,
    useForwardPropsEmits,
} from "radix-vue"

const props = defineProps<DropdownMenuRadioGroupProps>()
const emits = defineEmits<{
    (e: "update:modelValue", payload: string): void
}>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
    <DropdownMenuRadioGroup v-bind="forwarded">
        <slot />
    </DropdownMenuRadioGroup>
</template>
