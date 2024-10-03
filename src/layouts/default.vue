<script setup lang="ts">
import { ref, watch } from "vue"
import { RouterView } from "vue-router"
import { onKeyStroke, useMediaQuery } from "@vueuse/core"

import { cn } from "@/lib/utils"
import type { LinkProp } from "@/components/layout/side-nav.vue"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import SideNav from "@/components/layout/side-nav.vue"
import CommandPalette from "@/components/command-palette.vue"

const defaultLayout = [15, 85]
const navPanelRef = ref<InstanceType<typeof ResizablePanel> | null>(null)
const navCollapsedSize = 4
const isCollapsed = ref(false)

function onCollapse() {
    isCollapsed.value = true
}

function onExpand() {
    isCollapsed.value = false
}

function toggleSidebar() {
    if (isCollapsed.value) {
        navPanelRef.value?.expand()
    } else {
        navPanelRef.value?.collapse()
    }
}

const isSmallScreen = useMediaQuery("(max-width: 1199px)")

watch(isSmallScreen, (n) => {
    if (n) navPanelRef.value?.collapse()
    else navPanelRef.value?.expand()
})

onKeyStroke("[", () => navPanelRef.value?.collapse())
onKeyStroke("]", () => navPanelRef.value?.expand())

const links: LinkProp[] = [
    {
        title: "Contents",
        icon: "lucide:file-search-2",
        link: "/contents",
    },
    {
        title: "Create Content",
        icon: "lucide:file-plus",
        link: "/contents/create",
    },
]
</script>

<template>
    <div class="flex flex-col">
        <CommandPalette />
        <!-- <AiDock /> -->

        <div class="flex">
            <!-- side bar -->
            <ResizablePanelGroup
                id="resize-panel-group-1"
                direction="horizontal"
                class="h-full min-h-screen items-stretch"
            >
                <ResizablePanel
                    ref="navPanelRef"
                    id="resize-panel-1"
                    :default-size="defaultLayout[0]"
                    :collapsed-size="navCollapsedSize"
                    collapsible
                    :min-size="10"
                    :max-size="20"
                    class="max-h-screen transition-all duration-300 ease-in-out"
                    :class="cn(isCollapsed && 'min-w-[50px]')"
                    @expand="onExpand"
                    @collapse="onCollapse"
                >
                    <SideNav
                        @toggle-collapse="toggleSidebar"
                        :is-collapsed="isCollapsed"
                        :links="links"
                    />
                </ResizablePanel>
                <ResizableHandle id="resize-handle-1" with-handle />

                <ResizablePanel id="resize-panel-3" :default-size="defaultLayout[1]">
                    <!-- Content -->
                    <div class="custom-scrollbar h-full max-h-screen overflow-y-auto">
                        <RouterView />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    </div>
</template>
