import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'
  
  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        className="scale-90 sm:scale-110"
      />
      <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
      <span className="hidden sm:inline text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
        {isDark ? 'Modo escuro' : 'Modo claro'}
      </span>
    </div>
  )
}
