import { cn } from "@/lib/utils"

/**
 * The Baloona illustration cast, rebuilt as inline SVG so the brand art woven
 * across the site scales crisply, themes off the design tokens, and ships with
 * no image payload. Every motif is decorative — it renders `aria-hidden` with
 * `pointer-events-none` and takes its size from the wrapping element (`h-*` /
 * `w-*`), matching {@link BirthdayScene} and {@link Confetti}.
 *
 * Colours come from the printed signage (café banner, wall mural, punch cards):
 * white fluffy clouds, pastel hot-air balloons, a flamingo on mint hills.
 */

type MotifProps = React.SVGProps<SVGSVGElement>

function svgProps({ className, ...props }: MotifProps) {
  return {
    "aria-hidden": true as const,
    focusable: false as const,
    className: cn("pointer-events-none", className),
    ...props,
  }
}

/** Fluffy flat-bottomed cloud — the sky filler across every Baloona scene. */
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

type BalloonPattern = "none" | "dots" | "scallop"

/**
 * Hot-air balloon — the recurring sky motif. `color` tints the envelope;
 * `pattern` adds the polka-dot or scalloped detailing seen on the mural.
 */
function HotAirBalloon({
  color = "var(--brand-lavender)",
  pattern = "none",
  ...props
}: MotifProps & {
  color?: string
  pattern?: BalloonPattern
}) {
  return (
    <svg viewBox="0 0 100 140" {...svgProps(props)}>
      <g className="animate-baloona-float">
        {/* envelope */}
        <path
          d="M50 6C26 6 12 26 12 50c0 20 14 36 26 46h24c12-10 26-26 26-46C88 26 74 6 50 6Z"
          fill={color}
        />
        {pattern === "dots" && (
          <g fill="#ffffff" opacity="0.7">
            {[
              [34, 34],
              [50, 28],
              [66, 34],
              [30, 52],
              [50, 48],
              [70, 52],
              [42, 66],
              [58, 66],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" />
            ))}
          </g>
        )}
        {pattern === "scallop" && (
          <path
            d="M14 74c8 8 16 8 24 0 8 8 16 8 24 0 8 8 16 8 24 0v6c-8 8-16 8-24 0-8 8-16 8-24 0-8 8-16 8-24 0Z"
            fill="#ffffff"
            opacity="0.55"
          />
        )}
        {/* highlight */}
        <ellipse cx="36" cy="30" rx="7" ry="12" fill="#ffffff" opacity="0.35" />
        {/* ropes + basket */}
        <path
          d="M40 96l6 18M60 96l-6 18"
          stroke="var(--brand-ink)"
          strokeWidth="1.4"
          fill="none"
        />
        <path
          d="M45 114h10l-1.5 14h-7L45 114Z"
          fill="#d9a06a"
          stroke="var(--brand-ink)"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  )
}

/** A single love-heart — scattered in the mural sky. */
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

/**
 * The Baloona flamingo — the mascot on the pink punch card, standing on one leg
 * with an S-curved neck, coral legs and a soft-blue wing. Faithful but flat.
 */
function Flamingo(props: MotifProps) {
  return (
    <svg viewBox="0 0 120 210" {...svgProps(props)}>
      {/* legs — one standing, one tucked up */}
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
      {/* body */}
      <ellipse cx="56" cy="120" rx="32" ry="22" fill="#ffffff" />
      {/* wing */}
      <path d="M34 112c16-8 36-6 46 4-8 12-32 16-46 4Z" fill="#bcdff0" />
      {/* long S-curved neck */}
      <path
        d="M64 108C50 84 46 50 62 34c14-14 30-6 24 8"
        fill="none"
        stroke="#ffffff"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* head */}
      <circle cx="82" cy="30" r="8" fill="#ffffff" />
      {/* down-curved beak, dark tip */}
      <path d="M88 30l16 4-14 10Z" fill="#f0a94e" />
      <path d="M96 40l8-1-6 6Z" fill="var(--brand-ink)" />
      {/* eye */}
      <circle cx="83" cy="28" r="1.6" fill="var(--brand-ink)" />
    </svg>
  )
}

