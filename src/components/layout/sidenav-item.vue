<script setup lang="ts">
import { cn } from "@/lib/utils"
import { RouterLink } from "vue-router"
import { buttonVariants } from "@/components/ui/button"
import { Icon } from "@iconify/vue"

defineProps<{
    title: string
    label?: string
    icon: string
    link: string
    collapsed?: boolean
}>()
</script>

<template>
    <RouterLink custom :to="link" v-slot="{ isExactActive: isActive, href, navigate }">
        <a
            v-bind="$attrs"
            :href="href"
            @click="navigate"
            :class="
                cn(
                    isActive
                        ? buttonVariants({ variant: 'default', size: 'sm' })
                        : buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'justify-start',
                )
            "
        >
            <Icon :icon="icon" :class="cn(!collapsed && 'mr-2', 'size-5')" />
            <template v-if="!collapsed">
                {{ title }}
                <span
                    v-if="label"
                    :class="cn('ml-auto', isActive && 'text-background dark:text-white')"
                >
                    {{ label }}
                </span>
            </template>
        </a>
    </RouterLink>
</template>
