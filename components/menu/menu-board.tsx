import Image from "next/image"

import { Reveal } from "@/components/brand/reveal"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"

interface MenuCategoryContent {
  id: string
  label: string
  items: {
    id: string
    name: string
    description: string
    price: string
  }[]
}

interface MenuBoardProps {
  title: string
  description: string
  note: string
  categories: MenuCategoryContent[]
}

/** Menu page: a flat, flowing "docs" view — categories with priced item lines. */
function MenuBoard({ title, description, note, categories }: MenuBoardProps) {
  return (
    <Section spacing="md" className="bg-brand-cloud">
      {/* The real "Baloona CAFÉ" banner from the café signage, full-bleed at the
          top — the giraffe, the wolf-on-bike + penguin and the scene, exactly as
          painted. Vector SVG (assembled from the brand illustrations) so it stays
          crisp at any width. Pulled past the section gutter/top padding to span
          edge to edge. Next serves `.svg` unoptimized automatically. */}
      <h1 className="sr-only">{title}</h1>
      <Image
        src="/assets/menu/cafe-banner.svg"
        alt="Baloona Café"
        width={2400}
        height={567}
        priority
        sizes="100vw"
        className="-mx-5 -mt-14 mb-10 h-auto w-[calc(100%+2.5rem)] max-w-none md:-mx-9 md:-mt-16 md:mb-12 md:w-[calc(100%+4.5rem)]"
      />
      <Container size="sm">
        <header className="mb-8 text-center">
          <p className="text-[18px] leading-relaxed text-brand-ink-soft">
            {description}
          </p>
        </header>

        {/* In-page jump nav — plain anchor links, flat pills. */}
        <nav className="mb-12 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#menu-${category.id}`}
              className="flex h-9 items-center rounded-full border border-border bg-white px-4 text-[15px] font-bold text-brand-plum transition hover:-translate-y-0.5"
            >
              {category.label}
            </a>
          ))}
        </nav>

        <div className="space-y-14">
          {categories.map((category) => (
            <Reveal
              key={category.id}
              as="section"
              id={`menu-${category.id}`}
              className="scroll-mt-24"
            >
              <h2 className="border-b-2 border-brand-lavender/40 pb-2 font-heading text-[26px] font-black text-brand-plum">
                {category.label}
              </h2>
              <div className="mt-2 divide-y divide-border">
                {category.items.map((item) => (
                  <div key={item.id} className="py-3.5">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-heading text-[18px] font-bold text-foreground">
                        {item.name}
                      </span>
                      <span className="shrink-0 font-heading text-[17px] font-black text-brand-plum">
                        {item.price}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-12 text-center text-[14px] text-muted-foreground">
          {note}
        </p>
      </Container>
    </Section>
  )
}

export { MenuBoard }