/**
 * A band of overlapping rolling hills — the ground line under every scene.
 * Sized by the wrapper; sits flush to the bottom edge.
 */
function Hills({
  back = "var(--brand-mint)",
  front = "#7fd6b0",
  ...props
}: MotifProps & { back?: string; front?: string }) {
  return (
    <svg viewBox="0 0 400 120" preserveAspectRatio="none" {...svgProps(props)}>
      <path d="M0 60c70-34 150-34 210 4s130 34 190 6v50H0Z" fill={back} />
      <path d="M0 92c90-30 150 12 250-8s130-6 150 2v34H0Z" fill={front} />
    </svg>
  )
}

/** A single round party balloon on a string — the birthday sky accent. */
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

/** Purple butterfly — the café-banner and wall-mural flutter. */
function Butterfly({
  fill = "var(--brand-lavender)",
  ...props
}: MotifProps & { fill?: string }) {
  return (
    <svg viewBox="0 0 80 72" {...svgProps(props)}>
      <g className="animate-baloona-float">
        <ellipse cx="26" cy="27" rx="18" ry="15" fill={fill} />
        <ellipse cx="54" cy="27" rx="18" ry="15" fill={fill} />
        <ellipse cx="29" cy="50" rx="13" ry="12" fill={fill} opacity="0.82" />
        <ellipse cx="51" cy="50" rx="13" ry="12" fill={fill} opacity="0.82" />
        <ellipse cx="40" cy="40" rx="3" ry="17" fill="var(--brand-plum)" />
        <path
          d="M40 25c-2-8-8-12-13-13M40 25c2-8 8-12 13-13"
          fill="none"
          stroke="var(--brand-plum)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

/** Little grey-and-white penguin with a mint heart — the café-banner passenger. */
function Penguin(props: MotifProps) {
  return (
    <svg viewBox="0 0 100 124" {...svgProps(props)}>
      {/* feet */}
      <path d="M36 108h16l-4 9H40z" fill="#f0a94e" />
      <path d="M52 108h16l-4 9H56z" fill="#f0a94e" />
      {/* body */}
      <ellipse cx="50" cy="62" rx="36" ry="46" fill="#8b96a3" />
      {/* side flippers */}
      <path d="M16 58c-6 10-4 26 4 34 4-2 4-4 4-8Z" fill="#7a8592" />
      <path d="M84 58c6 10 4 26-4 34-4-2-4-4-4-8Z" fill="#7a8592" />
      {/* white belly + face */}
      <ellipse cx="50" cy="68" rx="25" ry="36" fill="#ffffff" />
      <ellipse cx="50" cy="40" rx="24" ry="21" fill="#ffffff" />
      {/* eyes (happy), cheeks, beak */}
      <path
        d="M40 38c2 3 6 3 8 0M52 38c2 3 6 3 8 0"
        fill="none"
        stroke="var(--brand-ink)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="38"
        cy="46"
        r="3.5"
        fill="var(--brand-flower-pink)"
        opacity="0.6"
      />
      <circle
        cx="62"
        cy="46"
        r="3.5"
        fill="var(--brand-flower-pink)"
        opacity="0.6"
      />
      <path d="M46 44h8l-4 6z" fill="#f0a94e" />
      {/* mint heart on belly */}
      <path
        d="M50 84c-7-5-11-9-11-13 0-3 2-5 5-5 2 0 4 1 6 4 2-3 4-4 6-4 3 0 5 2 5 5 0 4-4 8-11 13Z"
        fill="var(--brand-mint)"
      />
    </svg>
  )
}

/**
 * The café-banner giraffe — a pink character with round-tipped ossicones, a
 * mint-striped chest and a raised ice-cream cone. Simplified, front-facing.
 */
function Giraffe(props: MotifProps) {
  return (
    <svg viewBox="0 0 150 210" {...svgProps(props)}>
      {/* legs + hooves */}
      <rect x="52" y="150" width="17" height="48" rx="8" fill="#e88f9a" />
      <rect x="83" y="150" width="17" height="48" rx="8" fill="#e88f9a" />
      <path d="M50 188h21v6a5 5 0 0 1-5 5H55a5 5 0 0 1-5-5z" fill="#3a2b34" />
      <path d="M81 188h21v6a5 5 0 0 1-5 5H86a5 5 0 0 1-5-5z" fill="#3a2b34" />
      {/* tail */}
      <path
        d="M106 148c13 4 15 16 13 30"
        fill="none"
        stroke="#e88f9a"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="119" cy="180" r="5" fill="#3a2b34" />
      {/* body */}
      <ellipse cx="75" cy="146" rx="36" ry="32" fill="#e88f9a" />
      <circle cx="58" cy="152" r="5" fill="#cf7784" />
      <circle cx="92" cy="140" r="4" fill="#cf7784" />
      {/* neck */}
      <path
        d="M64 122V58"
        stroke="#e88f9a"
        strokeWidth="28"
        strokeLinecap="round"
      />
      {/* mint-striped chest bib */}
      <path
        d="M64 74c-15 2-20 38-18 70 1 12 35 12 36 0 2-32-3-68-18-70z"
        fill="#f7efdf"
      />
      <path
        d="M49 104h30M48 120h34M49 136h32M52 150h26"
        fill="none"
        stroke="#8ed6b4"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* head */}
      <ellipse cx="76" cy="50" rx="15" ry="11" fill="#efa6ad" />
      <ellipse cx="58" cy="44" rx="21" ry="18" fill="#e88f9a" />
      <ellipse cx="34" cy="44" rx="7" ry="10" fill="#e88f9a" />
      {/* ossicones */}
      <path
        d="M50 28V16M66 28V16"
        stroke="#e88f9a"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="50" cy="13" r="5" fill="#f0a94e" />
      <circle cx="66" cy="13" r="5" fill="#f0a94e" />
      {/* face */}
      <path
        d="M48 44c2 3 6 3 8 0M62 44c2 3 6 3 8 0"
        fill="none"
        stroke="var(--brand-ink)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="46" cy="52" r="3.5" fill="#f4a0b8" opacity="0.6" />
      <path
        d="M78 50c3 0 4 3 1 4"
        fill="none"
        stroke="var(--brand-ink)"
        strokeWidth="1.6"
      />
      {/* raised arm + ice-cream cone */}
      <path
        d="M96 136c12-4 18-18 18-32"
        fill="none"
        stroke="#e88f9a"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path d="M107 104h14l-6 16z" fill="#e0a56a" />
      <circle cx="114" cy="100" r="9" fill="#f4a0b8" />
    </svg>
  )
}

/**
 * The café-banner wolf on a bicycle carrying a balloon bunch — the site's most
 * detailed motif, kept flat and simplified. Decorative background only.
 */
function WolfOnBike(props: MotifProps) {
  return (
    <svg viewBox="0 0 210 180" {...svgProps(props)}>
      {/* balloon bunch */}
      <g className="animate-baloona-float">
        <path
          d="M150 66c6 20 4 34-8 44M162 60c2 22-6 34-20 42M138 70c8 18 10 32 4 44"
          fill="none"
          stroke="var(--brand-ink)"
          strokeWidth="1.2"
        />
        <ellipse cx="150" cy="52" rx="15" ry="18" fill="var(--brand-mint)" />
        <ellipse cx="166" cy="46" rx="14" ry="17" fill="var(--brand-pink)" />
        <ellipse cx="136" cy="56" rx="13" ry="16" fill="#f6c6a0" />
      </g>
      {/* wheels */}
      <g fill="none" stroke="#3a2b34" strokeWidth="5">
        <circle cx="52" cy="138" r="30" />
        <circle cx="158" cy="138" r="30" />
      </g>
      <g stroke="#c9cfd6" strokeWidth="2">
        <path d="M52 108v60M22 138h60M31 117l42 42M31 159l42-42" />
        <path d="M158 108v60M128 138h60M137 117l42 42M137 159l42-42" />
      </g>
      <circle cx="52" cy="138" r="5" fill="#3a2b34" />
      <circle cx="158" cy="138" r="5" fill="#3a2b34" />
      {/* frame */}
      <path
        d="M52 138l40-30h34l-24 30zM92 108l14 30M126 108l-8-22h14"
        fill="none"
        stroke="#eef0f0"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* pedals */}
      <circle cx="105" cy="138" r="4" fill="#3a2b34" />
      <path
        d="M105 138l10 8"
        stroke="#3a2b34"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* wolf */}
      <path
        d="M96 132c-6-18 2-34 20-34 16 0 22 12 20 26-2 12-10 18-10 18Z"
        fill="#8b96a3"
      />
      <path d="M150 120c14-2 24 6 24 18-6 2-12 0-16-4Z" fill="#6f7b88" />
      {/* head */}
      <path d="M96 96l-8-14 16 4z" fill="#8b96a3" />
      <path d="M118 96l10-14-2 16z" fill="#8b96a3" />
      <path
        d="M92 98c0-14 12-22 24-22s22 10 20 24c-2 12-12 18-22 18s-22-8-22-20z"
        fill="#8b96a3"
      />
      <path
        d="M96 100c4-8 30-8 34 0-2 12-14 16-20 16s-16-6-14-16z"
        fill="#ffffff"
      />
      <path d="M96 108l-10 4 10 4z" fill="#ffffff" />
      <ellipse cx="104" cy="102" rx="2.6" ry="3.4" fill="var(--brand-mint)" />
      <circle cx="90" cy="112" r="2.4" fill="#3a2b34" />
      {/* front leg to handlebar */}
      <path
        d="M120 118c8 2 14 -4 12 -12"
        fill="none"
        stroke="#8b96a3"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Smiling sun with a burst of rays — the mural's happy sky. */
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

/** A round leafy tree with a coral trunk. */
function Tree(props: MotifProps) {
  return (
    <svg viewBox="0 0 110 130" {...svgProps(props)}>
      <rect x="48" y="66" width="14" height="60" rx="6" fill="#e79aa0" />
      <path
        d="M55 92l-15-11M55 84l15-11"
        stroke="#e79aa0"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="55" cy="44" r="30" fill="#b7e6c9" />
      <circle cx="31" cy="60" r="20" fill="#b7e6c9" />
      <circle cx="80" cy="58" r="22" fill="#b7e6c9" />
      <circle cx="55" cy="64" r="20" fill="var(--brand-mint)" />
    </svg>
  )
}

/** A palm tree with a coral trunk and a mint frond fan — the mural's oasis. */
function PalmTree(props: MotifProps) {
  return (
    <svg viewBox="0 0 120 140" {...svgProps(props)}>
      <path d="M54 138c-2-40 0-70 4-96h8c4 26 6 56 4 96z" fill="#e79aa0" />
      <path
        d="M55 46h10M54 62h12M53 80h14M52 98h16"
        stroke="#d67f88"
        strokeWidth="2"
      />
      <g fill="var(--brand-mint)">
        <path d="M60 42C40 22 20 24 8 36c18-2 30 4 40 16z" />
        <path d="M60 42C80 22 100 24 112 36c-18-2-30 4-40 16z" />
        <path d="M60 42C50 16 34 8 20 8c14 8 24 20 28 36z" />
        <path d="M60 42C70 16 86 8 100 8c-14 8-24 20-28 36z" />
        <path d="M60 42C60 18 60 10 60 4c2 12 6 22 6 40z" />
      </g>
    </svg>
  )
}

/** A single tulip on a stem — the mural's meadow flower. */
function Flower({
  color = "var(--brand-flower-pink)",
  ...props
}: MotifProps & { color?: string }) {
  return (
    <svg viewBox="0 0 44 88" {...svgProps(props)}>
      <path
        d="M22 86V40"
        stroke="#7fbf8f"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M22 62c-10-2-16-8-18-16 10 0 16 4 18 12M22 56c8-4 12-10 12-18-8 2-12 8-12 16"
        fill="var(--brand-mint)"
      />
      <path
        d="M22 8c-8 6-12 16-12 24 0 8 5 12 12 12s12-4 12-12c0-8-4-18-12-24z"
        fill={color}
      />
      <path
        d="M14 30c2-8 5-14 8-18M30 30c-2-8-5-14-8-18"
        stroke="#e58aa6"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}

/** A little white bird gliding — the mural's sky dove. */
function Bird({ fill = "#ffffff", ...props }: MotifProps & { fill?: string }) {
  return (
    <svg viewBox="0 0 72 40" {...svgProps(props)}>
      <g className="animate-baloona-float">
        <path
          d="M4 16c16 10 24 10 32 0 8 10 16 10 32 0-6 12-16 16-26 10-2 6-8 6-10 0-10 4-22 2-28-10z"
          fill={fill}
        />
        <path d="M36 16l8-4-6 8z" fill="#f0a94e" />
        <circle cx="33" cy="16" r="1.4" fill="var(--brand-ink)" />
      </g>
    </svg>
  )
}

/** A busy little bee with a dashed flight path. */
function Bee(props: MotifProps) {
  return (
    <svg viewBox="0 0 84 54" {...svgProps(props)}>
      <path
        d="M60 30c16 0 18 12 8 15-8 2-9-8 0-8"
        fill="none"
        stroke="var(--brand-ink)"
        strokeWidth="1.2"
        strokeDasharray="2 3"
      />
      <ellipse cx="30" cy="14" rx="10" ry="7" fill="#cfe8f7" opacity="0.85" />
      <ellipse cx="44" cy="14" rx="10" ry="7" fill="#cfe8f7" opacity="0.85" />
      <ellipse cx="34" cy="31" rx="18" ry="13" fill="var(--brand-yellow)" />
      <path
        d="M30 19l-6 22M40 19l-6 24M48 23l-6 16"
        stroke="var(--brand-ink)"
        strokeWidth="3"
      />
      <path d="M16 31l-8 2 8 2z" fill="var(--brand-ink)" />
      <circle cx="47" cy="28" r="2" fill="var(--brand-ink)" />
    </svg>
  )
}

/** A white bunny — the mural's meadow rabbit. */
function Rabbit(props: MotifProps) {
  return (
    <svg viewBox="0 0 80 104" {...svgProps(props)}>
      <path d="M30 48C26 22 30 8 36 8c5 0 6 16 4 40z" fill="#ffffff" />
      <path d="M46 48C44 24 50 10 55 12c5 2 3 18-6 36z" fill="#ffffff" />
      <path
        d="M33 44c-2-14 0-24 3-26M48 44c0-13 3-21 6-21"
        stroke="#f4c6d2"
        strokeWidth="3"
        fill="none"
        opacity="0.7"
      />
      <ellipse cx="40" cy="60" rx="20" ry="18" fill="#ffffff" />
      <ellipse cx="40" cy="88" rx="24" ry="16" fill="#ffffff" />
      <circle cx="33" cy="58" r="2" fill="var(--brand-ink)" />
      <circle cx="47" cy="58" r="2" fill="var(--brand-ink)" />
      <circle cx="30" cy="64" r="3" fill="#f4a0b8" opacity="0.6" />
      <circle cx="50" cy="64" r="3" fill="#f4a0b8" opacity="0.6" />
      <path
        d="M40 62v3M37 66h6"
        stroke="#e58aa6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** A purple polka-dotted rhino — from the animals strip. */
function Rhino(props: MotifProps) {
  return (
    <svg viewBox="0 0 152 104" {...svgProps(props)}>
      <rect x="36" y="70" width="12" height="28" rx="4" fill="#a98fd0" />
      <rect x="80" y="70" width="12" height="28" rx="4" fill="#a98fd0" />
      <path
        d="M16 56c-6 2-8 10-3 18"
        stroke="var(--brand-lavender)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="60" cy="58" rx="46" ry="28" fill="var(--brand-lavender)" />
      <path
        d="M98 44c16-6 40 0 44 18 3 13-6 24-20 24-16 0-30-8-32-24-1-10 2-16 8-18z"
        fill="var(--brand-lavender)"
      />
      <path d="M104 34c0-8 6-12 11-9-2 4-3 9-4 13z" fill="#c8b6e6" />
      <path d="M132 48l8-22 8 20z" fill="#f3e9c4" />
      <circle cx="122" cy="52" r="2.4" fill="var(--brand-ink)" />
      <circle cx="120" cy="62" r="4.5" fill="#ef8fa0" opacity="0.7" />
      <path
        d="M126 70c6 2 12 0 16-4"
        stroke="var(--brand-ink)"
        strokeWidth="1.4"
        fill="none"
        opacity="0.5"
      />
      <g fill="#f3e9c4">
        <circle cx="50" cy="54" r="2.4" />
        <circle cx="66" cy="48" r="2.4" />
        <circle cx="62" cy="64" r="2.4" />
        <circle cx="80" cy="54" r="2.4" />
        <circle cx="44" cy="64" r="2.4" />
      </g>
    </svg>
  )
}

/** A gentle blue elephant — from the pond wall. */
function Elephant(props: MotifProps) {
  return (
    <svg viewBox="0 0 140 112" {...svgProps(props)}>
      <rect x="42" y="76" width="16" height="30" rx="5" fill="#a9c4d6" />
      <rect x="88" y="76" width="16" height="30" rx="5" fill="#a9c4d6" />
      <path d="M42 103h16M88 103h16" stroke="#ffffff" strokeWidth="3" />
      <ellipse cx="80" cy="60" rx="46" ry="34" fill="#a9c4d6" />
      <circle cx="42" cy="54" r="30" fill="#a9c4d6" />
      <ellipse cx="48" cy="54" rx="18" ry="23" fill="#93b3c8" />
      <path
        d="M22 54c-10 4-14 18-8 34 3 9 11 9 13 0-2-10 0-16 5-20"
        fill="#a9c4d6"
      />
      <circle cx="32" cy="50" r="2.4" fill="var(--brand-ink)" />
      <g fill="#ffffff" opacity="0.6">
        <circle cx="92" cy="52" r="3" />
        <circle cx="106" cy="60" r="3" />
        <circle cx="98" cy="72" r="2.5" />
      </g>
      <path
        d="M126 58c8 2 10 12 6 22"
        stroke="#a9c4d6"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** A striped zebra — the mural's market pony. */
function Zebra(props: MotifProps) {
  return (
    <svg viewBox="0 0 130 122" {...svgProps(props)}>
      <rect x="42" y="84" width="10" height="30" rx="4" fill="#ffffff" />
      <rect x="86" y="84" width="10" height="30" rx="4" fill="#ffffff" />
      <path
        d="M42 110h10M86 110h10"
        stroke="var(--brand-lavender)"
        strokeWidth="3"
      />
      <ellipse cx="72" cy="72" rx="40" ry="26" fill="#ffffff" />
      <path
        d="M42 74C36 48 42 32 54 30"
        stroke="#ffffff"
        strokeWidth="22"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M40 36c-6-8-6-18 0-24 8 6 12 14 12 24z" fill="#ffffff" />
      <path
        d="M46 24c8-6 16-4 20 4"
        stroke="var(--brand-lavender)"
        strokeWidth="6"
        fill="none"
      />
      <g stroke="var(--brand-lavender)" strokeWidth="3" fill="none">
        <path d="M58 50q6 10 4 22M70 48q4 12 2 24M82 50q2 12-2 22M94 56q0 10-4 18" />
        <path d="M44 42l10 4M42 54l11 4M42 66l11 3" />
      </g>
      <circle cx="46" cy="24" r="2" fill="var(--brand-ink)" />
      <path
        d="M40 14l-4-6M50 12l3-6"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** A little windmill — from the countryside wall. */
function Windmill(props: MotifProps) {
  return (
    <svg viewBox="0 0 140 152" {...svgProps(props)}>
      <path d="M52 150l6-90h24l6 90z" fill="#e7e3f2" />
      <path d="M56 60l14-20 14 20z" fill="#9db8e0" />
      <rect x="63" y="86" width="14" height="14" rx="2" fill="#cfe8f7" />
      <path d="M64 150v-22a6 6 0 0 1 12 0v22z" fill="#9db8e0" />
      <g fill="#e7e3f2" stroke="#b7c8e6" strokeWidth="1">
        <path d="M70 40l34-16-4 9-30 11zM70 40l16 34 9-4-11-30zM70 40l-34 16 4-9 30-11zM70 40l-16-34-9 4 11 30z" />
      </g>
      <circle cx="70" cy="40" r="4" fill="#9db8e0" />
    </svg>
  )
}

/** A pink fairytale castle — from the town wall. */
function Castle(props: MotifProps) {
  return (
    <svg viewBox="0 0 120 132" {...svgProps(props)}>
      <g fill="#f4a6c0">
        <rect x="30" y="50" width="60" height="72" />
        <rect x="16" y="64" width="20" height="58" />
        <rect x="84" y="64" width="20" height="58" />
        <path d="M16 64h20v-8h-6v-6h-8v6h-6zM84 64h20v-8h-6v-6h-8v6h-6z" />
        <path d="M30 50h60v-8h-8v-6h-8v6h-8v-6h-8v6h-8v-6h-8v6h-12z" />
      </g>
      <rect x="52" y="26" width="16" height="24" fill="#e58aa6" />
      <path
        d="M60 26V10M60 10h13l-4 5 4 5H60z"
        fill="#ef8fa0"
        stroke="#ef8fa0"
        strokeWidth="1"
      />
      <path d="M50 122V98a10 10 0 0 1 20 0v24z" fill="#d76f97" />
      <g fill="#d76f97">
        <rect x="22" y="80" width="8" height="12" />
        <rect x="90" y="80" width="8" height="12" />
      </g>
    </svg>
  )
}

/** A row of pastel rooftops — a stretchy town skyline for a scene's foot. */
function TownSilhouette({
  fill = "#b3a4d4",
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

/** A striped market stall with a fruit crate — the mural's grocer. */
function MarketStall(props: MotifProps) {
  return (
    <svg viewBox="0 0 140 116" {...svgProps(props)}>
      <rect x="30" y="42" width="6" height="70" fill="#e7e3f2" />
      <rect x="104" y="42" width="6" height="70" fill="#e7e3f2" />
      <rect x="30" y="82" width="80" height="30" fill="#f0ead9" />
      <path d="M24 44h92l-6 20H30z" fill="#cfe0f5" />
      <g fill="#a9c4e6">
        <path d="M42 44l-4 20h8l4-20zM62 44l-2 20h8l2-20zM82 44v20h8l-1-20zM102 44l2 20h8l-2-20z" />
      </g>
      <path
        d="M30 64c6 8 12 8 18 0 6 8 12 8 18 0 6 8 12 8 18 0 6 8 12 8 18 0v4H30z"
        fill="#cfe0f5"
      />
      <rect x="46" y="88" width="26" height="16" fill="#8ea6d6" />
      <circle cx="54" cy="86" r="6" fill="#f4a6c0" />
      <circle cx="64" cy="86" r="6" fill="var(--brand-mint)" />
    </svg>
  )
}

export {
  Bee,
  Bird,
  Butterfly,
  Castle,
  Cloud,
  Elephant,
  Flamingo,
  Flower,
  Giraffe,
  Heart,
  Hills,
  HotAirBalloon,
  MarketStall,
  PalmTree,
  PartyBalloon,
  Penguin,
  Rabbit,
  Rhino,
  Sun,
  Tree,
  TownSilhouette,
  WolfOnBike,
  Windmill,
  Zebra,
}
