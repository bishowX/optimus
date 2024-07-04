<script setup lang="ts">
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "vue"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
    <kbd
        :class="
            cn(
                'inline-flex items-center justify-center rounded-md bg-muted px-2 py-1 text-xs font-mono text-muted-foreground',
                props.class
            )
        "
    >
        <slot />
    </kbd>
</template>
