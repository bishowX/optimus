import UserNav from "@/components/layout/user-nav" // Adjust import as necessary
import { ThemeSwitcher } from "@/components/layout/theme-switcher" // Adjust import as necessary
import { Outlet } from "@tanstack/react-router"

export const AuthLayout = () => {
    return (
        <div className="min-h-screen w-full flex flex-col">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <div className="ml-auto flex items-center space-x-4">
                        <ThemeSwitcher />
                        <UserNav />
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    )
}
