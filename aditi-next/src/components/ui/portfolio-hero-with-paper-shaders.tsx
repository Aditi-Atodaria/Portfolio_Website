"use client"

import { Dithering } from "@paper-design/shaders-react"
import { Terminal, Cabinet } from "@lucasmarkes/hairline/react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { A11y, Autoplay, EffectCreative, Keyboard, Pagination } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/effect-creative"
import "swiper/css/pagination"
import "swiper/css/autoplay"

type Project = {
  name: string
  tag: string
  subtitle: string
  desc: string
  bullets: { bold: string; rest: string }[]
  stack: string[]
  github: string
  demo?: string
}

const PROJECTS: Project[] = [
  {
    name: "TruthGuard",
    tag: "Next.js · AI",
    subtitle: "Real-Time AI Fact-Checking Platform",
    desc: "An AI-powered misinformation detection tool that verifies claims, articles, and social posts against live web sources and fact-check databases, returning a sourced verdict with a confidence score.",
    bullets: [
      { bold: "Multi-input verification", rest: "supporting raw text, article URLs, and social media screenshots via OCR" },
      { bold: "LLM-powered reasoning", rest: "using Groq (Llama 3.3 70B) to extract claims and weigh evidence" },
      { bold: "Live web search grounding", rest: "via the Tavily Search API, with a fallback search path" },
      { bold: "Fact-check database cross-referencing", rest: "against the Google Fact Check Tools API" },
      { bold: "Publisher-credibility scoring", rest: "that weights sources and produces a transparent confidence score" },
      { bold: "Claim caching & history", rest: "backed by Supabase, avoiding redundant re-verification of the same claim" },
    ],
    stack: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Groq API", "Tavily API", "Supabase", "Cheerio"],
    github: "https://github.com/Aditi-Atodaria/TruthGuard",
    demo: "https://truthguard-x9d1.vercel.app/",
  },
  {
    name: "Threadverse",
    tag: "Flask · AI",
    subtitle: "Multi-Vendor Fashion Commerce Platform",
    desc: "A full-stack fashion marketplace where independent vendors set up storefronts and sell directly to customers on a single platform — without the cost of custom development.",
    bullets: [
      { bold: "Multi-vendor storefronts", rest: "enabling small fashion businesses to launch and sell independently" },
      { bold: "AI stylist chatbot", rest: "powered by Llama 3.3 70B via Groq API for personalised outfit recommendations" },
      { bold: "UPI QR code payments", rest: "integrated into the checkout flow using qrcode and Pillow" },
      { bold: "Product browsing & cart", rest: "with filters, cart management, and order tracking" },
      { bold: "Wishlist system", rest: "with persistent user preferences across sessions" },
    ],
    stack: ["Python", "Flask", "SQLite", "Jinja2", "JavaScript", "Groq API", "Authlib", "Werkzeug"],
    github: "https://github.com/Aditi-Atodaria/Threadverse-new",
    demo: "https://threadverse-new.vercel.app/",
  },
  {
    name: "Regime Classifier",
    tag: "Machine Learning",
    subtitle: "Softmax Regression from Scratch",
    desc: "A multi-class classifier written in plain NumPy that predicts a stock's market regime (trending up, trending down, volatile, range-bound) from technical indicators, built to understand how classification models learn and checked honestly against baselines and scikit-learn.",
    bullets: [
      { bold: "Built from scratch in NumPy", rest: "— softmax, cross-entropy loss, L2 regularisation and gradient descent" },
      { bold: "Verified for correctness", rest: "with a numerical gradient check, 11 unit tests, and 99.97% prediction agreement with scikit-learn" },
      { bold: "Leak-free evaluation", rest: "using a chronological train/test split, a gap for the forecast task, and a scaler fitted on training data only" },
      { bold: "77.2% accuracy, 0.705 macro-F1", rest: "on held-out data when classifying today's regime, vs 55.9% and 0.179 for the majority class" },
      { bold: "Honest forecasting result", rest: "— the 5-day-ahead forecast did not beat a persistence baseline (macro-F1 0.630 vs 0.727)" },
    ],
    stack: ["Python", "NumPy", "scikit-learn", "pandas", "Matplotlib", "pytest"],
    github: "https://github.com/Aditi-Atodaria/Regime-Classifier",
  },
  {
    name: "Stock Analyzer",
    tag: "C",
    subtitle: "CLI Technical Analysis Tool",
    desc: "A command-line tool written entirely in C to compute key technical indicators from historical CSV price data — built from the ground up without abstraction libraries.",
    bullets: [
      { bold: "CSV parsing", rest: "of historical OHLCV price data from raw files" },
      { bold: "RSI calculation", rest: "implemented from scratch to understand the underlying algorithm" },
      { bold: "Volume metric analysis", rest: "to identify accumulation and distribution signals" },
      { bold: "Ground-up implementation", rest: "with no external libraries — pure C logic throughout" },
      { bold: "Command-line interface", rest: "for flexible input and readable indicator output" },
    ],
    stack: ["C", "CSV Parsing", "Technical Indicators"],
    github: "https://github.com/Aditi-Atodaria/stock_analyzer",
  },
]

