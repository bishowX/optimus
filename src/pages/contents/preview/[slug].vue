<script setup lang="ts">
import type { Content } from "@/data/content"
import { useStorage } from "@vueuse/core"
import { useRoute } from "vue-router/auto"
import { format } from "date-fns"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const route = useRoute()
const slug = (route.params as { slug: string }).slug
const contents = useStorage<Content[]>("contents", [])

const content = contents.value.find((c) => c.slug === slug)

const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy")
}
</script>

<template>
    <div v-if="content" class="prose dark:prose-invert mx-auto max-w-4xl pt-4">
        <span class="text-sm text-gray-500 inline-block mb-2">{{
            formatDate(content.publishedOn)
        }}</span>
        <h1>{{ content.title }}</h1>
        <p>{{ content.snippet }}</p>
        <div v-html="content.content" v-parse-line-chart></div>
    </div>
    <div
        v-else
        class="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden"
    >
        <svg
            class="absolute top-0 left-0 w-full h-full opacity-10"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                        d="M 0 20 C 10 10, 30 10, 40 20 C 30 30, 10 30, 0 20"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div class="z-10 text-center">
            <h1 class="text-4xl font-bold text-foreground mb-4">Page Not Found</h1>
            <p class="text-xl text-muted-foreground mb-8">
                Oops! The content you're looking for doesn't exist.
            </p>
            <RouterLink
                to="/contents"
                :class="cn(buttonVariants({ variant: 'default', size: 'lg' }))"
            >
                Go Back to Contents
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
:deep(img) {
    width: 100%;
}
</style>
