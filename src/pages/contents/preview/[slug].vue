<script setup lang="ts">
import type { Content } from "@/data/content"
import { useStorage } from "@vueuse/core"
import { useRoute } from "vue-router/auto"

const route = useRoute()
const slug = (route.params as { slug: string }).slug
const contents = useStorage<Content[]>("contents", [])

const content = contents.value.find((c) => c.slug === slug)

console.log("content: ", content)
</script>

<template>
    <div v-if="content" class="prose dark:prose-invert mx-auto lg:prose-xl">
        <h1>{{ content.title }}</h1>
        <p>{{ content.snippet }}</p>
        <div v-html="content.content" v-parse-line-chart></div>
    </div>
</template>
