# Aditi Atodaria — Portfolio

Built with **Next.js 16 + TypeScript + Tailwind CSS + @paper-design/shaders-react**

## Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Shader:** `@paper-design/shaders-react` — Dithering component (warp shape)
- **Structure:** shadcn-compatible (`/src/components/ui/`)

## Project Structure
```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── components/
    └── ui/
        └── portfolio-hero-with-paper-shaders.tsx  ← main component
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features
- Split-screen layout: left panel (content) + right panel (animated shader)
- Dark / light mode toggle (top-right of left panel)
- 4 navigable sections: Home · Projects · Skills · Contact
- Animated `Dithering` shader synced to theme colour
- Fully responsive typography and layout

## Adding shadcn Components (optional)
If the shadcn registry becomes accessible, run:
```bash
npx shadcn@latest init
```
The `components/ui` folder is already in place — shadcn will drop components directly into it.
