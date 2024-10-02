<script lang="ts" setup>
import { RouterLink } from "vue-router"
import { Icon } from "@iconify/vue"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

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

const emits = defineEmits<{
    (e: "toggleCollapse"): void
}>()
</script>

<template>
    <aside
        :data-collapsed="isCollapsed"
        class="grid gap-3 py-3 data-[collapsed=true]:justify-center"
    >
        <div
            class="flex items-center gap-x-4 gap-y-2"
            :class="isCollapsed ? 'flex-col px-1' : 'flex-row justify-between pl-5 pr-2'"
        >
            <h1 class="text-2xl transition-all duration-300 ease-in-out">
                <RouterLink to="/">{{ isCollapsed ? "O" : "Optimus" }}</RouterLink>
            </h1>
            <Tooltip v-if="isCollapsed">
                <TooltipTrigger as-child>
                    <Button @click="emits('toggleCollapse')" variant="ghost" size="icon">
                        <Icon icon="lucide:panel-left-open" class="size-5" />
                        <span class="sr-only">Expand side bar</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right"> Expand sidebar </TooltipContent>
            </Tooltip>
            <Tooltip v-else>
                <TooltipTrigger as-child>
                    <Button @click="() => emits('toggleCollapse')" variant="ghost" size="icon">
                        <Icon icon="lucide:panel-left-close" class="size-5" />
                        <span class="sr-only">Collapse side bar</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right"> Collapse sidebar </TooltipContent>
            </Tooltip>
        </div>

        <Separator orientation="horizontal" />

        <div class="flex flex-col gap-1" :class="isCollapsed ? 'px-1' : 'px-2'">
            <template v-for="(link, index) of links">
                <Tooltip v-if="isCollapsed" :key="`1-${index}`" :delay-duration="0">
                    <TooltipTrigger>
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
                                            'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white',
                                    )
                                "
                            >
                                <Icon :icon="link.icon" class="size-5" />
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
                                    'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                            )
                        "
                    >
                        <Icon :icon="link.icon" class="mr-2 size-5" />
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
        </div>
    </aside>
</template>
