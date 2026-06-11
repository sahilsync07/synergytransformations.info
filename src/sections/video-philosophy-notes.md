# Cinematic Scrollytelling Design Notes: Video Reveal & Philosophy Quote

This document outlines the Design Thinking process, aesthetic decisions, responsive adaptations, and transition details for the **Video Reveal** and **Philosophy Quote** sections of the *Synergy Transformations* landing page.

---

## 1. Empathize: The User's Emotional Journey

At this stage in the scroll, the user has just interacted with the Hero section (`Transformations That Matter`). They are intrigued, but still in a passive, scanning mindset.

```
Graph:
Hero [1. Hero Section: Hook]
  ↓ (Scrolled 100vh)
Transition [Transition: Anticipation]
  ↓ (Text Parts Outward)
SlitReveal [2. Video Slit: Peek Preview]
  ↓ (Window Expands Full-Screen)
Cinema [3. Full-Screen Video: Immersive Vibe]
  ↓ (Interactive State Toggle)
Playback [4. User Can Click / Engage]
  ↓ (Card Slides Up Over Video)
Philosophy [5. Philosophy Quote: Core Values]
```

### Key Emotional Goals:
*   **Anticipation (Scroll Cue & Slit):** The text parting away acts like a theatrical curtain opening. It signals to the user that they are entering a deep, curated experience, not a generic template.
*   **Awe (Expanding Screen):** The smooth expansion of a letterbox slit into a full-bleed cinematic video provides a moment of visual delight.
*   **Authority (Philosophy Quote):** Sliding a massive, high-contrast, perfectly-centered card up *over* the video brings focus back to the core message: *"Transformation is not motivation. It is structure, discipline, and follow-through."*

---

## 2. Define: Problems & Solutions

During development, we identified and resolved several design and performance bottlenecks:

| Problem | Solution | Rationale |
| :--- | :--- | :--- |
| **Scroll Height Fatigue** | Set desktop height to `300vh` and mobile height to `200vh`. | Gives enough track length for the GSAP scrub to feel gradual and premium on desktop, while preventing endless scrolling on touch devices. |
| **Video Slit Visibility** | Pre-filter video with `grayscale(100%) brightness(0.4)`. | Increases readability of the white overlay text ("The Reality") while the slit is small, preventing text from washing out. |
| **SplitType Accent Gradient Bug** | Clear parent `.accent` background and apply gradient purely to `.word`/`.char` inline-blocks via `:has()`. | Inline-block split words fail to inherit parent text-clip gradients in Chrome & Safari. This selector guarantees 100% text visibility and proper gradient flow. |
| **Frame / Border Clipping** | Apply `inset: 1px` and match border-radius to `15px` for the frame overlay. | Standard clip-path would slice off the border of a 100% wide overlay. Shifting it 1px inward ensures the gold boundary is razor-sharp. |
| **Janky Mouse Interaction** | Toggle `.video-reveal--interactive` via `ScrollTrigger.onUpdate`. | If mouse events are always active on the iframe, the user cannot scroll when their cursor is over the video. Enabling them only at >95% progress solves this. |

---

## 3. Ideate & Implement: Premium Cinematic Details

We introduced several visual micro-interactions that elevate the experience:

### A. The Glowing Gold Slit Frame
Instead of a simple clipped video, we added a `.video-reveal__frame` element nested in the window.
*   It starts as a **2px gold frame** with a soft outer glow (`box-shadow: 0 0 35px rgba(212, 164, 74, 0.3)`).
*   As the scroll proceeds, its border-radius shrinks from `15px` to `0px` to match the screen edges.
*   It slowly fades out to `opacity: 0` just as the video takes over, letting the video bleed off the screen seamlessly.

### B. The Horizon Separation Line
The transition from the Video Reveal to the Philosophy section uses a CSS pseudo-element (`.philosophy::before`).
*   It creates a **fading horizontal gradient** separating the two cards.
*   Instead of a harsh dividing line, it looks like a glowing golden sunset line on the horizon, blending the black backdrops together.

### C. Multi-Layered Elevational Shadows
To make the stacking card effect look physically real:
*   The philosophy section features a massive double-layered box-shadow (`0 -30px 100px rgba(0, 0, 0, 0.95), 0 -10px 40px rgba(212, 164, 74, 0.03)`).
*   As it slides up over the video, it casts a physical shadow, creating depth and separating the video layer from the editorial quote layer.

---

## 4. Blending & Transitions (Adjacent Sections)

1.  **From Hero to Video Reveal:**
    *   The hero features a scroll-driven scale-down and fade-out: `hero__container` scales to `0.9` and moves up by `100px`.
    *   This reveals the `#sec-video` backdrop underneath, which starts pitch-black.
2.  **From Video Reveal to Philosophy:**
    *   As the scroll finishes, the sticky container is pinned.
    *   The Philosophy section (`#sec-philosophy`) slides up from the bottom of the page, moving *over* the sticky video window.
    *   This provides a smooth transition where the video remains partially visible in the upper background until it is fully covered by the philosophy card's dark, gold-tinted radial gradient.

---

## 5. Responsive Design (Desktop vs Mobile)

Our design is fully optimized for both desktop (1440px) and mobile (375px) breakpoints:

### Desktop (1440px)
*   **Heights:** `300vh` scroll track for full cinematic exposure.
*   **Video Slit:** Elegant letterbox shape: `inset(45% 20% 45% 20% round 16px)`.
*   **Mega-Quote Typography:** Massive display font: `font-size: clamp(2rem, 5.2vw, 4.4rem)`.

### Mobile (375px)
*   **Heights:** Reduced scroll track to `200vh` to optimize touch interactions.
*   **Video Slit:** Adjusted aspect ratio to fit vertical viewports: `inset(38% 5% 38% 5% round 12px)`. This preserves a widescreen cinematic slit on mobile portrait layouts.
*   **Interactive Playback:** Frame border-radius is reduced (`11px`), and text scales down nicely.
*   **Mega-Quote Typography:** Scaled down to `clamp(1.4rem, 6vw, 1.95rem)` with increased line height (`1.35`) for legibility.

---

## 6. Testing & Quality Assurance

Use the following checkpoints to test the implementation:

### Testing Checklist
- [ ] **Check Hero Transition:** Ensure scroll is buttery-smooth, and Hero content fades out completely before the video text overlay starts parting.
- [ ] **Check Text Parting:** Confirm `#vr-word-top` moves up and `#vr-word-bottom` moves down cleanly with no layout shifting.
- [ ] **Check Video Expansion:** Verify the video window expands from the center and has a gold border that shrinks and disappears at full screen.
- [ ] **Check Pointer-Events Toggle:** Scroll to 100% expansion and verify you can hover/click the video controls. Scroll back up slightly and verify that the page scrolls instead of the iframe capturing mouse events.
- [ ] **Check Accent Words:** Confirm that *"It is structure, discipline, and follow-through"* has the gold gradient on all words and is fully visible.
- [ ] **Verify Stacking Shadow:** Confirm the philosophy card overlays the video with a visible dark shadow and glowing gold top line.
- [ ] **Mobile Breakpoint:** Test on a mobile emulator (375px wide). Verify the video window slit fits within the phone screen margins.
