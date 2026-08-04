import { Reveal } from "@/components/brand/reveal"

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
    <section className="px-5 py-16 md:px-9 md:py-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="font-heading text-[clamp(34px,5vw,50px)] font-black text-brand-plum">
            {title}
          </h1>
          <p className="mt-3 text-[18px] leading-relaxed text-brand-ink-soft">
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
      </div>
    </section>
  )
}

export { MenuBoard }
