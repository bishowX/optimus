<script setup lang="ts">
import UserNav from "@/components/layout/user-nav.vue"
import ThemeSwitcher from "@/components/layout/theme-switcher.vue"
import { RouterView } from "vue-router"
</script>

<template>
    <div class="min-h-screen w-full flex flex-col">
        <div class="border-b">
            <div class="flex h-16 items-center px-4">
                <div class="ml-auto flex items-center space-x-4">
                    <ThemeSwitcher />
                </div>
            </div>
        </div>
        <RouterView />
    </div>
</template>
