"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { A11y, EffectCreative, Keyboard } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/effect-creative"

export type GalleryImage = { src: string; alt: string }
export type GalleryItem = {
  name: string
  demo?: string
  images: GalleryImage[]
}

/* ───────────── Lightbox: landscape pop-up with a swipeable image carousel ───────────── */

function GalleryModal({
  item,
  isDarkMode,
  onClose,
}: {
  item: GalleryItem
  isDarkMode: boolean
  onClose: () => void
}) {
  const [active, setActive] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const total = item.images.length

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }
      // Keep Tab inside the dialog
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]")
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [onClose])

  const border = isDarkMode ? "border-white/25" : "border-black/25"
  const muted = isDarkMode ? "text-white/75" : "text-black/75"
  const arrowBtn = `w-9 h-9 flex items-center justify-center border transition-colors disabled:opacity-30 disabled:pointer-events-none ${
    isDarkMode
      ? "border-white/30 text-white/80 hover:border-white/60 hover:text-white"
      : "border-black/30 text-black/75 hover:border-black/70 hover:text-black"
  }`

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.name} screenshots`}
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-5xl max-h-full overflow-y-auto border p-3 sm:p-5 flex flex-col gap-3 sm:gap-4 ${
          isDarkMode ? "bg-[#17171b] border-white/25 text-white/90" : "bg-white border-black/25 text-black"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-mono text-base sm:text-xl leading-tight">{item.name}</h3>
          <div className="flex items-center gap-2">
            {item.demo && (
              <a
                href={item.demo}
                target="_blank"
                rel="noreferrer"
                className={`font-mono text-sm px-3 py-1.5 border transition-colors ${
                  isDarkMode
                    ? "border-white/40 text-white/90 hover:bg-white/15"
                    : "border-black/60 text-black hover:bg-black/10"
                }`}
              >
                Live Demo ↗
              </a>
            )}
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close gallery"
              className={`w-9 h-9 flex items-center justify-center border transition-colors ${
                isDarkMode
                  ? "border-white/30 text-white/80 hover:border-white/60 hover:text-white"
                  : "border-black/30 text-black/75 hover:border-black/70 hover:text-black"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Landscape image carousel */}
        <Swiper
          modules={[EffectCreative, Keyboard, A11y]}
          effect="creative"
          creativeEffect={{
            prev: { shadow: true, translate: [0, 0, -400] },
            next: { translate: ["100%", 0, 0] },
          }}
          grabCursor
          slidesPerView={1}
          spaceBetween={0}
          keyboard={{ enabled: true }}
          onSwiper={s => { swiperRef.current = s }}
          onSlideChange={s => setActive(s.activeIndex)}
          className={`w-full border ${border}`}
        >
          {item.images.map(image => (
            <SwiperSlide key={image.src}>
              <div
                className={`w-full flex items-center justify-center ${isDarkMode ? "bg-neutral-900" : "bg-neutral-100"}`}
                style={{ aspectRatio: "16 / 10", maxHeight: "68svh" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  draggable={false}
                  className="h-full w-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Footer: caption + arrows */}
        <div className="flex items-center justify-between gap-4">
          <p className={`font-sans text-sm sm:text-base min-w-0 ${muted}`}>{item.images[active]?.alt}</p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`font-mono text-sm mr-1 ${muted}`}>
              {active + 1} / {total}
            </span>
            <button onClick={() => swiperRef.current?.slidePrev()} disabled={active === 0} aria-label="Previous image" className={arrowBtn}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={() => swiperRef.current?.slideNext()} disabled={active === total - 1} aria-label="Next image" className={arrowBtn}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="rotate-180">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/* ───────────── The three cards shown under the project carousel ───────────── */

export function ProjectGallery({
  items,
  isDarkMode,
  label = "Live demos",
  columns = 3,
}: {
  items: GalleryItem[]
  isDarkMode: boolean
  label?: string
  columns?: 1 | 3
}) {
  const [openItem, setOpenItem] = useState<GalleryItem | null>(null)
  const close = useCallback(() => setOpenItem(null), [])

  const muted = isDarkMode ? "text-white/75" : "text-black/75"

  return (
    <div>
      <p className={`font-mono text-sm tracking-[0.2em] uppercase mb-4 sm:mb-6 ${muted}`}>{label}</p>

      <div className={`grid grid-cols-1 gap-5 sm:gap-6 ${columns === 3 ? "sm:grid-cols-3" : ""}`}>
        {items.map(item => {
          const cover = item.images[0]
          return (
            <div key={item.name} className="flex flex-col gap-3 min-w-0">
              {cover ? (
                <button
                  onClick={() => setOpenItem(item)}
                  aria-label={`View ${item.images.length} screenshots of ${item.name}`}
                  className={`group relative block w-full overflow-hidden border text-left cursor-zoom-in ${
                    isDarkMode ? "border-white/25 bg-neutral-900" : "border-black/25 bg-neutral-100"
                  }`}
                  style={{ aspectRatio: "16 / 10" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover.src}
                    alt={cover.alt}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-2 left-2 font-mono text-xs px-2 py-1 bg-black/70 text-white/90">
                    {item.images.length} screenshots
                  </span>
                </button>
              ) : (
                <div
                  className={`flex items-center justify-center border border-dashed text-center px-4 ${
                    isDarkMode ? "border-white/25 text-white/75" : "border-black/30 text-black/75"
                  }`}
                  style={{ aspectRatio: "16 / 10" }}
                >
                  <span className="font-mono text-sm">Screenshots coming soon</span>
                </div>
              )}

              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-sm sm:text-base">{item.name}</span>
                {item.demo && (
                  <a
                    href={item.demo}
                    target="_blank"
                    rel="noreferrer"
                    className={`font-mono text-sm underline underline-offset-4 flex-shrink-0 transition-opacity ${
                      isDarkMode ? "text-white/80 hover:text-white" : "text-black/75 hover:text-black"
                    }`}
                  >
                    Live Demo ↗
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {openItem && <GalleryModal item={openItem} isDarkMode={isDarkMode} onClose={close} />}
    </div>
  )
}
