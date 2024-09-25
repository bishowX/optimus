import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/layout/theme-provider"

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
            <TooltipProvider>
                <div>
                    <h1 className="text-4xl text-cyan-700">Hello!!!!</h1>
                    <Button>Click me!</Button>
                </div>
            </TooltipProvider>
        </ThemeProvider>
    )
}

export default App
