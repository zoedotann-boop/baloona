import { Hills, Sun, TownSilhouette } from "@/components/brand/motifs"
import {
  BalloonBunch,
  Bunny,
  Butterfly,
  Castle,
  CatTractor,
  CloudFlat,
  CloudFluffy,
  Cypress,
  Dove,
  Elephant,
  Fish,
  HeartsPink,
  LavenderDots,
  StripedBalloon,
  Zebra,
} from "@/components/brand/scene-art"
import { cn } from "@/lib/utils"

type WallVariant =
  "meadow" | "market" | "mountains" | "savanna" | "town" | "windmill" | "party"

// Each wall is a soft vertical sky gradient (a real CSS gradient, so it does not
// depend on Tailwind's gradient utility names) built from the `--scene-sky-*`
// tokens sampled off the printed Baloona walls.
const SKY: Record<WallVariant, string> = {
  meadow:
    "linear-gradient(var(--scene-sky-lavender), color-mix(in srgb, var(--scene-sky-lavender) 55%, white))",
  market:
    "linear-gradient(var(--scene-sky-pink-deep), var(--scene-sky-pink), color-mix(in srgb, var(--scene-sky-banana) 60%, white))",
  mountains:
    "linear-gradient(var(--scene-sky-lavender), color-mix(in srgb, var(--scene-sky-pink) 60%, white))",
  savanna:
    "linear-gradient(var(--scene-sky-lavender), color-mix(in srgb, var(--scene-sky-pink) 45%, white))",
  town: "linear-gradient(var(--scene-sky-blue), color-mix(in srgb, var(--scene-sky-blue) 40%, white))",
  windmill:
    "linear-gradient(var(--scene-sky-banana), color-mix(in srgb, var(--scene-sky-blue) 70%, white))",
  party:
    "linear-gradient(var(--scene-sky-lavender), var(--scene-sky-pink), color-mix(in srgb, var(--scene-sky-banana) 55%, white))",
}

