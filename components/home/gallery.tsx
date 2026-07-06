import { Photo } from "@/components/brand/photo"

const GALLERY_IMAGES = [
  "/assets/gallery/gallery-1.png",
  "/assets/gallery/gallery-2.png",
  "/assets/gallery/gallery-3.png",
  "/assets/gallery/gallery-4.png",
  "/assets/gallery/gallery-5.png",
  "/assets/gallery/gallery-6.png",
]

/** Photo gallery grid of venue images. */
function Gallery() {
  return (
    <section className="bg-white px-5 py-16 md:px-9">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-heading text-[32px] font-black text-brand-brown">
            המתחם בתמונות
          </h2>
        </div>
        <div className="grid auto-rows-[106px] grid-cols-2 gap-3 md:grid-cols-4">
          <Photo
            src={GALLERY_IMAGES[0]}
            className="col-span-2 row-span-2 h-full"
          />
          {GALLERY_IMAGES.slice(1, 5).map((src) => (
            <Photo key={src} src={src} className="h-full" />
          ))}
          <Photo
            src={GALLERY_IMAGES[5]}
            className="col-span-2 h-full md:col-span-4"
          />
        </div>
      </div>
    </section>
  )
}

export { Gallery }
