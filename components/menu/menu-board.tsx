"use client"

import { useState } from "react"

import { MenuItemCard } from "@/components/brand/menu-item-card"
import { MENU_DATA, MENU_TABS, type MenuTabId } from "@/lib/site-content"
import { cn } from "@/lib/utils"

/** Menu page board: vertical category tabs + a responsive item grid. */
function MenuBoard() {
  const [tab, setTab] = useState<MenuTabId>("food")

  return (
    <section className="px-5 py-14 md:px-9">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="font-heading text-[40px] font-black text-brand-brown">
            התפריט שלנו
          </h1>
          <p className="mt-2 text-[15px] text-[#6b5f60]">
            אוכל טרי, קפה טוב ומתוקים לילדים — הכל במקום.
          </p>
        </header>

        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="flex gap-2 overflow-x-auto pb-1 md:w-40 md:flex-none md:flex-col md:overflow-visible md:pb-0">
            {MENU_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-pressed={tab === t.id}
                className={cn(
                  "h-10 rounded-full px-4 text-[13px] font-bold whitespace-nowrap transition md:w-full md:text-right",
                  tab === t.id
                    ? "bg-primary text-primary-foreground shadow-[0_10px_24px_-12px_rgba(255,125,89,0.8)]"
                    : "border border-[#f3d3d9] bg-white text-brand-brown hover:brightness-95"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MENU_DATA[tab].map((item) => (
                <MenuItemCard
                  key={item.name}
                  name={item.name}
                  price={item.price}
                  desc={item.desc}
                />
              ))}
            </div>
            <p className="mt-8 text-[12px] text-brand-muted">
              * התפריט מתעדכן מעת לעת ועשוי להשתנות לפי עונה ומלאי.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { MenuBoard }
