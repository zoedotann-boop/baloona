import {
  Bee,
  Bird,
  Butterfly,
  Castle,
  Cloud,
  Elephant,
  Flamingo,
  Giraffe,
  Heart,
  Hills,
  HotAirBalloon,
  MarketStall,
  PalmTree,
  PartyBalloon,
  Rabbit,
  Rhino,
  Sun,
  TownSilhouette,
  Tree,
  Windmill,
  WolfOnBike,
  Zebra,
} from "@/components/brand/motifs"
import { cn } from "@/lib/utils"

type WallVariant =
  | "cafe"
  | "meadow"
  | "market"
  | "mountains"
  | "savanna"
  | "town"
  | "windmill"
  | "party"

// Each wall is a soft vertical sky gradient (a real CSS gradient, so it does not
// depend on Tailwind's gradient utility names) matching the painted panels.
const SKY: Record<WallVariant, string> = {
  cafe: "linear-gradient(#d7eefb, #eafaf1)",
  meadow: "linear-gradient(#f7d6e0, #f8e6ec, #edf7e6)",
  market: "linear-gradient(#f6d2e6, #edf7e6)",
  mountains: "linear-gradient(#d6ecfb, #eaf7ee)",
  savanna: "linear-gradient(#dbeffb, #eafaf1)",
  town: "linear-gradient(#d6ecfb, #eef8ee)",
  windmill: "linear-gradient(#d9edfb, #eef8ee)",
  party: "linear-gradient(#efe1f7, #f7e0ec, #eef7e6)",
}

