import { AccentSquare } from "@/components/brand/accent-square"
import { Panel } from "@/components/brand/panel"
import { Photo } from "@/components/brand/photo"
import { Reveal } from "@/components/brand/reveal"

interface VisionPanelProps {
  title: string
  body: string
  imageUrl?: string
}

/** Vision — a lavender panel with flowing text beside a photo. */
function VisionPanel({ title, body, imageUrl }: VisionPanelProps) {
  return (
    <section className="px-5 py-20 md:px-9 md:py-28">
      <Panel
        tone="lavender"
        className="mx-auto grid max-w-6xl items-center gap-10 overflow-visible md:grid-cols-2"
      >
        <AccentSquare
          className="absolute -start-4 -top-5 -z-10"
          color="bg-brand-banana"
          rotate={-8}
        />
        <AccentSquare
          className="absolute -end-5 -bottom-6 -z-10"
          color="bg-brand-mint"
          rotate={10}
        />

        <Reveal>
          <h2 className="font-heading text-[clamp(30px,4vw,46px)] leading-[1.1] font-black">
            {title}
          </h2>
          <p className="mt-6 text-[19px] leading-[1.9] text-white/90 md:text-[20px]">
            {body}
          </p>
        </Reveal>

        <Reveal delay={100}>
          <Photo src={imageUrl} alt={title} className="aspect-[4/3] w-full" />
        </Reveal>
      </Panel>
    </section>
  )
}

export { VisionPanel }
