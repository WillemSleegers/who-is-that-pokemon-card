import { useEffect, useRef } from "react"
import { ART_BOX } from "@/lib/artCrop"

interface CroppedArtProps {
  src: string
  alt: string
  className?: string
}

// Draws the exact source rectangle onto a canvas via drawImage, rather than
// approximating the crop with CSS object-fit/object-position — the pixels
// that land on screen are exactly the ones requested, no rendering math to
// get subtly wrong.
export function CroppedArt({ src, alt, className }: CroppedArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = ART_BOX.sWidth
      canvas.height = ART_BOX.sHeight
      ctx.drawImage(
        img,
        ART_BOX.sx,
        ART_BOX.sy,
        ART_BOX.sWidth,
        ART_BOX.sHeight,
        0,
        0,
        ART_BOX.sWidth,
        ART_BOX.sHeight,
      )
    }
    img.src = src
  }, [src])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      width={ART_BOX.sWidth}
      height={ART_BOX.sHeight}
      className={`h-auto w-full max-w-full ${className ?? ""}`}
    />
  )
}
