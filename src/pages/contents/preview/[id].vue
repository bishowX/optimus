<script setup lang="ts">
import type { Content } from "@/data/content"
import { useStorage } from "@vueuse/core"
import { useRoute } from "vue-router/auto"
import { format } from "date-fns"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ref, onMounted, onUnmounted } from "vue"
import { api } from "@/lib/axios"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-vue-next"

const route = useRoute()
const id = (route.params as { id: string }).id

const content = ref<Content | null>(null)

const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy")
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number | null = null

interface Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    hue: number
}

let particles: Particle[] = []
const particleCount = 100
const connectionDistance = 150

const initCanvas = () => {
    if (!canvasRef.value || !containerRef.value) return
    ctx = canvasRef.value.getContext("2d")
    if (!ctx) return

    const navbarHeight = 64
    const containerPadding = 16
    const { width } = containerRef.value.getBoundingClientRect()
    const height = window.innerHeight - navbarHeight - containerPadding * 2

    canvasRef.value.width = width
    canvasRef.value.height = height

    particles = []
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 0.3 - 0.15,
            speedY: Math.random() * 0.3 - 0.15,
            hue: Math.random() * 360,
        })
    }
}

const drawParticle = (particle: Particle) => {
    if (!ctx) return
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${particle.hue}, 100%, 50%, 0.8)`
    ctx.fill()
}

const drawConnections = () => {
    if (!ctx) return
    ctx.lineWidth = 0.5

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < connectionDistance) {
                const opacity = 1 - distance / connectionDistance
                ctx.strokeStyle = `hsla(${(particles[i].hue + particles[j].hue) / 2}, 100%, 50%, ${opacity})`
                ctx.beginPath()
                ctx.moveTo(particles[i].x, particles[i].y)
                ctx.lineTo(particles[j].x, particles[j].y)
                ctx.stroke()
            }
        }
    }
}

const animate = () => {
    if (!ctx || !canvasRef.value) return

    ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)

    particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvasRef.value!.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvasRef.value!.height) particle.speedY *= -1

        drawParticle(particle)
    })

    drawConnections()

    animationFrameId = requestAnimationFrame(animate)
}

const loading = ref(false)
const error = ref("")

onMounted(async () => {
    initCanvas()
    animate()
    window.addEventListener("resize", initCanvas)

    try {
        error.value = ""
        loading.value = true
        const res = await api.get(`/contents/${id}`)
        content.value = res.data
    } catch (e: any) {
        error.value = e?.message || "Something went wrong! Please try again later."
    } finally {
        loading.value = false
    }
})

onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    window.removeEventListener("resize", initCanvas)
})
</script>

<template>
    <div v-if="content" class="prose mx-auto max-w-4xl pt-4 dark:prose-invert">
        <span class="mb-2 inline-block text-sm text-gray-500">{{
            formatDate(content.published_on)
        }}</span>
        <h1>{{ content.title }}</h1>
        <p>{{ content.snippet }}</p>
        <div v-html="content.content" v-parse-line-chart></div>
    </div>
    <div
        v-else-if="!error && !loading"
        ref="containerRef"
        class="relative flex h-full flex-col items-center justify-center overflow-hidden bg-background"
    >
        <canvas ref="canvasRef" class="absolute left-0 top-0 h-full w-full"></canvas>
        <div class="z-10 text-center">
            <h1 class="mb-4 text-4xl font-bold text-foreground">
                <span class="inline-block animate-bounce">4</span>
                <span class="inline-block animate-ping">0</span>
                <span class="inline-block animate-spin">4</span>
                <span class="ml-2 inline-block animate-pulse">Page Not Found</span>
            </h1>
            <p class="mb-2 text-xl text-muted-foreground">
                Oops! The content you're looking for doesn't exist.
            </p>
            <p class="mb-8 text-sm text-muted-foreground">
                This is likely caused because of you fucking up the url.
            </p>
            <RouterLink
                to="/contents"
                :class="cn(buttonVariants({ variant: 'default', size: 'lg' }))"
            >
                Go Back to Contents
            </RouterLink>
        </div>
    </div>
    <Alert v-if="error" variant="destructive">
        <AlertCircle class="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
            {{ error }}
        </AlertDescription>
    </Alert>
</template>

<style scoped>
:deep(img) {
    width: 100%;
}
</style>
