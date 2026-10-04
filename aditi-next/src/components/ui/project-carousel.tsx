"use client"

import { useState } from "react"
import { Autoplay, EffectCreative, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/effect-creative"
import "swiper/css/pagination"
import "swiper/css/autoplay"

export type CarouselImage = { src: string; alt: string }

type Props = {
  images: CarouselImage[]
  isDarkMode: boolean
  /** width / height of every slide, e.g. 1.6 for 16:10 */
  aspect?: number
  /** "contain" shows the whole image (best for screenshots and charts), "cover" fills the slide */
  fit?: "contain" | "cover"
}

const css = `
  .project-carousel {
    width: 100%;
    padding-bottom: 38px !important;
  }
  .project-carousel .swiper-slide {
    border-radius: 14px;
    overflow: hidden;
  }
  .project-carousel .swiper-pagination-bullet {
    background-color: currentColor !important;
    opacity: 0.25;
  }
  .project-carousel .swiper-pagination-bullet-active {
    opacity: 0.9;
  }
`

export function ProjectCarousel({ images, isDarkMode, aspect = 1.6, fit = "contain" }: Props) {
  const [active, setActive] = useState(0)

  return (
    <div className={`w-full max-w-3xl ${isDarkMode ? "text-white" : "text-black"}`}>
      <style>{css}</style>
      <Swiper
        className="project-carousel"
        modules={[EffectCreative, Pagination, Autoplay]}
        effect="creative"
        creativeEffect={{
          prev: { shadow: true, translate: [0, 0, -400] },
          next: { translate: ["100%", 0, 0] },
        }}
        grabCursor
        centeredSlides
        slidesPerView="auto"
        spaceBetween={0}
        loop={images.length >= 4}
        autoplay={{ delay: 3000, disableOnInteraction: true, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        onRealIndexChange={(swiper) => setActive(swiper.realIndex)}
      >
        {images.map((image, i) => (
          <SwiperSlide key={image.src + i}>
            <div
              className={`w-full ${isDarkMode ? "bg-neutral-900" : "bg-neutral-100"}`}
              style={{ aspectRatio: String(aspect) }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                draggable={false}
                className={`h-full w-full ${fit === "cover" ? "object-cover object-top" : "object-contain"}`}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <p className={`font-mono text-xs mt-1 ${isDarkMode ? "text-white/40" : "text-black/60"}`}>
        {images[active]?.alt}
      </p>
    </div>
  )
}
