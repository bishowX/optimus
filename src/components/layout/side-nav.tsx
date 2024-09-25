import React from "react"
// import { Icon } from "@iconify/react" // Adjust this based on your Iconify setup
// import { cn } from "@/lib/utils"
// import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export interface LinkProp {
    title: string
    label?: string
    icon: string
    link: string
}

interface NavProps {
    isCollapsed: boolean
    links: LinkProp[]
}

const Navigation: React.FC<NavProps> = ({ isCollapsed, links }) => {
    return (
        <div
            data-collapsed={isCollapsed}
            className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
        >
            <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                {links.map((link, index) => (
                    <React.Fragment key={index}>
                        {isCollapsed ? (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger>
                                    {/* <Link to={link.link}>
                                        <a
                                            className={cn(
                                                "h-9 w-9",
                                                buttonVariants({ variant: "ghost", size: "icon" }),
                                            )}
                                        >
                                            <Icon icon={link.icon} className="size-4" />
                                            <span className="sr-only">{link.title}</span>
                                        </a>
                                    </Link> */}
                                </TooltipTrigger>
                                <TooltipContent side="right" className="flex items-center gap-4">
                                    {link.title}
                                    {link.label && (
                                        <span className="ml-auto text-muted-foreground">
                                            {link.label}
                                        </span>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <h1>Hello</h1>
                            // <Link to={link.link} key={`link-${index}`}>
                            //     <a
                            //         className={cn(
                            //             buttonVariants({ variant: "ghost", size: "sm" }),
                            //             "justify-start",
                            //         )}
                            //     >
                            //         <Icon icon={link.icon} className="mr-2 size-4" />
                            //         {link.title}
                            //         {link.label && (
                            //             <span className={cn("ml-auto", "text-background")}>
                            //                 {link.label}
                            //             </span>
                            //         )}
                            //     </a>
                            // </Link>
                        )}
                    </React.Fragment>
                ))}
            </nav>
        </div>
    )
}

export default Navigation