// The cast per wall, drawn from the real mural artwork. Characters are large and
// each sits in its own horizontal zone along the foot (left / centre / right) so
// they never overlap; secondary characters reveal from `md`/`lg`/`xl` up so
// mobile keeps a calm scene and nothing crowds the centered content column.
function Scene({ variant }: { variant: WallVariant }) {
  switch (variant) {
    case "meadow":
      // Zone 2 — lavender sky, the pond wall: elephant, leaping bunny, cypress.
      return (
        <>
          <CloudFluffy className="absolute top-8 left-[8%] w-32 opacity-95 md:w-40" />
          <CloudFlat className="absolute top-16 right-[10%] hidden w-32 opacity-90 md:block" />
          <StripedBalloon className="absolute top-8 right-[5%] hidden h-36 sm:block md:h-44" />
          <Butterfly className="absolute top-40 left-[24%] hidden w-12 md:block" />
          <Hills
            back="var(--scene-hill-back)"
            front="var(--scene-hill-front)"
            className="absolute inset-x-0 bottom-0 h-32 w-full"
          />
          <Cypress className="absolute bottom-14 left-[1%] h-44 sm:h-56 md:h-64" />
          <Bunny className="absolute bottom-16 left-[26%] hidden h-20 lg:block" />
          <Fish className="absolute right-[36%] bottom-6 hidden w-16 md:block" />
          <Elephant className="absolute right-[3%] bottom-8 hidden h-40 lg:block xl:h-48" />
        </>
      )
    case "market":
      // Zone 1 — pink sky with the smiling sun and a trotting zebra.
      return (
        <>
          <Sun className="absolute top-6 left-[6%] w-28 md:w-36" />
          <CloudFluffy className="absolute top-14 right-[9%] w-32 opacity-90 md:w-40" />
          <Dove className="absolute top-24 right-[32%] hidden w-20 md:block" />
          <HeartsPink className="absolute top-16 left-[34%] hidden w-8 md:block" />
          <Hills className="absolute inset-x-0 bottom-0 h-28 w-full" />
          <LavenderDots className="absolute bottom-2 left-[6%] hidden w-40 opacity-80 md:block" />
          <Zebra className="absolute right-[4%] bottom-8 hidden h-40 lg:block xl:h-48" />
        </>
      )
    case "mountains":
      // Zone 2/4 — lavender hills with a bunny and a lone cypress.
      return (
        <>
          <CloudFluffy className="absolute top-8 left-[10%] w-28 opacity-90 md:w-36" />
          <CloudFlat className="absolute top-16 right-[10%] hidden w-40 opacity-85 md:block" />
          <HeartsPink className="absolute top-14 left-[34%] hidden w-8 md:block" />
          <Hills
            back="var(--scene-town)"
            front="color-mix(in srgb, var(--scene-town) 80%, white)"
            className="absolute inset-x-0 bottom-12 h-28 w-full opacity-70"
          />
          <Hills
            back="var(--scene-hill-back)"
            front="var(--scene-hill-front)"
            className="absolute inset-x-0 bottom-0 h-28 w-full"
          />
          <Bunny className="absolute bottom-10 left-[3%] h-24 sm:h-28 md:h-32" />
          <Cypress className="absolute right-[3%] bottom-8 hidden h-48 lg:block" />
        </>
      )
    case "savanna":
      // Gallery — the big-animal wall. Spread across the whole foot.
      return (
        <>
          <CloudFluffy className="absolute top-6 left-[30%] hidden w-52 opacity-95 sm:block" />
          <StripedBalloon className="absolute top-6 left-[4%] hidden h-40 sm:block md:h-52" />
          <Dove className="absolute top-16 right-[30%] hidden w-24 md:block" />
          <Hills
            back="var(--scene-hill-back)"
            front="var(--scene-hill-front)"
            className="absolute inset-x-0 bottom-0 h-32 w-full"
          />
          <Elephant className="absolute bottom-4 left-[2%] hidden h-44 md:block xl:h-52" />
          <Bunny className="absolute right-[30%] bottom-6 hidden h-24 lg:block" />
          <Zebra className="absolute right-[2%] bottom-4 h-40 sm:h-48 md:h-56" />
        </>
      )
    case "town":
      // Zone 4 — blue sky, the pink castle over a lavender town skyline.
      return (
        <>
          <CloudFluffy className="absolute top-8 left-[8%] w-32 opacity-90 md:w-40" />
          <CloudFluffy className="absolute top-6 right-[6%] hidden w-32 opacity-85 md:block" />
          <BalloonBunch className="absolute top-6 left-[44%] hidden h-36 sm:block" />
          <Butterfly className="absolute top-24 right-[28%] hidden w-12 md:block" />
          <TownSilhouette
            fill="var(--scene-town)"
            className="absolute inset-x-0 bottom-0 h-28 w-full"
          />
          <Castle className="absolute bottom-12 left-[3%] h-40 sm:h-48 md:h-56" />
          <Hills
            back="var(--scene-hill-back)"
            front="var(--scene-hill-front)"
            className="absolute inset-x-0 bottom-0 h-16 w-full"
          />
        </>
      )
    case "windmill":
      // Zone 3 — sunny fields with the cat on its pink tractor.
      return (
        <>
          <Sun className="absolute top-6 right-[8%] w-28 md:w-36" />
          <CloudFluffy className="absolute top-14 left-[10%] hidden w-32 opacity-90 md:block" />
          <Cypress className="absolute right-[6%] bottom-8 hidden h-52 md:block xl:h-60" />
          <Bunny className="absolute right-[28%] bottom-10 hidden h-20 lg:block" />
          <Hills className="absolute inset-x-0 bottom-0 h-28 w-full" />
          <CatTractor className="absolute bottom-6 left-[3%] h-40 sm:h-48 md:h-56" />
        </>
      )
    case "party":
      // Birthdays — a sky full of balloons, framing the centered content.
      return (
        <>
          <CloudFluffy className="absolute top-10 left-[6%] w-32 opacity-90 md:w-40" />
          <CloudFlat className="absolute top-16 right-[8%] hidden w-32 opacity-85 md:block" />
          <BalloonBunch className="absolute top-2 left-[4%] h-44 sm:h-52" />
          <StripedBalloon className="absolute top-3 left-[26%] hidden h-36 md:block" />
          <StripedBalloon className="absolute top-4 right-[24%] hidden h-40 md:block" />
          <BalloonBunch className="absolute top-2 right-[4%] hidden h-48 sm:block" />
          <HeartsPink className="absolute top-28 left-[46%] hidden w-9 md:block" />
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
 * characters (ported from the mural artwork). Drop as the first child of a
 * `relative isolate overflow-hidden` section — `isolate` is required so the
 * `-z-10` layer paints inside the section (behind the content, above the page
 * background) instead of vanishing behind it. Fades under a top scrim so
 * headings stay legible. Purely ornamental (`aria-hidden`, `pointer-events-none`).
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
