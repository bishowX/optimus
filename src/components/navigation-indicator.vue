<template>
    <div v-show="isLoading" class="fixed top-0 left-0 w-full h-1 z-50 overflow-hidden">
        <!-- The primary progress bar line that grows in width based on progress value -->
        <div
            class="absolute rounded-full bottom-0 left-0 h-full bg-blue-400 transition-all duration-300 ease-out"
            :style="{ width: `${progress}%` }"
        ></div>

        <!-- The secondary animated line that appears after progress reaches a certain threshold -->
        <div
            v-show="showSecondLine"
            class="absolute rounded-full top-0 left-0 h-full overflow-hidden transition-all duration-300 ease-out"
            :style="{ width: `${progress}%` }"
        >
            <div
                class="rounded-full w-full h-full bg-gradient-to-r from-transparent via-blue-700 to-transparent animate-moveRight"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue"

const isLoading = ref(false)
const progress = ref(0)
const showSecondLine = ref(false)

let intervalId: any
let timeoutId: any

const start = () => {
    // Delay the start of loading to avoid immediate display
    timeoutId = setTimeout(() => {
        isLoading.value = true
        progress.value = 0
        showSecondLine.value = false

        // Increment progress at different rates to simulate a loading experience
        intervalId = setInterval(() => {
            if (progress.value < 70) {
                // Fast increment for initial progress
                progress.value += 5
            } else if (progress.value < 90) {
                // Slow increment for final stages and show secondary line
                progress.value += 0.5
                if (!showSecondLine.value) showSecondLine.value = true
            }
        }, 100)
    }, 300)
}

const finish = () => {
    // Clear any pending timeouts or intervals
    clearTimeout(timeoutId)
    clearInterval(intervalId)

    // Complete progress bar and hide it after a short delay
    progress.value = 100
    setTimeout(() => {
        isLoading.value = false
        progress.value = 0
        showSecondLine.value = false
    }, 300)
}

onUnmounted(() => {
    clearTimeout(timeoutId)
    clearInterval(intervalId)
})

defineExpose({ start, finish })
</script>

<style scoped>
@keyframes moveRight {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

.animate-moveRight {
    animation: moveRight 2s linear infinite;
}
</style>
