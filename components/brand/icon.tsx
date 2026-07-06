import {
  ArrowLeft,
  ArrowUp,
  Building2,
  Cake,
  Camera,
  Check,
  Clock,
  Coffee,
  CupSoda,
  Gamepad2,
  Gift,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Star,
  Utensils,
  type LucideProps,
} from "lucide-react"

// Lucide dropped brand marks, so the socials are small inline SVGs that accept
// the same className/size props as the Lucide icons.
function svgProps({ className, size = 24 }: LucideProps) {
  return {
    className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }
}

const Instagram = (p: LucideProps) => (
  <svg {...svgProps(p)}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" />
  </svg>
)

const Facebook = (p: LucideProps) => (
  <svg {...svgProps(p)}>
    <path d="M14 22v-9h3l.5-4H14V6.5c0-1.2.3-2 2-2h2V1.2C17.6 1.1 16.4 1 15 1c-3 0-5 1.8-5 5v3H7v4h3v9h4z" />
  </svg>
)

const TikTok = (p: LucideProps) => (
  <svg {...svgProps(p)}>
    <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" />
    <path d="M14 4c0 2.5 2 4.5 4.5 4.5" />
  </svg>
)

// Maps the mock-data icon keys to icons so content stays string-based.
const ICONS = {
  building: Building2,
  utensils: Utensils,
  cake: Cake,
  shield: Shield,
  coffee: Coffee,
  gift: Gift,
  star: Star,
  clock: Clock,
  gamepad: Gamepad2,
  cup: CupSoda,
  whatsapp: MessageCircle,
  phone: Phone,
  mail: Mail,
  pin: MapPin,
  check: Check,
  camera: Camera,
  "arrow-left": ArrowLeft,
  "arrow-up": ArrowUp,
  instagram: Instagram,
  facebook: Facebook,
  tiktok: TikTok,
} as const

export type IconName = keyof typeof ICONS

function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = ICONS[name]
  return <Cmp {...props} />
}

export { Icon }
