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
                class="relative bg-background flex items-center rounded-lg shadow-lg transition-all duration-300 ease-in-out"
            >
                <Input
                    :disabled="loading"
                    v-model="prompt"
                    @focus="isFocused = true"
                    @blur="handleBlur"
                    @keydown.enter="handleEnter"
                    placeholder="Enter your prompt here..."
                    class="w-full resize-none transition-all duration-300 ease-in-out"
                />
                <LoaderCircle v-if="loading" class="w-8 h-8 -ml-9 animate-spin" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Input from "./ui/input/Input.vue"
import { cn } from "@/lib/utils"
import { useRouter } from "vue-router"
import { LoaderCircle } from "lucide-vue-next"
import { toast } from "vue-sonner"

const prompt = ref("")
const isFocused = ref(false)

const handleBlur = () => {
    isFocused.value = false
}

const router = useRouter()

const loading = ref(false)
const ai = async () => {
    let bq = prompt.value

    try {
        prompt.value = ""
        loading.value = true

        const resp = await fetch("http://localhost:3009/api/ai", {
            method: "POST",
            body: JSON.stringify({
                query: bq,
            }),
        })
        const a = await resp.json()
        const json = JSON.parse(a)
        console.log("ai resp: ", json)

        if (json.action === "FETCH_CONTENT") {
            router.push({
                path: json.route,
                query: json.parameters,
            })
        } else if (json.action === "NAVIGATE_TO") {
            router.push(json.route)
        }
    } catch {
        prompt.value = bq
        toast.error("Oh No! Our AI doesn't seem to respond at this moment", {
            action: {
                label: "Okay",
                onClick: () => {},
            },
        })
    } finally {
        loading.value = false
    }
}

const handleEnter = () => {
    console.log("Enter ", prompt.value)
    ai()
}
</script>

<style scoped>
textarea {
    transition: all 0.3s ease-in-out;
}
</style>
