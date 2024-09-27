import { ThemeProvider } from "@/components/layout/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { createRootRoute, Outlet, createRoute } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"

import { Toaster } from "@/components/ui/sonner"
import { AuthLayout } from "@/layouts/auth"
import { SignupForm } from "./signup.lazy"

export const Route = createRootRoute({
    component: () => (
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
            <TooltipProvider>
                <Outlet />
                <TanStackRouterDevtools />
                <Toaster />
            </TooltipProvider>
        </ThemeProvider>
    ),
})

const authLayout = createRoute({
    id: "_auth",
    component: AuthLayout,
    getParentRoute: () => Route,
})

const signupPage = createRoute({
    component: SignupForm,
    getParentRoute: () => authLayout,
    path: "/signup",
})

authLayout.addChildren([signupPage])

// authLayout.addChildren([signupPage])
Route.addChildren([signupPage])
