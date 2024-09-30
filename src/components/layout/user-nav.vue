<script setup lang="ts">
import { watch } from "vue"
import { RouterLink } from "vue-router"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/composables/useAuth"

const { user } = useAuth()
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger v-if="user" as-child>
            <Button variant="ghost" size="icon">
                <Avatar class="h-8 w-8">
                    <AvatarFallback class="uppercase">
                        {{ user.first_name[0] }}{{ user.last_name[0] }}
                    </AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent v-if="user" class="w-56" align="end">
            <DropdownMenuLabel class="flex font-normal">
                <div class="flex flex-col space-y-1">
                    <p class="text-sm font-medium leading-none">{{ user.first_name }}</p>
                    <p class="text-xs leading-none text-muted-foreground">{{ user.email }}</p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Billing
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Settings
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>New Team</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem :as="RouterLink" to="/logout">
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
