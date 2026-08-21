import { useEffect, useId, useMemo, useRef, useState } from "react"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface GuessInputProps {
  names: string[]
  onGuess: (name: string) => void
  disabled?: boolean
}

const MAX_SUGGESTIONS = 6

export function GuessInput({ names, onGuess, disabled }: GuessInputProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const listboxId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return []
    return names
      .filter((name) => name.toLowerCase().includes(normalizedQuery))
      .slice(0, MAX_SUGGESTIONS)
  }, [names, query])

  const isDropdownOpen = isOpen && suggestions.length > 0

  function submitGuess(name: string) {
    onGuess(name)
    setQuery("")
    setHighlightedIndex(0)
    setIsOpen(false)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (suggestions.length > 0) {
        setIsOpen(true)
        setHighlightedIndex((prev) => (prev + 1) % suggestions.length)
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      if (suggestions.length > 0) {
        setIsOpen(true)
        setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
      }
    } else if (event.key === "Enter" && event.shiftKey) {
      // Let this bubble up so the global "reveal hint" shortcut can handle it.
      return
    } else if (event.key === "Enter") {
      event.preventDefault()
      event.stopPropagation()
      if (suggestions[highlightedIndex]) {
        submitGuess(suggestions[highlightedIndex])
      } else if (query.trim()) {
        submitGuess(query.trim())
      }
    } else if (event.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <SearchIcon className="pointer-events-none absolute left-3 size-4 shrink-0 opacity-50" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isDropdownOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Who's that Pokémon?"
          disabled={disabled}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setHighlightedIndex(0)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onKeyDown={handleKeyDown}
          className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent py-1 pr-3 pl-9 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30"
        />
      </div>
      {isDropdownOpen && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-input bg-popover text-popover-foreground shadow-md"
        >
          {suggestions.map((name, index) => (
            <li key={name} role="option" aria-selected={index === highlightedIndex}>
              <button
                type="button"
                className={cn(
                  "block w-full px-3 py-2 text-left text-sm",
                  index === highlightedIndex ? "bg-muted" : ""
                )}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => submitGuess(name)}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
