<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { RouterLink } from "vue-router"

export interface LinkProp {
    title: string
    label?: string
    icon: string
    link: string
}

interface NavProps {
    isCollapsed: boolean
    links: LinkProp[]
}

defineProps<NavProps>()
</script>

<template>
    <div
        :data-collapsed="isCollapsed"
        class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
        <nav
            class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
        >
            <template v-for="(link, index) of links">
                <Tooltip v-if="isCollapsed" :key="`1-${index}`" :delay-duration="0">
                    <TooltipTrigger as-child>
                        <RouterLink
                            custom
                            :to="link.link"
                            v-slot="{ isExactActive: isActive, href, navigate }"
                        >
                            <a
                                :href="href"
                                @click="navigate"
                                v-bind="$attrs"
                                :class="
                                    cn(
                                        'h-9 w-9',
                                        isActive
                                            ? buttonVariants({ variant: 'default', size: 'icon' })
                                            : buttonVariants({ variant: 'ghost', size: 'icon' }),
                                        isActive &&
                                            'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
                                    )
                                "
                            >
                                <Icon :icon="link.icon" class="size-4" />
                                <span class="sr-only">{{ link.title }}</span>
                            </a>
                        </RouterLink>
                    </TooltipTrigger>
                    <TooltipContent side="right" class="flex items-center gap-4">
                        {{ link.title }}
                        <span v-if="link.label" class="ml-auto text-muted-foreground">
                            {{ link.label }}
                        </span>
                    </TooltipContent>
                </Tooltip>

                <RouterLink
                    :key="`2-${index}`"
                    v-else
                    custom
                    :to="link.link"
                    v-slot="{ isExactActive: isActive, href, navigate }"
                >
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
                                isActive &&
                                    'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white'
                            )
                        "
                    >
                        <Icon :icon="link.icon" class="mr-2 size-4" />
                        {{ link.title }}
                        <span
                            v-if="link.label"
                            :class="cn('ml-auto', isActive && 'text-background dark:text-white')"
                        >
                            {{ link.label }}
                        </span>
                    </a>
                </RouterLink>
            </template>
        </nav>
    </div>
</template>
