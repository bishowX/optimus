<script setup lang="ts">
import { useForm } from "vee-validate"
import * as v from "valibot"
import { toTypedSchema } from "@vee-validate/valibot"

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
import { ref } from "vue"

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
    v.pipe(
        v.object({
            first_name: v.pipe(v.string(), v.minLength(1, "First name is required.")),
            last_name: v.pipe(v.string(), v.minLength(1, "Last name is required.")),
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
            confirm_password: v.string("Confirm password is required."),
        }),
        v.forward(
            v.partialCheck(
                [["password"], ["confirm_password"]],
                (input) => input.password === input.confirm_password,
                "Passwords do not match.",
            ),
            ["confirm_password"],
        ),
    ),
)

const { handleSubmit, setFieldError } = useForm({
    validationSchema: formSchema,
    initialValues: {
        confirm_password: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
    },
})

const loading = ref(false)
const error = ref("")
const onSubmit = handleSubmit(async (values) => {
    try {
        error.value = ""
        loading.value = true
        const resp = await api.post("/auth/signup", values)
    } catch (err: any) {
        if (err?.response?.data === "User already exists") {
            setFieldError("email", "This email is already used!")
        } else error.value = err?.response?.data || "Something went wrong! Please try again later."
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <form @submit="onSubmit" class="flex flex-grow items-center justify-center">
        <Card class="mx-auto my-auto max-w-md">
            <CardHeader>
                <Alert v-auto-animate v-show="error" variant="destructive">
                    <AlertCircle class="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {{ error }}
                    </AlertDescription>
                </Alert>
                <CardTitle class="text-xl"> Sign Up </CardTitle>
                <CardDescription> Enter your information to create an account </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid gap-4">
                    <div class="grid grid-cols-2 gap-6">
                        <FormField v-slot="{ componentField }" name="first_name">
                            <FormItem v-auto-animate>
                                <FormLabel>First name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Jon" v-bind="componentField" />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" name="last_name">
                            <FormItem v-auto-animate>
                                <FormLabel>Last name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" v-bind="componentField" />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
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
                            <FormLabel>Password</FormLabel>
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
                    <FormField v-slot="{ componentField }" name="confirm_password">
                        <FormItem v-auto-animate>
                            <FormLabel>Confirm Password</FormLabel>
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
                        <span v-if="loading">Creating account...</span>
                        <span v-else>Create an account</span>
                    </Button>
                </div>
                <div class="mt-4 text-center text-sm">
                    Already have an account?
                    <RouterLink to="/login" class="underline"> Sign in </RouterLink>
                </div>
            </CardContent>
        </Card>
    </form>
</template>

<route lang="yaml">
meta:
    layout: auth
</route>
