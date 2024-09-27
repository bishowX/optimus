import { useState, useRef, useEffect, type ReactElement } from "react"
import { Link, useRouter } from "@tanstack/react-router"
import { useMediaQuery } from "@uidotdev/usehooks"
import type { ImperativePanelHandle } from "react-resizable-panels"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import SideNav from "@/components/layout/side-nav"
import UserNav from "@/components/layout/user-nav"
import { ThemeSwitcher } from "@/components/layout/theme-switcher"

const defaultLayout = [15, 85]
const navCollapsedSize = 4

const links = [
    {
        title: "Contents",
        icon: "lucide:file-search-2",
        link: "/contents",
    },
    {
        title: "Create Content",
        icon: "lucide:file-plus",
        link: "/contents/create",
    },
]

export function DefaultLayout({ children }: { children: ReactElement }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const navPanelRef = useRef<ImperativePanelHandle>(null)
    const isSmallScreen = useMediaQuery("(max-width: 1199px)")
    const router = useRouter()

    const onCollapse = () => setIsCollapsed(true)
    const onExpand = () => setIsCollapsed(false)

    useEffect(() => {
        if (isSmallScreen) navPanelRef.current?.collapse()
        else navPanelRef.current?.expand()
    }, [isSmallScreen])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "[") navPanelRef.current?.collapse()
            if (e.key === "]") navPanelRef.current?.expand()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <div className="flex flex-col">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <nav className="flex items-center space-x-4 lg:space-x-6">
                        <h1 className="text-4xl">
                            <Link to="/">Optimus</Link>
                        </h1>
                        <Separator decorative orientation="vertical" className="h-10" />
                        <Link
                            to="/overview"
                            className={cn(
                                "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                                router.state.location.pathname === "/overview" && "text-primary",
                            )}
                        >
                            Overview
                        </Link>
                        <Link
                            to="/about"
                            className={cn(
                                "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                                router.state.location.pathname === "/about" && "text-primary",
                            )}
                        >
                            About
                        </Link>
                    </nav>
                    <div className="ml-auto flex items-center space-x-4">
                        <ThemeSwitcher />
                        <UserNav />
                    </div>
                </div>
            </div>

            <div className="flex">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="h-full min-h-[calc(100vh-4.0625rem)] items-stretch"
                >
                    <ResizablePanel
                        ref={navPanelRef}
                        defaultSize={defaultLayout[0]}
                        collapsedSize={navCollapsedSize}
                        collapsible
                        minSize={13}
                        maxSize={20}
                        onCollapse={onCollapse}
                        onExpand={onExpand}
                        className={cn(
                            "transition-all duration-300 ease-in-out",
                            isCollapsed && "min-w-[50px]",
                        )}
                    >
                        <SideNav isCollapsed={isCollapsed} links={links} />
                    </ResizablePanel>
                    <ResizableHandle
                        withHandle
                        onClick={() =>
                            navPanelRef.current?.isCollapsed
                                ? navPanelRef.current?.expand()
                                : navPanelRef.current?.collapse()
                        }
                    />
                    <ResizablePanel defaultSize={defaultLayout[1]}>
                        <div className="custom-scrollbar p-4 h-full overflow-y-auto max-h-[calc(100vh-65px)]">
                            {children}
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    )
}
