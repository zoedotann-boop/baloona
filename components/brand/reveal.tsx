"use client"

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode
  /** Element to render as (e.g. "li", "section"). Defaults to a div. */
  as?: ElementType
  /** Stagger offset in ms, applied as transition-delay (for rows of cards). */
  delay?: number
  /** Reveal only once (default). If false, re-hides when scrolled out of view. */
  once?: boolean
}

/**
 * Scroll-reveal wrapper: gentle fade-in + slide-up when the element enters the
 * viewport, via IntersectionObserver. The visual is a CSS `.reveal` utility
 * (see app/globals.css) toggled through `data-visible`, so prefers-reduced-motion
 * and the no-JS fallback are handled purely in CSS. Only vertical translate is
 * used, so it is RTL-safe.
 */
function Reveal({
  children,
  as,
  delay = 0,
  once = true,
  className,
  style,
  ...rest
}: RevealProps) {
  const Tag = as ?? "div"
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reduced-motion is handled entirely in CSS: the `.reveal` utility is forced
    // visible under `prefers-reduced-motion`, so the observer can run as usual.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <Tag
      ref={ref}
      data-visible={visible ? "true" : "false"}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
      className={cn("reveal", className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export { Reveal }
