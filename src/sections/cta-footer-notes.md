# CTA & Footer Section Design Documentation

This document captures the design thinking process, layout specs, and animation mechanics implemented for the final Call-to-Action (CTA) and Footer section of the **Synergy Transformations** premium scrollytelling experience.

---

## 1. Design Thinking Process

### Phase 1: Empathize (The User Journey)
* **Emotional State**: Having scrolled through the hero, video reveal, philosophy, pillars, and journey steps, the user is fully primed. They understand the Synergy system's core tenet: *Transformation is not motivation; it is structure and discipline*. They are standing at the threshold of choice.
* **The Goal**: Transition them from passive readers to active participants. The friction of booking must be virtually zero.
* **Psychological Triggers**:
  1. **Social Proof / Credibility**: Large, undeniable stats (`500+ Lives Transformed`, `98% Follow-Through`) validate that this program works.
  2. **Anxiety Reduction**: The micro-copy `Free orientation call · No commitment` reassures the user that clicking the button will not trap them in a high-pressure sales pitch.
  3. **High-Value CTA**: Direct WhatsApp link sending the trigger letter `"T"` to instantly initiate a scheduling flow. No complex forms.

### Phase 2: Define (The Problems to Solve)
* **Visual Hierarchy**: The primary conversion action (WhatsApp Button) must be the absolute brightest, most visually magnetic element on the entire page.
* **Centering & Layout**: Clean, structural vertical and horizontal centering that doesn't feel cramped.
* **Glow Integrity**: Adding a refined gold breathing aura that doesn't feel cheap or noisy. It must feel high-end, slow, and cinematic.
* **Mobile Comfort**: Ensure stats scale correctly, layout shifts from side-by-side to vertical stack on smaller devices, and the button provides a large touch target (minimum 48px high, ideally 54px on mobile).
* **Section Transition**: The CTA section (`#sec-cta`) acts as a `.stack-card`. As the user finishes the horizontal scroll track, this section must slide up and smoothly overlap the horizontal section, providing a dramatic reveal.

### Phase 3: Ideate & Solutions
* **Background**: A deep, dark `#0a0a0a` background enhanced with a multi-layered radial gradient that projects a golden glow orb centered behind the main typography.
* **Button Glow**: An absolute pseudo-glow element (`.cta-btn__glow`) behind the button that utilizes a keyframe scale and blur animation to create a gentle, slow breathing pulse.
* **Split Title**: Wrapping text lines in mask containers (`overflow: hidden`) so characters or words can rise from the bottom, creating a liquid typography feel.
* **Architectural Separator**: A sharp, fading vertical line between stats on desktop, shifting to a horizontal centered divider on mobile to emphasize structure.

### Phase 4: Prototype (Implementation)
The code has been split into three modular, non-disruptive files:
1. `src/sections/cta-footer.css`: The layout, typography, animations, and responsive partial stylesheet.
2. `src/sections/cta-footer.html`: The recommended HTML structure changes to replace lines 147-180 of `index.html`.
3. `src/sections/cta-footer.js`: The GSAP animations documentation for seamless scrollytelling entry integration.

---

## 2. Desktop vs. Mobile Layouts

### Desktop (1440px)
* **Height**: 100vh screen capture. Content is centered using Flexbox.
* **Stats Row**: Centered, separated by a thin, fading vertical gradient line. Numbers are set to `5.5rem` display Syne font.
* **Title**: Spans up to `5.2rem` and spreads across a wide container with line mask wrappers.
* **Footer**: Placed at the absolute bottom of the viewport using `position: absolute; bottom: 2.5rem;` to act as a signature frame.

### Mobile (375px)
* **Height**: Transitioned to `min-height: auto;` or `height: auto;` with generous top/bottom paddings to prevent vertical overflow clipping on short device screens.
* **Stats Row**: Stacks vertically on screens below 480px. A small horizontal line (`60px` wide) divides the elements.
* **Button**: Scales to 90% of screen width (`max-width: 380px`) to ensure an easy tap target for thumbs.
* **Footer**: Shifted to standard document flow (`position: relative;`) at the end of the content with a top border separator to prevent overlap.

---

## 3. Section Blending & Transitions

* **Entering the Section**: 
  The CTA section uses `z-index: 20` and `background: var(--bg-elevated)`. It behaves as a `.stack-card` sliding up over the horizontal track.
  To make this transition smooth, we added:
  1. `box-shadow: 0 -30px 100px rgba(0, 0, 0, 0.85);` — creating a soft drop shadow on the incoming card to give depth and separation.
  2. `border-top: 1px solid var(--glass-border);` — a thin gold-glowing top border line that catches the user's eye as the section starts to slide up.
* **Exiting/Bottom-out**:
  As the last card in the layout, the bottom of the section finishes the Lenis scroll tracking. The footer signature anchors the final pixels, cleanly ending the user journey.

---

## 4. Animation Breakdown

| Element | Animation Type | Easing / Settings | Purpose |
| :--- | :--- | :--- | :--- |
| `.cta-glow-orb` | Background Breathing | `10s infinite ease-in-out` | Adds subtle motion in the background space to make the dark area feel active. |
| `.cta-btn__glow` | Button Halo Pulse | `3s infinite ease-in-out` | Draws high visual focus to the primary conversion point. |
| `.stat-item` | Staggered Fade Up | `power3.out` (GSAP ScrollTrigger) | Adds structure and credibility as the card slides into viewport focus. |
| `.cta-line-inner` | Masked Slide Up | `power4.out` (GSAP ScrollTrigger) | Premium, cinematic typographic reveal where letters slide out from a container mask. |
| `.cta-btn` | Swipe Shine + Lift | `0.75s ease` / `power3.out` (CSS + GSAP) | Tactile feedback when the mouse hovers over the button. |
