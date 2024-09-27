import axios from "axios"
import Cookies from "universal-cookie"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use(
    (config) => {
        const cookies = new Cookies(null, { path: "/" })
        const accessToken = cookies.get("access_token")

        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
        return config
    },
    (err) => Promise.reject(err),
)
