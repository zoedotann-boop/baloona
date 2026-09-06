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
  as?: ElementType
  delay?: number
  once?: boolean
}

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
