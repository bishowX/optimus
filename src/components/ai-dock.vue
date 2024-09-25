<template>
    <div class="fixed bottom-0 left-0 right-0 p-4">
        <div
            :class="
                cn(
                    'mx-auto transition-all duration-300 ease-in-out',
                    isFocused ? 'max-w-2xl' : 'max-w-sm',
                )
            "
        >
            <div
                class="relative bg-background rounded-lg shadow-lg transition-all duration-300 ease-in-out"
            >
                <Input
                    v-model="prompt"
                    @focus="isFocused = true"
                    @blur="handleBlur"
                    @keydown.enter="handleEnter"
                    placeholder="Enter your prompt here..."
                    class="w-full resize-none transition-all duration-300 ease-in-out"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Input from "./ui/input/Input.vue"
import { cn } from "@/lib/utils"

const prompt = ref("")
const isFocused = ref(false)

const handleBlur = () => {
    isFocused.value = false
}

const handleEnter = () => {
    console.log("Enter")
}
</script>

<style scoped>
textarea {
    transition: all 0.3s ease-in-out;
}
</style>
