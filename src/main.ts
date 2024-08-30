import { createApp, h } from "vue"
import { autoAnimatePlugin } from "@formkit/auto-animate/vue"

import App from "@/app.vue"
import { router } from "@/router"

import "./assets/main.css"
import { LineChart } from "@/components/ui/chart-line"

const app = createApp(App)

app.use(router)
app.use(autoAnimatePlugin)

app.directive("parse-line-chart", {
    mounted(el) {
        const replaceLineCharts = () => {
            const lineCharts = el.querySelectorAll("line-chart")
            lineCharts.forEach((chart: HTMLElement) => {
                const data = chart.getAttribute("data")
                let parsedData
                try {
                    parsedData = JSON.parse(data?.replace(/&quot;/g, '"') || "")
                } catch (error) {
                    return
                }

                const vnode = h(LineChart, {
                    data: parsedData,
                    index: "year",
                    showTooltip: true,
                    categories: ["Export Growth Rate", "Import Growth Rate"],
                    yFormatter: (tick) => {
                        return typeof tick === "number"
                            ? `$ ${new Intl.NumberFormat("us").format(tick).toString()}`
                            : ""
                    },
                })
                const container = document.createElement("div")
                chart.parentNode?.replaceChild(container, chart)
                createApp(vnode).mount(container)
            })
        }

        // Initial replacement
        replaceLineCharts()

        // Set up a MutationObserver to watch for changes in the v-html content
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    replaceLineCharts()
                    break // Only need to do this once per mutation batch
                }
            }
        })

        observer.observe(el, { childList: true })

        // Clean up the observer when the element is unmounted
        el._lineChartObserver = observer
    },
    unmounted(el) {
        if (el._lineChartObserver) {
            el._lineChartObserver.disconnect()
        }
    },
})

app.mount("#app")
