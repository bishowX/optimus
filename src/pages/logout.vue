<script setup lang="ts">
import { useAuth } from "@/composables/useAuth"
import { onMounted } from "vue"

const { logout } = useAuth()

onMounted(async () => {
    try {
        await logout()
    } finally {
        window.location.reload()
    }
})
</script>

<template>
    <div class="flex w-full flex-grow items-center justify-center">
        <h1>Logging out...</h1>
    </div>
</template>

<route lang="yaml">
meta:
    layout: auth
</route>
