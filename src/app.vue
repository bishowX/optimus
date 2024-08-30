<script setup lang="ts">
import { TooltipProvider } from "@/components/ui/tooltip"
</script>

<template>
    <TooltipProvider disableHoverableContent :delay-duration="0">
        <RouterView />
    </TooltipProvider>
</template>
