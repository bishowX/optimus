import React from "react"
import { cn } from "@/lib/utils"

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
    className?: string
}

const Kbd: React.FC<KbdProps> = ({ className, children, ...props }) => {
    return (
        <kbd
            className={cn(
                "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground",
                className,
            )}
            {...props}
        >
            {children}
        </kbd>
    )
}

export default Kbd
