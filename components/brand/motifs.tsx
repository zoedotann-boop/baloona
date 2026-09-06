import { cn } from "@/lib/utils"

type MotifProps = React.SVGProps<SVGSVGElement>

function svgProps({ className, ...props }: MotifProps) {
  return {
    "aria-hidden": true as const,
    focusable: false as const,
    className: cn("pointer-events-none", className),
    ...props,
  }
}

function Cloud({ fill = "#ffffff", ...props }: MotifProps & { fill?: string }) {
  return (
    <svg viewBox="0 0 200 96" {...svgProps(props)}>
      <path
        d="M44 92c-20 0-34-13-34-30 0-15 11-26 26-27 3-19 19-31 39-31 17 0 31 10 37 25 4-2 9-3 14-3 16 0 28 11 29 26 14 2 25 12 25 26 0 12-10 21-24 21H44Z"
        fill={fill}
      />
    </svg>
  )
}

function Heart({
  fill = "var(--brand-rose)",
  ...props
}: MotifProps & { fill?: string }) {
  return (
    <svg viewBox="0 0 32 30" {...svgProps(props)}>
      <path
        d="M16 28C4 20 2 12 2 8 2 3 6 1 10 1c3 0 5 2 6 4 1-2 3-4 6-4 4 0 8 2 8 7 0 4-2 12-14 20Z"
        fill={fill}
      />
    </svg>
  )
}

function Flamingo(props: MotifProps) {
  return (
    <svg viewBox="0 0 120 210" {...svgProps(props)}>
      <path
        d="M52 130l-3 66M49 196l-9 8M49 196l9 8"
        fill="none"
        stroke="#f0a94e"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M66 130l10 34-6 12"
        fill="none"
        stroke="#f0a94e"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse cx="56" cy="120" rx="32" ry="22" fill="#ffffff" />
      <path d="M34 112c16-8 36-6 46 4-8 12-32 16-46 4Z" fill="#bcdff0" />
      <path
        d="M64 108C50 84 46 50 62 34c14-14 30-6 24 8"
        fill="none"
        stroke="#ffffff"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <circle cx="82" cy="30" r="8" fill="#ffffff" />
      <path d="M88 30l16 4-14 10Z" fill="#f0a94e" />
      <path d="M96 40l8-1-6 6Z" fill="var(--brand-ink)" />
      <circle cx="83" cy="28" r="1.6" fill="var(--brand-ink)" />
    </svg>
  )
}

function Hills({
  back = "var(--scene-hill-back)",
  front = "var(--scene-hill-front)",
  ...props
}: MotifProps & { back?: string; front?: string }) {
  return (
    <svg viewBox="0 0 400 120" preserveAspectRatio="none" {...svgProps(props)}>
      <path d="M0 60c70-34 150-34 210 4s130 34 190 6v50H0Z" fill={back} />
      <path d="M0 92c90-30 150 12 250-8s130-6 150 2v34H0Z" fill={front} />
    </svg>
  )
}

function PartyBalloon({
  color = "var(--brand-rose)",
  ...props
}: MotifProps & { color?: string }) {
  return (
    <svg viewBox="0 0 60 122" {...svgProps(props)}>
      <g className="animate-baloona-float">
        <ellipse cx="30" cy="34" rx="24" ry="30" fill={color} />
        <path d="M30 63l6 10H24z" fill={color} />
        <path
          d="M30 73c9 12-9 20 0 46"
          fill="none"
          stroke="var(--brand-ink)"
          strokeWidth="1.4"
        />
        <ellipse cx="21" cy="24" rx="6" ry="10" fill="#ffffff" opacity="0.4" />
      </g>
    </svg>
  )
}

function Sun(props: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" {...svgProps(props)}>
      <g fill="var(--brand-yellow)">
        {Array.from({ length: 12 }, (_, i) => (
          <path
            key={i}
            d="M50 4l5 16h-10z"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="26" fill="var(--brand-yellow)" />
      <circle cx="42" cy="47" r="2.4" fill="var(--brand-ink)" />
      <circle cx="58" cy="47" r="2.4" fill="var(--brand-ink)" />
      <circle cx="38" cy="56" r="4" fill="#f4a0b8" opacity="0.6" />
      <circle cx="62" cy="56" r="4" fill="#f4a0b8" opacity="0.6" />
      <path
        d="M43 56c3 4 11 4 14 0"
        fill="none"
        stroke="var(--brand-ink)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function TownSilhouette({
  fill = "var(--scene-town)",
  ...props
}: MotifProps & { fill?: string }) {
  return (
    <svg viewBox="0 0 400 120" preserveAspectRatio="none" {...svgProps(props)}>
      <path
        d="M0 120V72h22l18-22 18 22h20V54l26-22 26 22v14h20l16-20 16 20h22V60l24-20 24 20v16h20l18-24 18 24h34v40z"
        fill={fill}
      />
    </svg>
  )
}

export { Cloud, Flamingo, Heart, Hills, PartyBalloon, Sun, TownSilhouette }
