<script setup lang="ts">
import { useRouter } from "vue-router"
import { useColorMode, useMagicKeys } from "@vueuse/core"

import { ref, watch } from "vue"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"

const open = ref(false)

const { Meta_K, Ctrl_K } = useMagicKeys({
    passive: false,
    onEventFired(e) {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) e.preventDefault()
    },
})

watch([Meta_K, Ctrl_K], (v) => {
    if (v[0] || v[1]) handleOpenChange()
})

function handleOpenChange() {
    open.value = !open.value
}

const router = useRouter()
function navigateTo(path: string) {
    open.value = false
    router.push(path)
}

const mode = useColorMode()
</script>

<template>
    <div>
        <CommandDialog v-model:open="open">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList class="min-h-[300px]">
                <CommandEmpty class="flex min-h-[300px] items-center justify-center"
                    ><span>No results found.</span></CommandEmpty
                >
                <CommandGroup heading="Suggestions">
                    <CommandItem value="dashboard" @select="() => navigateTo('/')">
                        Dashboard
                    </CommandItem>
                    <CommandItem value="contents" @select="() => navigateTo('/contents')">
                        Contents
                    </CommandItem>
                    <CommandItem value="overview" @select="() => navigateTo('/overview')">
                        Overview
                    </CommandItem>
                    <CommandItem value="about" @select="() => navigateTo('/about')">
                        About
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <CommandItem value="profile"> Profile </CommandItem>
                    <CommandItem value="logout" @select="() => navigateTo('/logout')">
                        Logout
                    </CommandItem>
                    <CommandItem value="settings"> Settings </CommandItem>
                    <CommandItem value="billing"> Billing </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Theme">
                    <CommandItem value="dark" @select="mode = 'dark'"> Dark theme </CommandItem>
                    <CommandItem value="light" @select="mode = 'light'"> Light theme </CommandItem>
                    <CommandItem value="system" @select="mode = 'auto'"> System theme </CommandItem>
                    <CommandItem value="settings"> Settings </CommandItem>
                    <CommandItem value="billing"> Billing </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Contents">
                    <CommandItem value="list-all-contents" @select="() => navigateTo('/contents')"
                        >List all contents
                    </CommandItem>
                    <CommandItem
                        value="create-content"
                        @select="() => navigateTo('/contents/create')"
                    >
                        Create content
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    </div>
</template>
