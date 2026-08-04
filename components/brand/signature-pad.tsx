"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface SignaturePadProps {
  /**
   * Receives the signature as a PNG data URL after each stroke, or `null` when
   * the pad is empty. The image itself is what gets stored with the lead, so
   * the pad hands back the picture rather than just "signed / not signed".
   */
  onChange?: (dataUrl: string | null) => void
  /** Hint shown behind an empty pad. */
  hint?: string
  clearLabel?: string
  className?: string
}

/**
 * Dependency-free digital signature pad. Draws on a `<canvas>` via pointer
 * events (mouse + touch) and offers a clear button. Sized for its container;
 * redraws crisply on high-DPR screens.
 */
function SignaturePad({
  onChange,
  hint,
  clearLabel = "ניקוי",
  className,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [hasInk, setHasInk] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const ratio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio
    ctx.scale(ratio, ratio)
    ctx.lineWidth = 2.5
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#4a2740"
  }, [])

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handleDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    drawing.current = true
    const { x, y } = point(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    canvasRef.current?.setPointerCapture(e.pointerId)
  }

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    const { x, y } = point(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    if (!hasInk) setHasInk(true)
  }

  const handleUp = () => {
    if (!drawing.current) return
    drawing.current = false
    const canvas = canvasRef.current
    if (canvas && hasInk) onChange?.(canvas.toDataURL("image/png"))
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasInk(false)
    onChange?.(null)
  }

  return (
    <div className={className}>
      <div className="relative">
        <canvas
          ref={canvasRef}
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          onPointerLeave={handleUp}
          className="h-36 w-full touch-none rounded-2xl border border-border bg-white"
        />
        {!hasInk && hint && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[15px] text-muted-foreground">
            {hint}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={clear}
        disabled={!hasInk}
        className={cn(
          "mt-2 text-[14px] font-bold text-brand-plum underline transition",
          !hasInk && "opacity-40"
        )}
      >
        {clearLabel}
      </button>
    </div>
  )
}

export { SignaturePad }
