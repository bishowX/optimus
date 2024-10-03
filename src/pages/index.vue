<template>
    <!-- Dashboard Content -->
    <main class="p-6">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <!-- Stat Cards -->
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

        <div class="mt-6 grid gap-6 md:grid-cols-2">
            <!-- Page Views Chart -->
            <Card>
                <CardHeader>
                    <CardTitle>Page Views</CardTitle>
                </CardHeader>
                <CardContent>
                    <AreaChart :data="pageViewsData" index="name" :categories="['total']" />
                </CardContent>
            </Card>

            <!-- Content Distribution Chart -->
            <Card>
                <CardHeader>
                    <CardTitle>Content Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <BarChart
                        :data="contentDistributionData"
                        index="type"
                        :categories="['count']"
                    />
                </CardContent>
            </Card>
        </div>

        <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <!-- Top Performing Content -->
            <Card>
                <CardHeader>
                    <CardTitle>Top Performing Content</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul class="space-y-4">
                        <li
                            v-for="content in topContent"
                            :key="content.id"
                            class="flex items-center"
                        >
                            <div
                                class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted"
                            >
                                <component
                                    :is="content.icon"
                                    class="h-5 w-5 text-muted-foreground"
                                />
                            </div>
                            <div class="ml-4 flex-grow">
                                <p class="text-sm font-medium">{{ content.title }}</p>
                                <p class="text-xs text-muted-foreground">
                                    {{ content.views }} views
                                </p>
                            </div>
                            <Badge>{{ content.type }}</Badge>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <!-- Recent Activity -->
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul class="space-y-4">
                        <li
                            v-for="activity in recentActivity"
                            :key="activity.id"
                            class="flex items-center"
                        >
                            <Avatar>
                                <AvatarImage :src="activity.userAvatar" :alt="activity.userName" />
                                <AvatarFallback>{{ activity.userName.charAt(0) }}</AvatarFallback>
                            </Avatar>
                            <div class="ml-4">
                                <p class="text-sm font-medium">{{ activity.action }}</p>
                                <p class="text-sm text-muted-foreground">
                                    {{ activity.timestamp }}
                                </p>
                            </div>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <!-- Quick Actions -->
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent class="grid gap-4">
                    <RouterLink to="/contents/create">
                        <Button class="w-full">
                            <Icon class="mr-2" icon="lucide:plus" />
                            Create New Content
                        </Button>
                    </RouterLink>
                    <Button variant="outline" class="w-full">
                        <Icon class="mr-2" icon="lucide:pencil" />
                        Customize Homepage
                    </Button>
                </CardContent>
            </Card>
        </div>
    </main>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AreaChart } from "@/components/ui/chart-area"
import { BarChart } from "@/components/ui/chart-bar"
import {
    FileTextIcon,
    UsersIcon,
    EyeIcon,
    MessageSquareIcon,
    PlusIcon,
    PencilIcon,
    VideoIcon,
    FileIcon,
} from "lucide-vue-next"
import { RouterLink } from "vue-router"
import { Icon } from "@iconify/vue"

const stats = [
    { label: "Total Views", value: "5,231", icon: EyeIcon, description: "+20% from last month" },
    { label: "New Users", value: "120", icon: UsersIcon, description: "+5% from last week" },
    {
        label: "Total Contents",
        value: "1,024",
        icon: FileTextIcon,
        description: "32 published this week",
    },
    {
        label: "Comments",
        value: "3,100",
        icon: MessageSquareIcon,
        description: "210 new since yesterday",
    },
]

const recentActivity = [
    {
        id: 1,
        userName: "John Doe",
        userAvatar: "/placeholder.svg?height=40&width=40",
        action: "Published a new post",
        timestamp: "2 minutes ago",
    },
    {
        id: 2,
        userName: "Jane Smith",
        userAvatar: "/placeholder.svg?height=40&width=40",
        action: 'Commented on "Top 10 CMS Tips"',
        timestamp: "1 hour ago",
    },
    {
        id: 3,
        userName: "Bob Johnson",
        userAvatar: "/placeholder.svg?height=40&width=40",
        action: "Updated their profile",
        timestamp: "3 hours ago",
    },
]

const topContent = [
    { id: 1, title: "10 SEO Tips for 2024", views: 1500, type: "Article", icon: FileTextIcon },
    { id: 2, title: "Introduction to Vue 3", views: 1200, type: "Video", icon: VideoIcon },
    {
        id: 3,
        title: "Best Practices for Content Management",
        views: 980,
        type: "Guide",
        icon: FileIcon,
    },
    {
        id: 4,
        title: "How to Optimize Your Website Speed",
        views: 850,
        type: "Article",
        icon: FileTextIcon,
    },
]

// Page Views Chart Data
const pageViewsData = [
    {
        name: "Jan",
        total: Math.floor(Math.random() * 2000) + 500,
    },
    {
        name: "Feb",
        total: Math.floor(Math.random() * 2000) + 500,
    },
    {
        name: "Mar",
        total: Math.floor(Math.random() * 2000) + 500,
    },
    {
        name: "Apr",
        total: Math.floor(Math.random() * 2000) + 500,
    },
    {
        name: "May",
        total: Math.floor(Math.random() * 2000) + 500,
    },
    {
        name: "Jun",
        total: Math.floor(Math.random() * 2000) + 500,
    },
    {
        name: "Jul",
        total: Math.floor(Math.random() * 2000) + 500,
    },
]

// Content Distribution Data
const contentDistributionData = [
    { type: "Analysis", count: 40 },
    { type: "Situation Report", count: 25 },
    { type: "Event", count: 15 },
    { type: "Cyber Risk Outlook", count: 10 },
    { type: "Data Visualization", count: 10 },
]
</script>