// The cast per wall. Characters are large and each sits in its own horizontal
// zone along the foot (left / centre / right) so they never overlap; secondary
// characters reveal from `md`/`lg`/`xl` up so mobile keeps a calm scene and
// nothing crowds the centered content column.
function Scene({ variant }: { variant: WallVariant }) {
  switch (variant) {
    case "cafe":
      // Menu is a tall centered column, so the cast stays in the side gutters.
      return (
        <>
          <Cloud className="absolute top-6 left-[4%] w-28 opacity-90 md:w-40" />
          <Cloud className="absolute top-16 right-[5%] w-24 opacity-80 md:w-36" />
          <Butterfly className="absolute top-44 left-[11%] hidden w-12 md:block" />
          <Hills className="absolute inset-x-0 bottom-0 h-32 w-full" />
          <Giraffe className="absolute bottom-6 left-[1%] hidden h-64 lg:block xl:h-80" />
          <WolfOnBike className="absolute right-[1%] bottom-10 hidden w-64 lg:block xl:w-72" />
        </>
      )
    case "meadow":
      return (
        <>
          <Cloud className="absolute top-8 left-[8%] w-32 opacity-90 md:w-40" />
          <Cloud className="absolute top-16 right-[10%] hidden w-32 opacity-80 md:block" />
          <HotAirBalloon
            color="var(--brand-rose)"
            pattern="dots"
            className="absolute top-8 right-[5%] hidden h-36 sm:block md:h-44"
          />
          <Butterfly className="absolute top-40 left-[24%] hidden w-12 md:block" />
          <Hills
            back="var(--brand-mint)"
            front="#bfe3a8"
            className="absolute inset-x-0 bottom-0 h-32 w-full"
          />
          <PalmTree className="absolute bottom-14 left-[1%] h-44 sm:h-56 md:h-64" />
          <Elephant className="absolute right-[3%] bottom-8 hidden h-40 lg:block xl:h-48" />
        </>
      )
    case "market":
      return (
        <>
          <Sun className="absolute top-6 left-[6%] w-28 md:w-36" />
          <Cloud className="absolute top-14 right-[9%] w-32 opacity-85 md:w-40" />
          <Bird className="absolute top-24 right-[32%] hidden w-16 md:block" />
          <Hills className="absolute inset-x-0 bottom-0 h-28 w-full" />
          <MarketStall className="absolute bottom-8 left-[3%] h-44 sm:h-52 md:h-60" />
          <Zebra className="absolute right-[4%] bottom-8 hidden h-40 lg:block xl:h-48" />
        </>
      )
    case "mountains":
      return (
        <>
          <Cloud className="absolute top-8 left-[10%] w-28 opacity-85 md:w-36" />
          <Cloud className="absolute top-16 right-[10%] hidden w-40 opacity-80 md:block" />
          <Heart className="absolute top-14 left-[34%] hidden w-6 md:block" />
          <Hills
            back="#cbb8e6"
            front="#b7a4dd"
            className="absolute inset-x-0 bottom-12 h-28 w-full opacity-70"
          />
          <Hills className="absolute inset-x-0 bottom-0 h-28 w-full" />
          <Rabbit className="absolute bottom-8 left-[3%] h-32 sm:h-40 md:h-44" />
          <Tree className="absolute right-[3%] bottom-8 hidden h-48 lg:block" />
        </>
      )
    case "savanna":
      // Gallery — the big-animal wall. Spread across the whole foot.
      return (
        <>
          <Cloud className="absolute top-6 left-[30%] hidden w-52 opacity-90 sm:block" />
          <HotAirBalloon
            color="var(--brand-rose)"
            pattern="dots"
            className="absolute top-6 left-[4%] hidden h-40 sm:block md:h-52"
          />
          <Hills className="absolute inset-x-0 bottom-0 h-32 w-full" />
          <Elephant className="absolute bottom-4 left-[2%] hidden h-44 md:block xl:h-52" />
          <Flamingo className="absolute right-[26%] bottom-2 hidden h-64 lg:block xl:h-72" />
          <Rhino className="absolute right-[2%] bottom-4 h-40 sm:h-48 md:h-56" />
        </>
      )
    case "town":
      return (
        <>
          <Cloud className="absolute top-8 left-[8%] w-32 opacity-85 md:w-40" />
          <Cloud className="absolute top-6 right-[6%] hidden w-32 opacity-80 md:block" />
          <HotAirBalloon
            color="var(--brand-lavender)"
            pattern="scallop"
            className="absolute top-8 left-[44%] hidden h-32 sm:block"
          />
          <Bee className="absolute top-24 right-[28%] hidden w-16 md:block" />
          <TownSilhouette className="absolute inset-x-0 bottom-0 h-28 w-full" />
          <Castle className="absolute bottom-12 left-[3%] h-40 sm:h-48 md:h-56" />
          <Hills className="absolute inset-x-0 bottom-0 h-16 w-full" />
        </>
      )
    case "windmill":
      return (
        <>
          <Sun className="absolute top-6 right-[8%] w-28 md:w-36" />
          <Cloud className="absolute top-14 left-[10%] hidden w-32 opacity-85 md:block" />
          <Hills className="absolute inset-x-0 bottom-0 h-28 w-full" />
          <Tree className="absolute bottom-8 left-[3%] h-40 sm:h-48 md:h-52" />
          <Rabbit className="absolute bottom-8 left-[26%] hidden h-28 lg:block" />
          <Windmill className="absolute right-[5%] bottom-8 hidden h-52 md:block xl:h-60" />
        </>
      )
    case "party":
      // Birthdays — a sky full of balloons, framing the centered content.
      return (
        <>
          <Cloud className="absolute top-10 left-[6%] w-32 opacity-85 md:w-40" />
          <Cloud className="absolute top-16 right-[8%] hidden w-32 opacity-80 md:block" />
          <PartyBalloon
            color="var(--brand-rose)"
            className="absolute top-4 left-[2%] h-32 sm:h-40"
          />
          <PartyBalloon
            color="var(--brand-mint)"
            className="absolute top-2 left-[14%] hidden h-44 sm:block"
          />
          <PartyBalloon
            color="var(--brand-flower-pink)"
            className="absolute top-12 left-[26%] hidden h-28 md:block"
          />
          <PartyBalloon
            color="var(--brand-lavender)"
            className="absolute top-3 right-[24%] hidden h-40 md:block"
          />
          <PartyBalloon
            color="var(--brand-banana)"
            className="absolute top-10 right-[13%] hidden h-32 sm:block"
          />
          <PartyBalloon
            color="var(--brand-rose)"
            className="absolute top-2 right-[2%] h-40 sm:h-48"
          />
          <Heart className="absolute top-28 left-[46%] hidden w-6 md:block" />
          <Hills className="absolute inset-x-0 bottom-0 h-24 w-full" />
        </>
      )
  }
}

interface WallSceneProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which Baloona wall to paint. */
  variant?: WallVariant
}

/**
 * A full-bleed decorative background recreating one of the painted Baloona
 * walls: a soft sky gradient, rolling hills, and a small cast of the venue's
 * characters. Drop as the first child of a `relative isolate overflow-hidden`
 * section — `isolate` is required so the `-z-10` layer paints inside the section
 * (behind the content, above the page background) instead of vanishing behind
 * it. Fades under a top scrim so headings stay legible. Purely ornamental
 * (`aria-hidden`, `pointer-events-none`).
 */
function WallScene({
  variant = "meadow",
  className,
  ...props
}: WallSceneProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: SKY[variant] }}
      />
      <Scene variant={variant} />
      {/* Legibility scrim so headings read over the scene. */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0))",
        }}
      />
    </div>
  )
}

export { WallScene }
