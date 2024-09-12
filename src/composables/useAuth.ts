import { computed, ref, watch } from "vue"
import Cookies from "universal-cookie"

import { api } from "@/lib/axios"

export type User = {
    id: string
    first_name: string
    last_name: string
    email: string
    roles: string[]
}

const user = ref<User | null>(null)

export function useAuth() {
    const fetchUser = async () => {
        try {
            const resp = await api.get<User>("/auth/me")
            user.value = resp.data
        } catch {
            user.value = null
            const cookies = new Cookies(null, { path: "/" })
            cookies.remove("access_token")
            cookies.remove("refresh_token")
        }
    }

    const logout = async () => {
        try {
            const cookies = new Cookies(null, { path: "/" })

            await api.post("/auth/logout", null, {
                headers: {
                    "X-Refresh-Token": cookies.get("refresh_token"),
                },
            })
        } finally {
            user.value = null
            const cookies = new Cookies(null, { path: "/" })
            cookies.remove("access_token")
            cookies.remove("refresh_token")
        }
    }

    return {
        user,
        fetchUser,
        logout,
    }
}
