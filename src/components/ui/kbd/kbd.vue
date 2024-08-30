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
                'inline-flex items-center rounded-sm border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground',
                props.class,
            )
        "
    >
        <slot />
    </kbd>
</template>
