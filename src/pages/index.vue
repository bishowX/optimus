<script setup lang="ts">
import { onMounted } from "vue"
import { RouterLink } from "vue-router/auto"

onMounted(async () => {
    console.log(import.meta.env.VITE_API_URL)
})
</script>

<template>
    This a index page
    <RouterLink to="/about">About Page</RouterLink>
</template>