const carouselCss = `
  .project-cards .swiper {
    padding-bottom: 44px;
  }
  .project-cards .swiper-slide {
    height: auto;
    overflow: hidden;
  }
  .project-cards .swiper-slide > article {
    height: 100%;
  }
  .project-cards .swiper-pagination-bullet {
    background-color: currentColor !important;
    opacity: 0.25;
  }
  .project-cards .swiper-pagination-bullet-active {
    opacity: 0.9;
  }
`

/** Hairline plates are filled, so their colour must match the page background. */
const hairlineVars = (isDarkMode: boolean) =>
  ({
    "--hairline-plate": isDarkMode ? "#0e0e10" : "#ffffff",
    ...(isDarkMode && {
      "--hairline-edge": "#c4c4cc",
      "--hairline-mid": "#7a7a85",
      "--hairline-lo": "#3a3a42",
    }),
  }) as React.CSSProperties

/** Cabinet has 12 blades (blade 12 is the top one). Cards walk down the cabinet: 12, 9, 6, 3. */
const CABINET_BLADES = 12
const bladeForProject = (index: number) => CABINET_BLADES - index * Math.floor(CABINET_BLADES / PROJECTS.length)

const SKILLS = ["Python", "C", "JavaScript", "React", "React Native", "Three.js", "Jinja2", "HTML/CSS", "Flask", "SQLite", "Firebase", "Groq API", "Expo", "React Navigation", "Git", "Pillow", "Authlib", "Werkzeug"]

const CURRENTLY_EXPLORING = [
  { title: "Mechatronics", desc: "Pursuing a minor, bridging software with mechanical and electrical systems — embedded hardware, sensors, and intelligent machines." },
  { title: "Machine Learning", desc: "Actively learning ML fundamentals — model training, data pipelines, and applying intelligent systems to real engineering problems." },
]

