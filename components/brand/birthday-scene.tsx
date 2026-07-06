import { cn } from "@/lib/utils"

/** Playful gift-and-balloons illustration for the birthday card. */
function BirthdayScene({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[26px] bg-white/45",
        className
      )}
      aria-hidden="true"
      {...props}
    >
      <svg
        viewBox="0 0 420 280"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
      >
        {/* dotted texture */}
        <defs>
          <pattern
            id="bd-dots"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.5" fill="rgba(25,74,87,0.13)" />
          </pattern>
        </defs>
        <rect width="420" height="280" fill="url(#bd-dots)" />

        {/* balloons */}
        <g className="animate-baloona-float">
          <ellipse cx="120" cy="70" rx="30" ry="36" fill="#ff7d59" />
          <path d="M120 106 l5 9 h-10 z" fill="#ff7d59" />
          <path
            d="M120 115 q10 18 0 40"
            fill="none"
            stroke="#c9889a"
            strokeWidth="1.8"
          />
          <ellipse cx="110" cy="58" rx="6" ry="10" fill="#fff" opacity=".35" />
        </g>
        <g className="animate-baloona-float" style={{ animationDelay: "0.9s" }}>
          <ellipse cx="180" cy="58" rx="26" ry="32" fill="#f6c744" />
          <path d="M180 90 l4 8 h-9 z" fill="#f6c744" />
          <path
            d="M180 98 q9 16 0 36"
            fill="none"
            stroke="#c9a83c"
            strokeWidth="1.8"
          />
          <ellipse cx="172" cy="47" rx="5" ry="9" fill="#fff" opacity=".35" />
        </g>
        <g className="animate-baloona-float" style={{ animationDelay: "1.5s" }}>
          <ellipse cx="238" cy="78" rx="24" ry="30" fill="#f587bc" />
          <path d="M238 108 l4 8 h-9 z" fill="#f587bc" />
          <path
            d="M238 116 q8 14 0 32"
            fill="none"
            stroke="#c76a97"
            strokeWidth="1.8"
          />
          <ellipse cx="230" cy="67" rx="5" ry="8" fill="#fff" opacity=".35" />
        </g>

        {/* gift box */}
        <g transform="translate(150 150)">
          <rect x="0" y="34" width="120" height="80" rx="8" fill="#ffffff" />
          <rect x="0" y="34" width="120" height="24" rx="8" fill="#cddbf8" />
          <rect x="52" y="34" width="16" height="80" fill="#ff7d59" />
          <path
            d="M60 34 C40 34 34 10 52 10 C64 10 60 34 60 34 Z"
            fill="#ff7d59"
          />
          <path
            d="M60 34 C80 34 86 10 68 10 C56 10 60 34 60 34 Z"
            fill="#ff7d59"
          />
        </g>

        {/* confetti */}
        <circle cx="70" cy="150" r="4" fill="#88bedc" />
        <circle cx="330" cy="120" r="4" fill="#f6c744" />
        <circle cx="300" cy="210" r="4" fill="#ff7d59" />
        <circle cx="90" cy="220" r="4" fill="#f587bc" />
        <rect
          x="336"
          y="180"
          width="8"
          height="8"
          rx="2"
          fill="#5e9e54"
          transform="rotate(20 340 184)"
        />
      </svg>
    </div>
  )
}

export { BirthdayScene }
