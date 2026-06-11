# Design & Implementation Notes — Hero Section & Navigation
**Brand Identity:** Premium Transformation Coaching (Cinematic, Serious, Authoritative)
**Assets Created:**
- `src/sections/hero-nav.css` (Styles)
- `src/sections/hero-nav.html` (Markup reference)
- `src/sections/hero-nav.js` (GSAP animation reference)

---

## 1. Design Thinking Process

### Phase 1: Empathize (The Visitor's Journey)
A prospective client lands on Synergy Transformations. They are high-performers (founders, executives, elite athletes) seeking order and discipline.
- **Mental State:** Busy, skeptical, looking for high-status leadership. They reject cheap "fitness motivation" and want a bespoke, serious system.
- **Visual Expectation:** Clean layouts, cinematic atmosphere, high-end styling (similar to high-fashion or luxury automobile sites).
- **Mobile First:** Over 85% of traffic comes from mobile screens (Instagram bio links, WhatsApp, etc.). The layout must look balanced and fit perfectly without truncation when scrolling with the thumb.

### Phase 2: Define (Current Problems Identified)
- **Vertically Uncentered Title:** The previous hero title had `padding-top` to push it past the nav, making it off-center relative to the viewport.
- **Title Truncation on Mobile:** The word "Transformations" has 15 characters. At common responsive scales, it wraps awkwardly or bleeds off a standard 375px viewport (like an iPhone SE or 13 Mini).
- **Abrupt Transition to Video Section:** The scroll transition between the hero and video section felt dry, lacking the cohesion that makes high-end storytelling sites stand out.
- **Inline Styling Jank:** The navigation bar updated styles directly via JS inline attributes on scroll, which can lead to layout shifts, override rules, and rendering jank.

### Phase 3: Ideate & Implement (The Solutions)
1. **Perfect Viewport Centering:**
   - Removed `padding-top` from `.hero__container`. Centered it absolutely inside `.hero` (`100dvh`).
   - Slightly offset the container by `translateY(-20px)` to balance the visual weight of the top nav, ensuring the vertical center is optically aligned.
2. **Branded Micro-details & Luxury Matte Texture:**
   - Added a global `body::after` pseudo-element with a repeating fractal SVG noise pattern at `z-index: 9999`. This overlays a subtle cinematic film-grain across the whole page, unifying all sections and eliminating color banding.
   - Designed a custom hovering diamond spin on the kicker (`.kicker::before`, `.kicker::after`) that rotates as the user hovers over the hero.
3. **Optimized Typography & 3-Second Rule:**
   - Added a low-contrast, highly readable subtitle below the title to convey what the Synergy Program is immediately.
   - Refined the fluid `clamp()` formula for `.hero__title` to `clamp(2.2rem, 7.5vw, 6.2rem)` and added custom media queries for `375px` screens to lock the size at `2.15rem`, guaranteeing "Transformations" never clips or breaks.
4. **Cinematic Scroll Cue:**
   - Replaced the generic bouncing SVG arrow with a delicate 1px vertical line indicator.
   - Structured an animated keyframe loop (`scroll-line-glow`) that sends a glowing gold pulse down the line, establishing a sophisticated visual path.
5. **Class-based Sticky Navigation:**
   - Converted inline JS styles to CSS classes. Now, scrolling past 50px toggles `.nav--scrolled`.
   - The scroll state triggers a height shrink (from `80px` to `70px`), dark glass background (`rgba(5, 5, 5, 0.7)`), and active backdrop-blur (`30px`), offering a fluid tactile feel.
   - The Nav CTA shifts from a subtle bordered ghost state (unobtrusive over the hero) to a solid glowing gold gradient on hover.

---

## 2. The Hero → Video Reveal Transition Blend

A major highlight of this redesign is the **"Cinema Lights Out"** transition blend:
- **Atmospheric Glow Layer (`.hero__glow`):** The hero features a radial gradient of gold light (`hsla(38, 75%, 55%, 0.1)`) centered behind the text.
- **Scroll-Triggered Dispersion:** On scroll, the container fades/scales to `0.92`, while the background glow fades to `0` opacity and scales to `1.2`. 
- **The Visual Effect:** As the user scrolls, the background light dissolves, simulating the lights going down in a theater. This leaves the screen perfectly black (`#050505`) just as the sticky video section (`#sec-video`) enters the screen, creating a high-contrast transition for the text overlays ("The", "Reality") and the expanding video window.

---

## 3. Screen Comparisons: Desktop vs Mobile

| Element | Desktop (1440px) | Mobile (375px) |
| :--- | :--- | :--- |
| **Navigation Height** | `80px` (shrinks to `70px` on scroll) | `60px` (keeps layout compact) |
| **Navigation CTA** | Ghost button (translucent); glows solid gold on hover | Compact, high contrast |
| **Hero Title Size** | Dynamic `clamp` up to `6.2rem` (large and imposing) | Locked at `2.15rem` (zero word wrapping/clipping) |
| **Hero Spacing** | Open, wide breathing room | Tightened gaps, subtitle max-width at 100% |
| **Scroll Cue** | Extended `48px` line at the very bottom | Shortened `40px` line to accommodate smaller screens |
| **Matte Grain** | Smooth, high resolution density | Balanced opacity (`0.02`) to prevent screen noise pixelation |
