import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/overview")({
    component: () => <div>Hello /overview!</div>,
})
