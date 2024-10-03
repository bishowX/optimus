<script lang="ts" setup>
import { ref } from "vue"
import { RouterLink } from "vue-router"
import { ChevronDown } from "lucide-vue-next"
import { Icon } from "@iconify/vue"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import SidenavItem from "./sidenav-item.vue"

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

const isOpen = ref(false)
const isOpen2 = ref(false)

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
                    <Button @click="() => emits('toggleCollapse')" variant="ghost" size="icon">
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

        <div class="flex flex-col gap-3" :class="isCollapsed ? 'items-center px-1' : 'px-2'">
            <div v-if="isCollapsed">
                <HoverCard :open-delay="0" :close-delay="0">
                    <HoverCardTrigger>
                        <Button size="icon" variant="ghost"><Icon icon="lucide:wrench" /></Button>
                    </HoverCardTrigger>
                    <HoverCardContent class="p-1" align="center" side="right">
                        <div class="flex flex-col gap-1">
                            <SidenavItem
                                icon="lucide:file-search-2"
                                link="/contents/create"
                                title="Propriety content"
                            />
                            <SidenavItem
                                icon="lucide:file-search"
                                label="99"
                                link="/about"
                                title="Data visualization"
                            />
                            <SidenavItem icon="lucide:activity" link="/overview" title="Event" />
                            <SidenavItem
                                icon="lucide:airplay"
                                link="/contents"
                                title="Other content"
                            />
                        </div>
                    </HoverCardContent>
                </HoverCard>
            </div>
            <Collapsible v-else v-model:open="isOpen">
                <CollapsibleTrigger as-child>
                    <Button
                        variant="ghost"
                        size="sm"
                        class="w-full justify-between transition-all duration-300"
                    >
                        Manage Content
                        <ChevronDown
                            class="transition-all duration-300"
                            :class="isOpen ? 'rotate-180' : ''"
                        />
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent class="mt-1 flex flex-col gap-1 pl-4">
                    <SidenavItem
                        icon="lucide:file-search-2"
                        link="/contents/create"
                        title="Propriety content"
                    />
                    <SidenavItem
                        icon="lucide:file-search"
                        label="99"
                        link="/401"
                        title="Data visualization"
                    />
                    <SidenavItem icon="lucide:activity" link="400" title="Event" />
                    <SidenavItem icon="lucide:airplay" link="404" title="Other content" />
                </CollapsibleContent>
            </Collapsible>

            <div v-if="isCollapsed">
                <HoverCard :open-delay="0" :close-delay="0">
                    <HoverCardTrigger>
                        <Button size="icon" variant="ghost"><Icon icon="lucide:air-vent" /></Button>
                    </HoverCardTrigger>
                    <HoverCardContent class="flex flex-col gap-1 p-1" align="center" side="right">
                        <SidenavItem
                            icon="lucide:alarm-clock"
                            link="/contents/create1"
                            title="Monitoring"
                        />
                        <SidenavItem
                            icon="lucide:alarm-smoke"
                            label="69"
                            link="/contents/create2"
                            title="Brief builder"
                        />
                        <SidenavItem
                            icon="lucide:sailboat"
                            link="/contents/create3"
                            title="Add story"
                        />
                    </HoverCardContent>
                </HoverCard>
            </div>
            <Collapsible v-else v-model:open="isOpen2">
                <CollapsibleTrigger as-child>
                    <Button
                        variant="ghost"
                        size="sm"
                        class="w-full justify-between transition-all duration-300"
                    >
                        Monitoring
                        <ChevronDown
                            class="transition-all duration-300"
                            :class="isOpen2 ? 'rotate-180' : ''"
                        />
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent class="mt-1 pl-4">
                    <div class="flex flex-col gap-1">
                        <SidenavItem
                            icon="lucide:alarm-clock"
                            link="/contents/create4"
                            title="Monitoring"
                        />
                        <SidenavItem
                            icon="lucide:alarm-smoke"
                            label="69"
                            link="/contents/create5"
                            title="Brief builder"
                        />
                        <SidenavItem
                            icon="lucide:sailboat"
                            link="/contents/create6"
                            title="Add story"
                        />
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    </aside>
</template>
