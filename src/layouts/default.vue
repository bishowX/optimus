<script setup lang="ts">
import { ref } from "vue"
import { RouterLink, RouterView } from "vue-router"

import Nav from "@/components/layout/top-nav.vue"
import type { LinkProp } from "@/components/layout/top-nav.vue"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import UserNav from "@/components/layout/user-nav.vue"
import ThemeSwitcher from "@/components/theme-switcher.vue"

const defaultLayout = [15, 85]
const navPanelRef = ref<InstanceType<typeof ResizablePanel>>()
const navCollapsedSize = 4
const isCollapsed = ref(false)

function onCollapse() {
    isCollapsed.value = true
}

function onExpand() {
    isCollapsed.value = false
}

const links: LinkProp[] = [
    {
        title: "Contents",
        icon: "lucide:file-search-2",
        link: "/contents"
    },
    {
        title: "Create Content",
        icon: "lucide:file-plus",
        link: "/contents/create"
    }
]
</script>

<template>
    <div class="flex flex-col">
        <!-- top nav -->
        <div class="border-b">
            <div class="flex h-16 items-center px-4">
                <nav class="flex items-center space-x-4 lg:space-x-6)">
                    <h1 class="text-4xl"><RouterLink to="/">Optimus</RouterLink></h1>
                    <Separator :decorative="true" orientation="vertical" class="h-10" />
                    <RouterLink
                        activeClass="text-primary"
                        to="/overview"
                        class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Overview
                    </RouterLink>
                    <RouterLink
                        to="/about"
                        activeClass="text-primary"
                        class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        About
                    </RouterLink>
                </nav>
                <div class="ml-auto flex items-center space-x-4">
                    <ThemeSwitcher />
                    <UserNav />
                </div>
            </div>
        </div>

        <div class="flex">
            <!-- side bar -->
            <TooltipProvider :delay-duration="0">
                <ResizablePanelGroup
                    id="resize-panel-group-1"
                    direction="horizontal"
                    class="h-full min-h-[calc(100vh-4.0625rem)] items-stretch"
                >
                    <ResizablePanel
                        ref="navPanelRef"
                        id="resize-panel-1"
                        :default-size="defaultLayout[0]"
                        :collapsed-size="navCollapsedSize"
                        collapsible
                        :min-size="13"
                        :max-size="20"
                        class="transition-all duration-300 ease-in-out"
                        :class="cn(isCollapsed && 'min-w-[50px]')"
                        @expand="onExpand"
                        @collapse="onCollapse"
                    >
                        <Nav :is-collapsed="isCollapsed" :links="links" />
                    </ResizablePanel>
                    <ResizableHandle
                        id="resize-handle-1"
                        with-handle
                        @click="
                            navPanelRef?.isCollapsed
                                ? navPanelRef?.expand()
                                : navPanelRef?.collapse()
                        "
                    />

                    <ResizablePanel
                        id="resize-panel-3"
                        :default-size="defaultLayout[1]"
                        class="p-4"
                    >
                        <!-- Content -->
                        <RouterView />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </TooltipProvider>
        </div>
    </div>
</template>
