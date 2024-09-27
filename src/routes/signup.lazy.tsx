import { createLazyFileRoute } from "@tanstack/react-router"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Link } from "@tanstack/react-router"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { api } from "@/lib/axios"

export const Route = createLazyFileRoute("/signup")({
    component: SignupForm,
})

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,32}$/

const formSchema = z
    .object({
        first_name: z.string().min(1, "First name is required."),
        last_name: z.string().min(1, "Last name is required."),
        email: z.string().email("Enter a valid email."),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long.")
            .max(32, "Password must be no more than 32 characters long.")
            .regex(
                passwordRegex,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
            ),
        confirm_password: z.string().min(1, "Confirm password is required."),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match.",
        path: ["confirm_password"],
    })

type FormValues = z.infer<typeof formSchema>

export function SignupForm() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
        },
    })

    const onSubmit = async (values: FormValues) => {
        try {
            setError("")
            setLoading(true)
            await api.post("/auth/signup", values)
            // Handle successful signup (e.g., redirect to login page)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err?.response?.data === "User already exists") {
                form.setError("email", { message: "This email is already used!" })
            } else {
                setError(err?.response?.data || "Something went wrong! Please try again later.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex-grow flex justify-center items-center"
            >
                <Card className="mx-auto my-auto max-w-md">
                    <CardHeader>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="w-4 h-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <CardTitle className="text-xl">Sign Up</CardTitle>
                        <CardDescription>
                            Enter your information to create an account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Jon" {...field} />
                                            </FormControl>
                                            <FormDescription />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormDescription />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="me@example.com" {...field} />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="**********"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirm_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="**********"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating account..." : "Create an account"}
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?
                            <Link to="/login" className="underline">
                                {" "}
                                Sign in{" "}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
