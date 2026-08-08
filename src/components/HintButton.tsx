import { Button } from "@/components/ui/button"

interface HintButtonProps {
  onReveal: () => void
  disabled: boolean
}

export function HintButton({ onReveal, disabled }: HintButtonProps) {
  return (
    <Button variant="secondary" className="w-full" onClick={onReveal} disabled={disabled}>
      Reveal next hint
    </Button>
  )
}
