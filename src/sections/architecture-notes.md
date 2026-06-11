# Synergy Transformations — Architecture & Journey Section Design Notes

This document details the design thinking process, styling rules, and animation systems established for the **Horizontal Scroll Section** (Architecture Pillars + Journey Steps) of the Synergy Transformations coaching platform.

---

## 1. Empathize (The User Experience)
The user arrives at this section after viewing the high-emotion transformation video and digesting the core philosophy ("Transformation is not motivation. It is structure, discipline, and follow-through."). 
- **The psychological state**: Inspired, but skeptical. They are asking: *"What exactly is this program? How does it work? Is it another chaotic course, or a rigorous system?"*
- **Design response**: The horizontal scroll section is designed to feel highly organized, structured, and premium. The smooth horizontal movement creates a cinematic gallery feel, which slows down the user's scanning speed and forces them to focus on one pillar and one phase at a time.
- **Micro-interactions**: Glass cards feel tactile and reactive. When hovered, they scale up slightly and light up with a subtle gold glow, prompting the user to explore.

---

## 2. Define (Technical & Design Constraints)
We identified and resolved several critical challenges in the existing layout:
1. **Scrolling Conflict**: The horizontal scroll is driven by GSAP pinning. The CSS must *not* force height constraints or position sticky on the section container itself (GSAP injects wrappers and styles during execution).
2. **Text Wraps & Overflow**: Long words like "Architecture" in the titles need generous inline width. The intro panels are clamped to ideal minimums (`320px` to `420px`) to avoid tight, ugly wraps.
3. **Card Alignment**: Because `align-items: stretch` is defined on the horizontal track, all panels are stretched to maximum height (60vh). We redesigned `.glass-card` to use `display: flex; flex-direction: column; justify-content: flex-end;` so that content anchors beautifully to the bottom, while the giant number sits proudly in the top right.
4. **Timeline Visuals**: Previously, the step timeline was a series of disconnected markers. We created a continuous connector line that spans across the gap between panels. On mobile, this transforms into a vertical timeline.
5. **Goal-Oriented Glow**: The final step ("Execution") features a permanent pulsing gold glow on its marker, signaling that this is the ultimate destination.

---

## 3. Styling & Ideation (src/sections/architecture.css)

### Premium Atmosphere
- **Ambient Lighting**: We introduced two large, extremely soft radial gradients behind the section content (`#sec-horizontal::before` and `::after`). These act as gold "nebulae" that hover behind the glass cards, adding three-dimensional depth to the page.
- **Glassmorphism**: Built using high-end frosted specs:
  ```css
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(30px);
  ```
- **Outline Numbers**: The card number `01`, `02`, `03` is styled with a transparent fill and a thin gold outline. This structural typography gives a technical, architectural draft look.

### Horizontal Timeline Connectors (Desktop)
We designed the timeline connector using a pseudo-element on the step panel:
```css
.h-panel--step:not(:last-child)::before {
  content: '';
  position: absolute;
  top: 2rem;
  left: 16px;
  width: calc(100% + clamp(3rem, 5vw, 6rem) - 16px);
  height: 2px;
  background: linear-gradient(90deg, rgba(212, 164, 74, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%);
}
```
This formula dynamically calculates the width needed to bridge the flexible track gap (`clamp(3rem, 5vw, 6rem)`) and connects step markers flawlessly across different screen sizes.

### Mobile Vertical Stack (Mobile Viewport)
On screens ≤ 768px, horizontal scroll triggers are deactivated. The layout converts to a vertical stack.
- Instead of hiding the timeline, we re-oriented it into a vertical line (`::after` on step panels) running down the left side, linking step markers.
- Step details are padded left (`2.75rem`) to align cleanly beside the vertical timeline.
- Glass cards scale to `height: auto` and `min-height: 220px` to maintain comfortable readability.

---

## 4. Cinematic Animations (src/sections/architecture.js)
GSAP animations are structured to build upon the horizontal scroll trigger:
- **3D Card Tilts**: Cards rotate slightly on their Y-axis (`rotationY: 15` to `0`) and scale up as they scroll into view.
- **Step Marker Activation**: Step markers scale up from `0.75` to `1.15` and transition their borders to gold as they scroll into focus.
- **Mobile Fallbacks**: A scroll trigger matches card reveals on mobile using vertical scroll markers, ensuring mobile users get a premium entrance animation too.

---

## 5. Transition Blending (Previous & Next Sections)
- **Entering from Philosophy**: The previous section `#sec-philosophy` is a stacking card (`#0a0a0a`) with a strong top border and dropshadow. As the user scrolls past it, `#sec-philosophy` moves out, revealing the deeper `#050505` background of the horizontal scroll section.
- **Exiting to CTA**: The final "Execution" step has an active glow and hover outline. Because this card represents action, it visually guides the user's attention right before they transition to the CTA section (`#sec-cta`), which slides up over the horizontal track.
