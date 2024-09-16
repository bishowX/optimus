<script setup lang="ts">
import { ref } from "vue"
import { toast } from "vue-sonner"
import { useForm } from "vee-validate"
import * as v from "valibot"
import { toTypedSchema } from "@vee-validate/valibot"
import Cookies from "universal-cookie"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-vue-next"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { api } from "@/lib/axios"
import { useRouter } from "vue-router"
import { Separator } from "@/components/ui/separator"

function validatePassword(password: string): boolean {
    const minLength = 8
    const maxLength = 32
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/
    const uppercaseRegex = /[A-Z]/
    const lowercaseRegex = /[a-z]/
    const numberRegex = /[0-9]/

    if (password.length < minLength) {
        return false
    }

    if (password.length > maxLength) {
        return false
    }

    if (!specialCharacterRegex.test(password)) {
        return false
    }

    if (!uppercaseRegex.test(password)) {
        return false
    }

    if (!lowercaseRegex.test(password)) {
        return false
    }

    if (!numberRegex.test(password)) {
        return false
    }

    return true
}

const formSchema = toTypedSchema(
    v.object({
        email: v.pipe(v.string(), v.email("Enter a valid email.")),
        password: v.pipe(
            v.string(),
            v.minLength(8, "Password must be at least 8 characters long."),
            v.maxLength(32, "Password must be no more than 32 characters long."),
            v.custom(
                (input) => validatePassword(input as string),
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
            ),
        ),
    }),
)

const { handleSubmit, setFieldError, setFieldValue } = useForm({
    validationSchema: formSchema,
    initialValues: {
        email: "",
        password: "",
    },
})

const router = useRouter()

const loading = ref(false)
const error = ref("")
const onSubmit = handleSubmit(async (values) => {
    try {
        error.value = ""
        loading.value = true
        const resp = await api.post<{ access: string; refresh: string }>("/auth/login", values)
        const cookies = new Cookies(null, { path: "/" })
        cookies.set("access_token", resp.data.access)
        cookies.set("refresh_token", resp.data.refresh)
        router.replace("/")
    } catch (err: any) {
        error.value = err?.response?.data || "Something went wrong! Please try again later."
    } finally {
        loading.value = false
    }
})

const loginAsEditor = () => {
    setFieldValue("email", "editor@optimus.com")
    setFieldValue("password", "Secure_passwd@123")
    onSubmit()
}

const loginAsAdmin = () => {
    toast("Not implemented!", {
        description:
            "Admin access hasn't been implemented yet! but hang tight we are working on it.",
        action: {
            label: "Okay",
            onClick: () => console.log("Undo"),
        },
    })
}
</script>

<template>
    <form @submit="onSubmit" class="flex-grow w-full flex justify-center items-center">
        <Card class="mx-auto w-full my-auto max-w-md">
            <CardHeader v-auto-animate>
                <Alert v-if="error" variant="destructive">
                    <AlertCircle class="w-4 h-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {{ error }}
                    </AlertDescription>
                </Alert>
                <CardTitle class="text-xl"> Login </CardTitle>
                <CardDescription> Enter your email below to login to your account </CardDescription>
            </CardHeader>
            <CardContent v-auto-animate>
                <div class="grid gap-4">
                    <FormField v-slot="{ componentField }" name="email">
                        <FormItem v-auto-animate>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="me@example.com" v-bind="componentField" />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="password">
                        <FormItem v-auto-animate>
                            <div class="flex items-center">
                                <FormLabel>Password </FormLabel>
                                <a href="#" class="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </a>
                            </div>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="**********"
                                    v-bind="componentField"
                                />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <Button type="submit" class="w-full" :disabled="loading">
                        <span v-if="loading">Logging in...</span>
                        <span v-else>Login</span>
                    </Button>

                    <div class="flex items-center gap-2">
                        <Separator class="shrink h-0.5 w-full" orientation="horizontal" />
                        <p class="shrink-0 text-sm text-muted-foreground">Or use dummy accounts</p>
                        <Separator class="shrink h-0.5 w-full" orientation="horizontal" />
                    </div>

                    <div class="flex items-center justify-between gap-4">
                        <Button
                            type="button"
                            @click="loginAsEditor"
                            variant="outline"
                            class="w-full"
                            :disabled="loading"
                        >
                            <span v-if="loading">Logging in...</span>
                            <span v-else>Login as Editor</span>
                        </Button>
                        <Button
                            type="button"
                            @click="loginAsAdmin"
                            variant="outline"
                            class="w-full"
                            :disabled="loading"
                        >
                            <span v-if="loading">Logging in...</span>
                            <span v-else>Login as Admin</span>
                        </Button>
                    </div>
                </div>
                <div class="mt-4 text-center text-sm">
                    Don't' have an account?
                    <RouterLink to="/signup" class="underline"> Sign Up </RouterLink>
                </div>
            </CardContent>
        </Card>
    </form>
</template>

<route lang="yaml">
meta:
    layout: auth
</route>
