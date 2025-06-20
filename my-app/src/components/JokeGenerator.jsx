import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { Clipboard, Copy, Moon, Sun } from "lucide-react"

const categories = ["Any", "Programming", "Misc", "Pun", "Spooky", "Christmas"]

function JokeGenerator() {
  const [joke, setJoke] = useState({ text: "", id: null })
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState("Any")
  const [copied, setCopied] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      )
    }
    return false
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.theme = "dark"
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.theme = "light"
    }
  }, [isDarkMode])

  const fetchJoke = useCallback(async () => {
    setLoading(true)
    setCopied(false)
    try {
      const response = await fetch(
        `https://v2.jokeapi.dev/joke/${category}?safe-mode`
      )
      const data = await response.json()
      if (data.error) {
        setJoke({ text: "Oops, something went wrong with the joke API." })
      } else if (data.type === "single") {
        setJoke({ text: data.joke, id: data.id })
      } else {
        setJoke({
          text: `${data.setup}\n\n${data.delivery}`,
          id: data.id,
        })
      }
    } catch (error) {
      console.error("Error fetching joke:", error)
      setJoke({ text: "Couldn't fetch a joke. Please try again!" })
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchJoke()
  }, [fetchJoke])

  const handleCopy = () => {
    if (joke.text) {
      navigator.clipboard.writeText(joke.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center justify-center min-h-svh p-4 sm:p-8 md:p-12 bg-gradient-to-br from-background to-secondary/30 transition-colors duration-300">
        <div className="absolute top-4 right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={toggleDarkMode} variant="ghost" size="icon">
                {isDarkMode ? (
                  <Sun className="size-5" />
                ) : (
                  <Moon className="size-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            </TooltipContent>
          </Tooltip>
        </div>

        <Card className="max-w-md w-full p-4 sm:p-8 rounded-2xl shadow-xl border animate-in fade-in zoom-in-95 duration-500">
          <CardHeader className="pb-2">
            <h1 className="text-2xl font-bold text-primary text-center">
              Random Joke Generator
            </h1>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            {/* Category Select Dropdown */}
            <div className="flex justify-center mb-6">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-48">
                  {category}
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Joke Display Area */}
            <div className="min-h-[150px] flex items-center justify-center mb-4 p-4 sm:p-6 bg-secondary/50 rounded-md transition-all duration-300 ease-in-out">
              {loading ? (
                <div className="w-full">
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-6 w-2/3 mx-auto" />
                </div>
              ) : (
                <p className="text-lg whitespace-pre-line text-secondary-foreground text-center">
                  {joke.text}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-0">
            <div className="flex justify-end w-full mb-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleCopy} variant="ghost" size="sm" className="gap-2">
                    {copied ? (
                      <>
                        <Clipboard className="size-4" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" /> Copy
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Copy joke to clipboard
                </TooltipContent>
              </Tooltip>
            </div>
            <Button onClick={fetchJoke} disabled={loading} className="w-full">
              {loading ? "Loading..." : "Get Another Joke"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  )
}

export default JokeGenerator 