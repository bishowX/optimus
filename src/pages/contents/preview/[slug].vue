<script setup lang="ts">
import type { Content } from "@/data/content"
import { useStorage } from "@vueuse/core"
import { useRoute } from "vue-router/auto"
import { format } from "date-fns"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ref, onMounted, onUnmounted } from "vue"

const route = useRoute()
const slug = (route.params as { slug: string }).slug
const contents = useStorage<Content[]>("contents", [])

const content = contents.value.find((c) => c.slug === slug)

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

onMounted(() => {
    initCanvas()
    animate()
    window.addEventListener("resize", initCanvas)
})

onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    window.removeEventListener("resize", initCanvas)
})
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
        ref="containerRef"
        class="flex flex-col items-center justify-center bg-background relative overflow-hidden h-full"
    >
        <canvas ref="canvasRef" class="absolute top-0 left-0 w-full h-full"></canvas>
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