export default function AditiPortfolio() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [activeProject, setActiveProject] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)
  const cabinetRef = useRef<HTMLDivElement>(null)
  const cabinetCaption = useRef("")
  const cabinetHovered = useRef(false)
  const activeProjectRef = useRef(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (scrolled) setMenuOpen(false)
  }, [scrolled])

  // Cabinet only reacts to the pointer, so to focus a blade we replay pointer moves over the
  // figure: sweep its height, note which heights report "blade N", then rest on the middle one.
  const focusBlade = useCallback((blade: number) => {
    const el = cabinetRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) return // hidden on small screens
    const x = r.left + r.width / 2
    const fire = (type: string, y: number) =>
      el.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, clientY: y, pointerType: "mouse" }))
    const hits: number[] = []
    for (let vy = 0; vy <= 320; vy += 2) {
      const y = r.top + (vy / 320) * r.height
      fire("pointermove", y)
      if (cabinetCaption.current === `blade ${blade}`) hits.push(y)
    }
    if (hits.length) fire("pointermove", hits[Math.floor(hits.length / 2)])
    else fire("pointerleave", r.top)
  }, [])

  // The Cabinet is drawn mirrored (facing right) with CSS, but the figure reads the pointer in its own
  // unmirrored space. Real pointer events are swallowed and replayed with a mirrored x so hover lines up.
  // (Replayed and focusBlade events are untrusted and pass straight through.)
  const mirrorPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.nativeEvent.isTrusted) return
    e.stopPropagation()
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.dispatchEvent(new PointerEvent(e.type, {
      bubbles: true,
      clientX: r.left + r.right - e.clientX,
      clientY: e.clientY,
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      isPrimary: e.isPrimary,
    }))
  }

  useEffect(() => {
    activeProjectRef.current = activeProject
    if (!cabinetHovered.current) focusBlade(bladeForProject(activeProject))
  }, [activeProject, focusBlade])

  useEffect(() => {
    const refocus = () => focusBlade(bladeForProject(activeProjectRef.current))
    window.addEventListener("resize", refocus)
    return () => window.removeEventListener("resize", refocus)
  }, [focusBlade])

  const scrollDown = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const navLinks = ["About", "Projects", "Skills", "Contact"]

  return (
    <div className={`transition-colors duration-500 ${isDarkMode ? "bg-[#0e0e10] text-white/90" : "bg-white text-black"}`}>

      {/* ─────────────────────────────────────────
          NAVBAR  —  fixed, sits above everything
      ───────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? isDarkMode
            ? "bg-[#0e0e10]/90 backdrop-blur-md border-b border-white/15"
            : "bg-white/90 backdrop-blur-md border-b border-black/10"
          : isDarkMode ? "bg-[#0e0e10]" : "bg-white"
      }`}>
        {/* Bar row */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-5 sm:py-7">
          <span className={`font-mono text-[13px] tracking-[0.3em] uppercase ${isDarkMode ? "text-white/55" : "text-black/40"}`}>
            Aditi.portfolio
          </span>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-4 md:gap-6">
            {navLinks.map(label => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className={`font-mono text-[13px] tracking-widest uppercase transition-opacity ${isDarkMode ? "text-white/70 hover:text-white" : "text-black/50 hover:text-black"}`}
              >
                {label}
              </a>
            ))}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10" : "hover:bg-black/10"}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10" : "hover:bg-black/10"}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className={`p-2 rounded transition-colors ${isDarkMode ? "hover:bg-white/10" : "hover:bg-black/10"}`}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-64" : "max-h-0"}`}>
          <div className={`flex flex-col px-4 pb-4 gap-1 ${isDarkMode ? "bg-[#0e0e10]" : "bg-white"}`}>
            {navLinks.map(label => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className={`font-mono text-[13px] tracking-widest uppercase py-3 border-b transition-opacity ${
                  isDarkMode
                    ? "text-white/70 hover:text-white border-white/15"
                    : "text-black/60 hover:text-black border-black/8"
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>
      {/* ─────────────────────────────────────────
          END NAVBAR
      ───────────────────────────────────────── */}

      {/* ─────────────────────────────────────────
          HERO  —  full-viewport, shader rectangle
      ───────────────────────────────────────── */}
      <section className={`relative w-full h-screen overflow-hidden ${isDarkMode ? "bg-[#0e0e10]" : "bg-white"}`}>

        {/* Centre content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6">

          <p className={`font-mono text-[13px] sm:text-[13px] tracking-[0.4em] sm:tracking-[0.5em] uppercase mb-3 sm:mb-4 ${isDarkMode ? "text-white/70" : "text-black/50"}`}>
            B.Tech Computer Science
          </p>

          {/* Shader rectangle */}
          <div
            className={`relative border ${isDarkMode ? "border-white" : "border-black"}`}
            style={{ width: "min(90vw, 1100px)", height: "min(60vh, 520px)" }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <Dithering
                style={{ width: "100%", height: "100%" }}
                colorBack={isDarkMode ? "#0e0e10" : "hsl(0, 0%, 100%)"}
                colorFront={isDarkMode ? "hsl(25, 100%, 55%)" : "hsl(220, 100%, 62%)"}
                shape="warp"
                type="4x4"
                size={3}
                offsetX={0}
                offsetY={0}
                scale={0.9}
                rotation={0}
                speed={0.1}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h1
                className={`font-mono font-normal leading-tight tracking-tighter ${isDarkMode ? "text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" : "drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]"}`}
                style={{
                  fontSize: "clamp(2rem, 10vw, 6rem)",
                  ...(isDarkMode ? {} : { color: "hsl(0°, 0%, 29%)" }),
                }}
              >
                ADITI<br />ATODARIA
              </h1>
            </div>
          </div>

          <p className={`font-mono text-[13px] sm:text-sm tracking-[0.25em] sm:tracking-[0.35em] uppercase mt-3 sm:mt-4 px-2 leading-relaxed ${isDarkMode ? "text-white/70" : "text-black/50"}`}>
            Full Stack Developer · AI-Assisted Workflows · Mechatronics Minor
          </p>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollDown}
          className={`absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 font-mono text-[13px] tracking-widest uppercase transition-opacity ${
            scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
          } ${isDarkMode ? "text-white/55 hover:text-white/70" : "text-black/30 hover:text-black/60"}`}
        >
          <span>Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <rect x="6" y="0" width="4" height="4" fill="currentColor" opacity="0.4"/>
            <rect x="6" y="6" width="4" height="4" fill="currentColor" opacity="0.6"/>
            <rect x="6" y="12" width="4" height="4" fill="currentColor" opacity="0.8"/>
            <rect x="6" y="18" width="4" height="4" fill="currentColor"/>
          </svg>
        </button>
      </section>

      {/* ─────────────────────────────────────────
          SCROLLABLE CONTENT
      ───────────────────────────────────────── */}
      <div ref={contentRef}>

        {/* ABOUT */}
        <section id="about" className={`border-t ${isDarkMode ? "border-white/15" : "border-black/8"}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-14 sm:py-24">
            <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 md:gap-16 mb-0">
              <p className={`font-mono text-sm tracking-[0.4em] uppercase mb-6 sm:mb-8 ${isDarkMode ? "text-white/55" : "text-black/60"}`}>01 — About</p>
              <p className={`font-mono text-sm tracking-[0.4em] uppercase mb-6 sm:mb-8 hidden md:block ${isDarkMode ? "text-white/55" : "text-black/60"}`}>Education</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 md:gap-16">
              <div>
                <h2 className={`font-mono text-2xl sm:text-3xl md:text-4xl leading-tight mb-6 sm:mb-8 ${isDarkMode ? "text-white/90" : "text-black"}`}>
                  Curious.<br />End-to-End.<br />Builder.
                </h2>
                <p className={`font-sans text-base sm:text-lg leading-relaxed ${isDarkMode ? "text-white/70" : "text-black/80"}`}>
                  I've been coding since the 6th grade, and that curiosity has never stopped. CS undergrad building real products end-to-end — from AI-powered fashion platforms and mobile apps to CLI tools in C. I also leverage AI tools to accelerate development workflows and enhance the efficiency of my engineering process. I want to understand how everything works at every layer of the stack, not just the surface. Outside of software, I actively pursue Mechatronics and have a deep interest in electronics and robotics, where the physical and digital worlds meet.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <p className={`font-mono text-sm tracking-[0.4em] uppercase md:hidden ${isDarkMode ? "text-white/55" : "text-black/60"}`}>Education</p>
                <div className={`border-t ${isDarkMode ? "border-white/15" : "border-black/8"} pt-6 space-y-4`}>
                  <div className="flex flex-wrap justify-between gap-2 font-mono text-sm sm:text-base">
                    <span>Navrachana University</span>
                    <span className={isDarkMode ? "text-white/55" : "text-black/60"}>S.Y. · In Progress</span>
                  </div>
                  <div className={`flex flex-wrap justify-between gap-2 font-mono text-[13px] sm:text-sm ${isDarkMode ? "text-white/55" : "text-black/65"}`}>
                    <span>CGPA: 8.06</span>
                    <span>B.Tech CSE</span>
                  </div>
                </div>
                {/* Hairline terminal figure — plate colour must match the page background */}
                <div
                  className="w-full max-w-sm md:max-w-none md:w-[112%] md:-ml-[12%] xl:w-[130%] xl:-ml-[15%]"
                  style={hairlineVars(isDarkMode)}
                >
                  <Terminal theme={isDarkMode ? "dark" : "light"} intensity={0.6} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className={`border-t ${isDarkMode ? "border-white/15" : "border-black/8"}`}>
          <style>{carouselCss}</style>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-24">
            <p className={`font-mono text-sm tracking-[0.4em] uppercase mb-6 sm:mb-8 ${isDarkMode ? "text-white/55" : "text-black/60"}`}>02 — Projects</p>
            <div className="flex items-end justify-between gap-4 mb-10 sm:mb-16">
              <h2 className={`font-mono text-2xl sm:text-3xl md:text-4xl leading-tight ${isDarkMode ? "text-white/90" : "text-black"}`}>
                Projects &amp;<br />Innovation
              </h2>

              {/* Prev / next + counter */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`font-mono text-[13px] sm:text-sm tabular-nums ${isDarkMode ? "text-white/55" : "text-black/60"}`}>
                  {String(activeProject + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                </span>
                {(["prev", "next"] as const).map(dir => (
                  <button
                    key={dir}
                    onClick={() => (dir === "prev" ? swiperRef.current?.slidePrev() : swiperRef.current?.slideNext())}
                    aria-label={dir === "prev" ? "Previous project" : "Next project"}
                    className={`w-9 h-9 flex items-center justify-center border transition-colors ${
                      isDarkMode
                        ? "border-white/30 text-white/70 hover:border-white/60 hover:text-white"
                        : "border-black/30 text-black/65 hover:border-black/70 hover:text-black"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={dir === "prev" ? "" : "rotate-180"}>
                      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(0,8fr)] gap-8 xl:gap-[44px] items-stretch">

            {/* Cabinet — left on extra-large screens, hidden below. Its height equals the card height
                (the bottom offset is the carousel's pagination padding). Hover it to take over the focus. */}
            <div className="hidden xl:block relative" style={hairlineVars(isDarkMode)}>
              <div className="absolute inset-x-0 top-0 bottom-[44px]">
              <Cabinet
                ref={cabinetRef}
                className="absolute top-0 left-[calc(50%+32px)] -translate-x-1/2 h-full -scale-x-90 scale-y-90 origin-center"
                style={{ width: "auto" }}
                theme={isDarkMode ? "dark" : "light"}
                intensity={0.6}
                onRead={t => { cabinetCaption.current = t }}
                onPointerMoveCapture={mirrorPointer}
                onPointerDownCapture={mirrorPointer}
                onPointerEnter={() => { cabinetHovered.current = true }}
                onPointerLeave={e => {
                  cabinetHovered.current = false
                  // wait for the figure to finish its own "leave", then return to the current card's blade
                  window.setTimeout(
                    () => { if (!cabinetHovered.current) focusBlade(bladeForProject(activeProjectRef.current)) },
                    e.pointerType === "mouse" ? 60 : 1500,
                  )
                }}
              />
              </div>
            </div>

            <div className={`project-cards min-w-0 ${isDarkMode ? "text-white/90" : "text-black"}`}>
              <Swiper
                modules={[EffectCreative, Pagination, Autoplay, Keyboard, A11y]}
                effect="creative"
                creativeEffect={{
                  prev: { shadow: true, translate: [0, 0, -400] },
                  next: { translate: ["100%", 0, 0] },
                }}
                grabCursor
                slidesPerView={1}
                spaceBetween={0}
                loop
                keyboard={{ enabled: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                pagination={{ clickable: true }}
                onSwiper={s => { swiperRef.current = s }}
                onRealIndexChange={s => setActiveProject(s.realIndex)}
              >
                {PROJECTS.map((p, i) => (
                  <SwiperSlide key={p.name}>
                    <article
                      className={`h-full border p-5 sm:p-8 flex flex-col gap-6 sm:gap-8 ${
                        isDarkMode ? "bg-[#17171b] border-white/25" : "bg-white border-black/25"
                      }`}
                    >
                      {/* Landscape body: info on the left, highlights on the right */}
                      <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 md:gap-10 flex-1">

                        {/* Left column */}
                        <div className="flex flex-col">
                          <span className={`font-mono text-[13px] sm:text-sm mb-4 ${isDarkMode ? "text-white/55" : "text-black/50"}`}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <h3 className={`font-mono text-xl sm:text-2xl md:text-3xl leading-tight mb-3 ${isDarkMode ? "text-white/90" : "text-black"}`}>
                            {p.name}
                          </h3>
                          <span className={`font-mono text-[13px] border px-2 py-0.5 rounded-sm self-start mb-4 ${
                            isDarkMode ? "border-white/25 text-white/55" : "border-black/30 text-black/60"
                          }`}>{p.tag}</span>
                          <p className={`font-mono text-[13px] tracking-[0.3em] uppercase mb-3 sm:mb-4 ${isDarkMode ? "text-white/55" : "text-black/55"}`}>
                            {p.subtitle}
                          </p>
                          <p className={`font-sans text-sm sm:text-base leading-relaxed ${isDarkMode ? "text-white/70" : "text-black/75"}`}>
                            {p.desc}
                          </p>
                        </div>

                        {/* Right column: bullets */}
                        <ul className="space-y-2 md:self-center">
                          {p.bullets.map((b, j) => (
                            <li key={j} className="flex items-start gap-3">
                              <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDarkMode ? "bg-white/60" : "bg-black/40"}`} />
                              <span className={`font-sans text-sm sm:text-base leading-relaxed ${isDarkMode ? "text-white/70" : "text-black/80"}`}>
                                <span className="font-semibold">{b.bold}</span>
                                {" "}{b.rest}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Footer: stack + links */}
                      <div className={`flex flex-col gap-4 sm:flex-row sm:items-center pt-5 sm:pt-6 border-t ${isDarkMode ? "border-white/15" : "border-black/10"}`}>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-1">
                          {p.stack.map((s, j) => (
                            <span key={j} className={`font-mono text-[13px] px-2 sm:px-2.5 py-1 border rounded-sm ${
                              isDarkMode ? "border-white/20 text-white/55" : "border-black/25 text-black/65"
                            }`}>{s}</span>
                          ))}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <a
                            href={p.github}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center gap-2 font-mono text-[13px] px-3 sm:px-4 py-2 border transition-colors flex-shrink-0 ${
                              isDarkMode
                                ? "border-white/30 text-white/70 hover:border-white/60 hover:text-white"
                                : "border-black/30 text-black/65 hover:border-black/70 hover:text-black"
                            }`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                            GitHub
                          </a>
                          {p.demo && (
                            <a
                              href={p.demo}
                              target="_blank"
                              rel="noreferrer"
                              className={`flex items-center gap-2 font-mono text-[13px] px-3 sm:px-4 py-2 border transition-colors flex-shrink-0 ${
                                isDarkMode
                                  ? "border-white/40 text-white/90 bg-white/8 hover:bg-white/15"
                                  : "border-black/60 text-black bg-black/6 hover:bg-black/12"
                              }`}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                              </svg>
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className={`border-t ${isDarkMode ? "border-white/15" : "border-black/8"}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-14 sm:py-24">
            <p className={`font-mono text-sm tracking-[0.4em] uppercase mb-6 sm:mb-8 ${isDarkMode ? "text-white/55" : "text-black/60"}`}>03 — Skills</p>
            <h2 className={`font-mono text-2xl sm:text-3xl md:text-4xl leading-tight mb-10 sm:mb-16 ${isDarkMode ? "text-white/90" : "text-black"}`}>
              Technical<br />Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              <div>
                <p className={`font-mono text-sm tracking-[0.3em] uppercase mb-4 sm:mb-6 ${isDarkMode ? "text-white/55" : "text-black/60"}`}>Languages &amp; Tools</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {SKILLS.map((s, i) => (
                    <span
                      key={i}
                      className={`font-mono text-[13px] sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 border tracking-wider transition-colors cursor-default ${
                        isDarkMode
                          ? "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                          : "border-black/30 text-black/70 hover:border-black/60 hover:text-black"
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className={`font-mono text-sm tracking-[0.3em] uppercase mb-4 sm:mb-6 ${isDarkMode ? "text-white/55" : "text-black/60"}`}>Currently Exploring</p>
                <div className="space-y-5 sm:space-y-6">
                  {CURRENTLY_EXPLORING.map((item, i) => (
                    <div key={i} className={`border-b pb-5 sm:pb-6 ${isDarkMode ? "border-white/12" : "border-black/15"}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDarkMode ? "bg-white/60" : "bg-black/50"}`} />
                        <div className={`font-mono text-sm sm:text-base ${isDarkMode ? "text-white/90" : "text-black/90"}`}>{item.title}</div>
                      </div>
                      <div className={`font-sans text-sm sm:text-base leading-relaxed pl-4 ${isDarkMode ? "text-white/55" : "text-black/60"}`}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className={`border-t ${isDarkMode ? "border-white/15" : "border-black/8"}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-14 sm:py-24">
            <p className={`font-mono text-sm tracking-[0.4em] uppercase mb-6 sm:mb-8 ${isDarkMode ? "text-white/55" : "text-black/60"}`}>04 — Contact</p>
            <h2 className={`font-mono text-2xl sm:text-3xl md:text-4xl leading-tight mb-10 sm:mb-16 ${isDarkMode ? "text-white/90" : "text-black"}`}>
              Let's Build<br />Something.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              <p className={`font-sans text-base sm:text-lg leading-relaxed ${isDarkMode ? "text-white/70" : "text-black/80"}`}>
                Open to internships, collaborations, and research opportunities.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Email",    val: "aditi.atodaria@gmail.com",      href: "mailto:aditi.atodaria@gmail.com" },
                  { label: "LinkedIn", val: "linkedin.com/in/aditi-atodaria", href: "https://linkedin.com/in/aditi-atodaria" },
                  { label: "GitHub",   val: "github.com/Aditi-Atodaria",      href: "https://github.com/Aditi-Atodaria" },
                ].map((link, i) => (
                  <div key={i} className={`flex flex-col sm:flex-row sm:gap-6 sm:items-baseline gap-1 border-b pb-4 ${isDarkMode ? "border-white/12" : "border-black/15"}`}>
                    <span className={`font-mono text-[13px] sm:text-sm sm:w-16 flex-shrink-0 tracking-wider ${isDarkMode ? "text-white/55" : "text-black/55"}`}>{link.label}</span>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`font-mono text-sm sm:text-base transition-opacity break-all ${isDarkMode ? "text-white/70 hover:text-white" : "text-black/75 hover:text-black"}`}
                    >
                      {link.val}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className={`border-t ${isDarkMode ? "border-white/15" : "border-black/8"}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className={`font-mono text-[13px] tracking-widest uppercase ${isDarkMode ? "text-white/55" : "text-black/50"}`}>
              Aditi Atodaria
            </span>
            <span className={`font-mono text-[13px] ${isDarkMode ? "text-white/55" : "text-black/45"}`}>
              B.Tech CS · Navrachana University
            </span>
          </div>
        </footer>

      </div>
    </div>
  )
}
