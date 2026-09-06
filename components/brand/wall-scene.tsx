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

function Scene({ variant }: { variant: WallVariant }) {
  switch (variant) {
    case "meadow":
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
  variant?: WallVariant
}

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
