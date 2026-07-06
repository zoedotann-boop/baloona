import { Photo } from "@/components/brand/photo"

/** Photo gallery grid (placeholders until real assets are added). */
function Gallery() {
  return (
    <section className="bg-white px-5 py-16 md:px-9">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-heading text-[32px] font-black text-brand-brown">
            המתחם בתמונות
          </h2>
          <a
            href="#"
            className="text-[13px] font-bold text-brand-brown underline"
          >
            לכל הגלריה
          </a>
        </div>
        <div className="grid auto-rows-[106px] grid-cols-2 gap-3 md:grid-cols-4">
          <Photo className="col-span-2 row-span-2 h-full" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Photo key={i} className="h-full" />
          ))}
        </div>
      </div>
    </section>
  )
}

export { Gallery }
