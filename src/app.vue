<script setup lang="ts">
import { ref, onMounted, type ComponentInstance } from "vue"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import NavigationIndicator from "@/components/navigation-indicator.vue"
import { router } from "./router"
import { useColorMode } from "@vueuse/core"

const navigationIndicator = ref<ComponentInstance<typeof NavigationIndicator> | null>(null)

onMounted(() => {
    router.beforeEach((to, from, next) => {
        navigationIndicator.value?.start()
        next()
    })

    router.afterEach(() => {
        navigationIndicator.value?.finish()
    })
})

const mode = useColorMode()
</script>

<template>
    <TooltipProvider disableHoverableContent :delay-duration="0">
        <NavigationIndicator ref="navigationIndicator" />
        <RouterView />
        <Toaster richColors :theme="mode === 'auto' ? 'system' : mode" />
    </TooltipProvider>
</template>
