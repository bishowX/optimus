import { createRouter, createWebHistory } from "vue-router/auto"
import { routes } from "vue-router/auto-routes"
import { useAuth } from "@/composables/useAuth"
import { setupLayouts } from "virtual:generated-layouts"

const router = createRouter({
    history: createWebHistory(),
    routes: setupLayouts(routes),
})
const { user, fetchUser } = useAuth()

router.beforeEach(async (to, from) => {
    if (!user.value) {
        await fetchUser()
    }

    if (user.value) {
        if (to.path === "/login" || to.path === "/signup") return "/"
    } else {
        if (to.path === "/login" || to.path === "/signup") return
        if (to.path !== "/login") return "/login"
    }
})

export { router }
