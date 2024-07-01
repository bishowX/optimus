import { createApp } from "vue"
import { autoAnimatePlugin } from "@formkit/auto-animate/vue"

import App from "@/app.vue"
import { router } from "@/router"

import "./assets/main.css"

const app = createApp(App)

app.use(router)
app.use(autoAnimatePlugin)

app.mount("#app")
