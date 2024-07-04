<script setup lang="ts">
import DefaultLayout from "@/layouts/default.vue"
import { TooltipProvider } from "@/components/ui/tooltip"
</script>

<template>
    <TooltipProvider disableHoverableContent :delay-duration="0">
        <DefaultLayout />
    </TooltipProvider>
</template>
