import { Button } from "@/components/ui/button"

interface HintButtonProps {
  onReveal: () => void
  disabled: boolean
}

export function HintButton({ onReveal, disabled }: HintButtonProps) {
  return (
    <Button variant="secondary" className="h-10 w-full" onClick={onReveal} disabled={disabled}>
      Reveal next hint <span className="text-muted-foreground">(Shift+Enter)</span>
    </Button>
  )
}
