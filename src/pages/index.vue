<template>
    <div class="flex w-full items-center justify-between border-b px-4 py-4">
        <h1 class="text-2xl">Dashboard</h1>
    </div>

    <div class="flex flex-col gap-6 p-4">
        <!-- Overview Cards -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card v-for="stat in stats" :key="stat.label">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">{{ stat.label }}</CardTitle>
                    <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">{{ stat.value }}</div>
                    <p class="text-xs text-muted-foreground">{{ stat.description }}</p>
                </CardContent>
            </Card>
        </div>

        <!-- Charts -->
        <div class="grid gap-6 md:grid-cols-2">
            <!-- Page Views Chart -->
            <Card>
                <CardHeader>
                    <CardTitle>Page Views Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <AreaChart
                        :data="pageViewsData"
                        index="date"
                        :categories="['views', 'slug']"
                        :colors="['orange', 'teal']"
                        :y-formatter="(value) => `${value.toLocaleString()}`"
                    />
                </CardContent>
            </Card>

            <!-- Content Distribution Chart -->
            <Card>
                <CardHeader>
                    <CardTitle>Content Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <BarChart
                        :data="contentDistributionData"
                        index="type"
                        :categories="['count']"
                        :colors="['cyan']"
                    />
                </CardContent>
            </Card>
        </div>

        <!-- Data Visualization Projects -->
        <Card>
            <CardHeader>
                <CardTitle>Recent Data Visualization Projects</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card v-for="project in dataVisualizationProjects" :key="project.id">
                        <CardHeader>
                            <CardTitle class="text-lg">{{ project.title }}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p class="text-sm text-muted-foreground">{{ project.description }}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" class="w-full">View Project</Button>
                        </CardFooter>
                    </Card>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { AreaChart } from "@/components/ui/chart-area"
import { BarChart } from "@/components/ui/chart-bar"
import { BarChartIcon, UsersIcon, FileTextIcon, MessageSquareIcon } from "lucide-vue-next"

const stats = [
    {
        label: "Total Analyses",
        value: "1,234",
        icon: BarChartIcon,
        description: "+20.1% from last month",
    },
    { label: "Active Users", value: "573", icon: UsersIcon, description: "+12% from last week" },
    {
        label: "Situation Reports",
        value: "89",
        icon: FileTextIcon,
        description: "12 published this week",
    },
    {
        label: "Event Discussions",
        value: "2,456",
        icon: MessageSquareIcon,
        description: "158 new since yesterday",
    },
]

const pageViewsData = [
    { date: "2023-01-01", views: 2500, slug: "/home" },
    { date: "2023-02-01", views: 3000, slug: "/analysis" },
    { date: "2023-03-01", views: 3200, slug: "/reports" },
    { date: "2023-04-01", views: 3800, slug: "/events" },
    { date: "2023-05-01", views: 4000, slug: "/risks" },
    { date: "2023-06-01", views: 4200, slug: "/visualizations" },
    { date: "2023-07-01", views: 4500, slug: "/home" },
]

const contentDistributionData = [
    { type: "Analysis", count: 40 },
    { type: "Situation Report", count: 25 },
    { type: "Event", count: 15 },
    { type: "Cyber Risk Outlook", count: 10 },
    { type: "Data Visualization", count: 10 },
]

const dataVisualizationProjects = [
    {
        id: 1,
        title: "Global Threat Map",
        description: "Interactive visualization of cyber threats worldwide",
    },
    {
        id: 2,
        title: "Attack Vector Analysis",
        description: "Breakdown of common attack vectors and their prevalence",
    },
    {
        id: 3,
        title: "Security Posture Heatmap",
        description: "Organizational security strength across different domains",
    },
]
</script>
