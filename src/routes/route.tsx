import { DefaultLayout } from "@/layouts/default"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
    component: () => (
        <DefaultLayout>
            <Outlet />
        </DefaultLayout>
    ),
})
