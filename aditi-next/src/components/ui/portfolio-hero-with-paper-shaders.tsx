"use client"

import { Dithering } from "@paper-design/shaders-react"
import { useState, useEffect, useRef } from "react"

const PROJECTS = [
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
    github: "https://github.com/Aditi-Atodaria/ThreadVerse",
    demo: "https://threadverse-3m5g.onrender.com/login",
  },
  {
    name: "Builders' Files",
    tag: "React Native",
    subtitle: "Property Inventory Management App",
    desc: "A cross-platform mobile app built for building contractors to manage property sites and track unit inventory status across all their projects in one place.",
    bullets: [
      { bold: "Unit status tracking", rest: "— sold, on hold, or on loan — across all property sites" },
      { bold: "Firebase Realtime Database", rest: "for live synchronisation of unit data across devices" },
      { bold: "Drawer + Stack + Tab navigation", rest: "via React Navigation for seamless multi-screen flows" },
      { bold: "Multi-site management", rest: "letting contractors oversee all projects from a single interface" },
    ],
    stack: ["React Native", "Expo", "Firebase", "React Navigation", "JavaScript"],
    github: "https://github.com/Aditi-Atodaria/Builders_Files",
  },
  {
    name: "StockIQ",
    tag: "Full Stack",
    subtitle: "Stock Market Intelligence Platform",
    desc: "A full-stack web platform that reads a stock's current market behaviour and surfaces the trading strategy best suited to that specific condition — not a generic one.",
    bullets: [
      { bold: "Momentum vs. mean-reversion detection", rest: "to classify the stock's current market regime" },
      { bold: "Live news sentiment scoring", rest: "layered on top of technical data for a multi-signal view" },
      { bold: "Technical indicator analysis", rest: "computing RSI, volume, and trend signals from price data" },
      { bold: "Appropriate strategy surfacing", rest: "matched dynamically to the detected market condition" },
      { bold: "Multi-signal stock view", rest: "combining fundamentals, technicals, and sentiment in one dashboard" },
    ],
    stack: ["Python", "Flask", "JavaScript", "HTML/CSS", "News Sentiment API"],
    github: "https://github.com/Aditi-Atodaria/StockIQ",
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

const SKILLS = ["Python", "C", "JavaScript", "React", "React Native", "Three.js", "Jinja2", "HTML/CSS", "Flask", "SQLite", "Firebase", "Groq API", "Expo", "React Navigation", "Git", "Pillow", "Authlib", "Werkzeug"]

const CURRENTLY_EXPLORING = [
  { title: "Mechatronics", desc: "Pursuing a minor, bridging software with mechanical and electrical systems — embedded hardware, sensors, and intelligent machines." },
  { title: "Machine Learning", desc: "Actively learning ML fundamentals — model training, data pipelines, and applying intelligent systems to real engineering problems." },
]

export default function AditiPortfolio() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [openProject, setOpenProject] = useState<number | null>(null)
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

  const scrollDown = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const navLinks = ["About", "Projects", "Skills", "Contact"]

  return (
    <div className={`transition-colors duration-500 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>

      {/* ─────────────────────────────────────────
          NAVBAR  —  fixed, sits above everything
      ───────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? isDarkMode
            ? "bg-black/90 backdrop-blur-md border-b border-white/10"
            : "bg-white/90 backdrop-blur-md border-b border-black/10"
          : isDarkMode ? "bg-black" : "bg-white"
      }`}>
        {/* Bar row */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-5 sm:py-7">
          <span className={`font-mono text-xs tracking-[0.3em] uppercase ${isDarkMode ? "text-white/40" : "text-black/40"}`}>
            Aditi.portfolio
          </span>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-4 md:gap-6">
            {navLinks.map(label => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className={`font-mono text-xs tracking-widest uppercase transition-opacity ${isDarkMode ? "text-white/50 hover:text-white" : "text-black/50 hover:text-black"}`}
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
          <div className={`flex flex-col px-4 pb-4 gap-1 ${isDarkMode ? "bg-black" : "bg-white"}`}>
            {navLinks.map(label => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className={`font-mono text-xs tracking-widest uppercase py-3 border-b transition-opacity ${
                  isDarkMode
                    ? "text-white/60 hover:text-white border-white/8"
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
      <section className={`relative w-full h-screen overflow-hidden ${isDarkMode ? "bg-black" : "bg-white"}`}>

        {/* Centre content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6">

          <p className={`font-mono text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.5em] uppercase mb-3 sm:mb-4 ${isDarkMode ? "text-white/50" : "text-black/50"}`}>
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
                colorBack={isDarkMode ? "hsl(0, 0%, 0%)" : "hsl(0, 0%, 100%)"}
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
                className={`font-mono font-normal leading-tight tracking-tighter ${isDarkMode ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" : "drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]"}`}
                style={{
                  fontSize: "clamp(2rem, 10vw, 6rem)",
                  ...(isDarkMode ? {} : { color: "hsl(216°, 18%, 30%)" }),
                }}
              >
                ADITI<br />ATODARIA
              </h1>
            </div>
          </div>

          <p className={`font-mono text-[10px] sm:text-sm tracking-[0.25em] sm:tracking-[0.35em] uppercase mt-3 sm:mt-4 px-2 leading-relaxed ${isDarkMode ? "text-white/50" : "text-black/50"}`}>
            Full Stack Developer · AI-Assisted Workflows · Mechatronics Minor
          </p>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollDown}
          className={`absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 font-mono text-xs tracking-widest uppercase transition-opacity ${
            scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
          } ${isDarkMode ? "text-white/30 hover:text-white/60" : "text-black/30 hover:text-black/60"}`}
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
        <section id="about" className={`border-t ${isDarkMode ? "border-white/8" : "border-black/8"}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-14 sm:py-24">
            <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 md:gap-16 mb-0">
              <p className={`font-mono text-sm tracking-[0.4em] uppercase mb-6 sm:mb-8 ${isDarkMode ? "text-white/25" : "text-black/60"}`}>01 — About</p>
              <p className={`font-mono text-sm tracking-[0.4em] uppercase mb-6 sm:mb-8 hidden md:block ${isDarkMode ? "text-white/25" : "text-black/60"}`}>Education</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 md:gap-16">
              <div>
                <h2 className={`font-mono text-2xl sm:text-3xl md:text-4xl leading-tight mb-6 sm:mb-8 ${isDarkMode ? "text-white" : "text-black"}`}>
                  Curious.<br />End-to-End.<br />Builder.
                </h2>
                <p className={`font-mono text-sm sm:text-base leading-loose ${isDarkMode ? "text-white/55" : "text-black/80"}`}>
                  I've been coding since the 6th grade, and that curiosity has never stopped. CS undergrad building real products end-to-end — from AI-powered fashion platforms and mobile apps to CLI tools in C. I also leverage AI tools to accelerate development workflows and enhance the efficiency of my engineering process. I want to understand how everything works at every layer of the stack, not just the surface. Outside of software, I actively pursue Mechatronics and have a deep interest in electronics and robotics, where the physical and digital worlds meet.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <p className={`font-mono text-sm tracking-[0.4em] uppercase md:hidden ${isDarkMode ? "text-white/25" : "text-black/60"}`}>Education</p>
                <div className={`border-t ${isDarkMode ? "border-white/8" : "border-black/8"} pt-6 space-y-4`}>
                  <div className="flex flex-wrap justify-between gap-2 font-mono text-sm sm:text-base">
                    <span>Navrachana University</span>
                    <span className={isDarkMode ? "text-white/35" : "text-black/60"}>F.Y. · In Progress</span>
                  </div>
                  <div className={`flex flex-wrap justify-between gap-2 font-mono text-xs sm:text-sm ${isDarkMode ? "text-white/35" : "text-black/65"}`}>
                    <span>CGPA: 8.06</span>
                    <span>B.Tech CSE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className={`border-t ${isDarkMode ? "border-white/8" : "border-black/8"}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-14 sm:py-24">
            <p className={`font-mono text-sm tracking-[0.4em] uppercase mb-6 sm:mb-8 ${isDarkMode ? "text-white/25" : "text-black/60"}`}>02 — Projects</p>
            <h2 className={`font-mono text-2xl sm:text-3xl md:text-4xl leading-tight mb-10 sm:mb-16 ${isDarkMode ? "text-white" : "text-black"}`}>
              Projects &amp;<br />Innovation
            </h2>
            <div className="space-y-0">
              {PROJECTS.map((p, i) => (
                <div key={i} className={`border-t transition-colors ${isDarkMode ? "border-white/8" : "border-black/8"}`}>

                  {/* Clickable row */}
                  <button
                    onClick={() => setOpenProject(openProject === i ? null : i)}
                    className={`w-full text-left grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4 py-5 sm:py-6 transition-colors ${
                      isDarkMode ? "hover:bg-white/2" : "hover:bg-black/2"
                    }`}
                  >
                    <span className={`font-mono text-xs sm:text-sm ${isDarkMode ? "text-white/20" : "text-black/50"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-w-0">
                      <span className={`font-mono text-base sm:text-lg ${isDarkMode ? "text-white" : "text-black"}`}>{p.name}</span>
                      <span className={`font-mono text-xs border px-2 py-0.5 rounded-sm self-start sm:self-auto flex-shrink-0 ${
                        isDarkMode ? "border-white/15 text-white/40" : "border-black/30 text-black/60"
                      }`}>{p.tag}</span>
                    </div>
                    <svg
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                      className={`transition-transform duration-300 flex-shrink-0 ${openProject === i ? "rotate-180" : ""} ${isDarkMode ? "text-white/30" : "text-black/40"}`}
                    >
                      <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Expanded panel */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openProject === i ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    <div className={`ml-0 sm:ml-9 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b ${isDarkMode ? "border-white/8" : "border-black/8"}`}>
                      <p className={`font-mono text-xs tracking-[0.3em] uppercase mb-3 sm:mb-4 ${isDarkMode ? "text-white/35" : "text-black/55"}`}>
                        {p.subtitle}
                      </p>
                      <p className={`font-mono text-xs sm:text-sm leading-loose mb-5 sm:mb-6 ${isDarkMode ? "text-white/60" : "text-black/75"}`}>
                        {p.desc}
                      </p>
                      <ul className="space-y-2 mb-6 sm:mb-8">
                        {p.bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDarkMode ? "bg-white/40" : "bg-black/40"}`} />
                            <span className={`font-mono text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-white/70" : "text-black/80"}`}>
                              <span className="font-semibold">{b.bold}</span>
                              {" "}{b.rest}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-1">
                          {p.stack.map((s, j) => (
                            <span key={j} className={`font-mono text-xs px-2 sm:px-2.5 py-1 border rounded-sm ${
                              isDarkMode ? "border-white/12 text-white/45" : "border-black/25 text-black/65"
                            }`}>{s}</span>
                          ))}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <a
                            href={p.github}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className={`flex items-center gap-2 font-mono text-xs px-3 sm:px-4 py-2 border transition-colors flex-shrink-0 ${
                              isDarkMode
                                ? "border-white/20 text-white/60 hover:border-white/60 hover:text-white"
                                : "border-black/30 text-black/65 hover:border-black/70 hover:text-black"
                            }`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                            GitHub
                          </a>
                          {"demo" in p && p.demo && (
                            <a
                              href={(p as any).demo}
                              target="_blank"
                              rel="noreferrer"
                              onClick={e => e.stopPropagation()}
                              className={`flex items-center gap-2 font-mono text-xs px-3 sm:px-4 py-2 border transition-colors flex-shrink-0 ${
                                isDarkMode
                                  ? "border-white/40 text-white bg-white/8 hover:bg-white/15"
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
                    </div>
                  </div>

                </div>
              ))}
              <div className={`border-t ${isDarkMode ? "border-white/8" : "border-black/8"}`} />
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className={`border-t ${isDarkMode ? "border-white/8" : "border-black/8"}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-14 sm:py-24">
            <p className={`font-mono text-sm tracking-[0.4em] uppercase mb-6 sm:mb-8 ${isDarkMode ? "text-white/25" : "text-black/60"}`}>03 — Skills</p>
            <h2 className={`font-mono text-2xl sm:text-3xl md:text-4xl leading-tight mb-10 sm:mb-16 ${isDarkMode ? "text-white" : "text-black"}`}>
              Technical<br />Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              <div>
                <p className={`font-mono text-sm tracking-[0.3em] uppercase mb-4 sm:mb-6 ${isDarkMode ? "text-white/25" : "text-black/60"}`}>Languages &amp; Tools</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {SKILLS.map((s, i) => (
                    <span
                      key={i}
                      className={`font-mono text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 border tracking-wider transition-colors cursor-default ${
                        isDarkMode
                          ? "border-white/12 text-white/50 hover:border-white/40 hover:text-white"
                          : "border-black/30 text-black/70 hover:border-black/60 hover:text-black"
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className={`font-mono text-sm tracking-[0.3em] uppercase mb-4 sm:mb-6 ${isDarkMode ? "text-white/25" : "text-black/60"}`}>Currently Exploring</p>
                <div className="space-y-5 sm:space-y-6">
                  {CURRENTLY_EXPLORING.map((item, i) => (
                    <div key={i} className={`border-b pb-5 sm:pb-6 ${isDarkMode ? "border-white/6" : "border-black/15"}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDarkMode ? "bg-white/50" : "bg-black/50"}`} />
                        <div className={`font-mono text-sm sm:text-base ${isDarkMode ? "text-white/80" : "text-black/90"}`}>{item.title}</div>
                      </div>
                      <div className={`font-mono text-xs sm:text-sm leading-relaxed pl-4 ${isDarkMode ? "text-white/35" : "text-black/60"}`}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className={`border-t ${isDarkMode ? "border-white/8" : "border-black/8"}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-14 sm:py-24">
            <p className={`font-mono text-sm tracking-[0.4em] uppercase mb-6 sm:mb-8 ${isDarkMode ? "text-white/25" : "text-black/60"}`}>04 — Contact</p>
            <h2 className={`font-mono text-2xl sm:text-3xl md:text-4xl leading-tight mb-10 sm:mb-16 ${isDarkMode ? "text-white" : "text-black"}`}>
              Let's Build<br />Something.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              <p className={`font-mono text-sm sm:text-base leading-loose ${isDarkMode ? "text-white/50" : "text-black/80"}`}>
                Open to internships, collaborations, and research opportunities.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Email",    val: "aditi.atodaria@gmail.com",      href: "mailto:aditi.atodaria@gmail.com" },
                  { label: "LinkedIn", val: "linkedin.com/in/aditi-atodaria", href: "https://linkedin.com/in/aditi-atodaria" },
                  { label: "GitHub",   val: "github.com/Aditi-Atodaria",      href: "https://github.com/Aditi-Atodaria" },
                ].map((link, i) => (
                  <div key={i} className={`flex flex-col sm:flex-row sm:gap-6 sm:items-baseline gap-1 border-b pb-4 ${isDarkMode ? "border-white/6" : "border-black/15"}`}>
                    <span className={`font-mono text-xs sm:text-sm sm:w-16 flex-shrink-0 tracking-wider ${isDarkMode ? "text-white/25" : "text-black/55"}`}>{link.label}</span>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`font-mono text-sm sm:text-base transition-opacity break-all ${isDarkMode ? "text-white/60 hover:text-white" : "text-black/75 hover:text-black"}`}
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
        <footer className={`border-t ${isDarkMode ? "border-white/8" : "border-black/8"}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className={`font-mono text-xs tracking-widest uppercase ${isDarkMode ? "text-white/20" : "text-black/50"}`}>
              Aditi Atodaria
            </span>
            <span className={`font-mono text-xs ${isDarkMode ? "text-white/15" : "text-black/45"}`}>
              B.Tech CS · Navrachana University
            </span>
          </div>
        </footer>

      </div>
    </div>
  )
}
