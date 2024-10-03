<script setup lang="ts">
import { ref, computed } from "vue"
import { RouterLink } from "vue-router"
import { ChevronDown } from "lucide-vue-next"
import { Icon } from "@iconify/vue"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import SidenavItem from "./sidenav-item.vue"

export type LinkProp = {
    title: string
    label?: string
    icon: string
    link: string
}

type NavProps = {
    isCollapsed: boolean
    links: LinkProp[]
}

type MenuSection = {
    title: string
    icon: string
    items: LinkProp[]
}

type MenuItem = LinkProp | MenuSection

const props = withDefaults(defineProps<NavProps>(), {
    isCollapsed: false,
    links: () => [],
})

const emit = defineEmits<{
    (e: "toggleCollapse"): void
}>()

const openSections = ref<Record<string, boolean>>({})

const menuItems: MenuItem[] = [
    { icon: "lucide:home", link: "/", title: "Dashboard" },
    { icon: "lucide:users", link: "/users", title: "Users" },
    {
        title: "Manage Content",
        icon: "lucide:wrench",
        items: [
            { icon: "lucide:file-search-2", link: "/contents/create", title: "Propriety content" },
            {
                icon: "lucide:file-search",
                label: "99",
                link: "/overview",
                title: "Data visualization",
            },
            { icon: "lucide:activity", link: "/about", title: "Event" },
            { icon: "lucide:airplay", link: "/contents", title: "Other content" },
        ],
    },
    {
        title: "Monitoring",
        icon: "lucide:air-vent",
        items: [
            { icon: "lucide:alarm-clock", link: "/contents/create4", title: "Monitoring" },
            {
                icon: "lucide:alarm-smoke",
                label: "69",
                link: "/contents/create5",
                title: "Brief builder",
            },
            { icon: "lucide:sailboat", link: "/contents/create6", title: "Add story" },
        ],
    },
    { icon: "lucide:settings", link: "/settings", title: "Settings" },
]

const toggleSection = (title: string) => {
    openSections.value[title] = !openSections.value[title]
}

const isSection = (item: MenuItem): item is MenuSection => "items" in item

const isSectionOpen = computed(() => (title: string) => openSections.value[title] || false)
</script>

<template>
    <aside
        :data-collapsed="props.isCollapsed"
        class="grid gap-3 py-3 data-[collapsed=true]:justify-center"
    >
        <div
            class="flex items-center gap-x-4 gap-y-2"
            :class="props.isCollapsed ? 'flex-col px-1' : 'flex-row justify-between pl-5 pr-2'"
        >
            <h1 class="text-2xl transition-all duration-300 ease-in-out">
                <RouterLink to="/">{{ props.isCollapsed ? "O" : "Optimus" }}</RouterLink>
            </h1>
            <Tooltip>
                <TooltipTrigger as-child>
                    <Button @click="emit('toggleCollapse')" variant="ghost" size="icon">
                        <Icon
                            :icon="
                                props.isCollapsed
                                    ? 'lucide:panel-left-open'
                                    : 'lucide:panel-left-close'
                            "
                            class="size-5"
                        />
                        <span class="sr-only"
                            >{{ props.isCollapsed ? "Expand" : "Collapse" }} side bar</span
                        >
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    {{ props.isCollapsed ? "Expand" : "Collapse" }} sidebar
                </TooltipContent>
            </Tooltip>
        </div>

        <Separator orientation="horizontal" />

        <div class="flex flex-col gap-3" :class="props.isCollapsed ? 'items-center px-1' : 'px-2'">
            <template v-for="item in menuItems" :key="isSection(item) ? item.title : item.link">
                <!-- Independent link -->
                <template v-if="!isSection(item)">
                    <Tooltip v-if="props.isCollapsed">
                        <TooltipTrigger asChild>
                            <SidenavItem v-bind="item" :collapsed="true" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            {{ item.title }}
                        </TooltipContent>
                    </Tooltip>
                    <SidenavItem v-else v-bind="item" />
                </template>

                <!-- Section with nested items -->
                <template v-else>
                    <HoverCard v-if="props.isCollapsed" :open-delay="0" :close-delay="0">
                        <HoverCardTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <Icon :icon="item.icon" class="size-5" />
                            </Button>
                        </HoverCardTrigger>
                        <HoverCardContent side="right" :side-offset="24" class="px-1">
                            <div class="flex flex-col gap-1">
                                <SidenavItem
                                    v-for="subItem in item.items"
                                    :key="subItem.title"
                                    v-bind="subItem"
                                />
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                    <Collapsible
                        v-else
                        :open="isSectionOpen(item.title)"
                        @update:open="toggleSection(item.title)"
                    >
                        <CollapsibleTrigger as-child>
                            <Button variant="ghost" size="sm" class="w-full justify-start">
                                <Icon :icon="item.icon" class="mr-2 size-5" />
                                {{ item.title }}
                                <ChevronDown
                                    class="ml-auto transition-all duration-300"
                                    :class="{ 'rotate-180': isSectionOpen(item.title) }"
                                />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent class="mt-1 flex flex-col gap-1 pl-4">
                            <SidenavItem
                                v-for="subItem in item.items"
                                :key="subItem.title"
                                v-bind="subItem"
                            />
                        </CollapsibleContent>
                    </Collapsible>
                </template>
            </template>
        </div>
    </aside>
</template>
