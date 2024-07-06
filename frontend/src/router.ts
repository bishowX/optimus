import { createRouter, createWebHistory } from "vue-router/auto"
import { routes } from "vue-router/auto-routes"
// @ts-ignore
import { setupLayouts } from "virtual:generated-layouts"

const router = createRouter({
    history: createWebHistory(),
    routes: setupLayouts(routes)
})

export { router }
