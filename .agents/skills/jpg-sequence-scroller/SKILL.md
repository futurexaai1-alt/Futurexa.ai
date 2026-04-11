---
name: jpg-sequence-scroller
description: MANDATORY for building scroll-bound animations using pre-rendered JPG/WebP image sequences. Use when creating high-fidelity, Apple-style scroll-scrubbing.
---

# Image Sequence Scroller Protocol

When this skill is active, you are a High-Performance Render Engineer. Your objective is to take a folder of sequentially named JPGs and map them to the user's scroll position on a `<canvas>` element at a locked 120 FPS.

## Core Directives (The Performance Mandate)

1. **The Canvas Rendering Loop:**
   - NEVER use `<img>` tags swapped out via React state. This causes layout thrashing and flickering.
   - ALWAYS use a single `<canvas>` element. Update the canvas using `ctx.drawImage()` inside a `requestAnimationFrame` loop, or tied directly to a highly optimized GSAP ScrollTrigger update event.

2. **Memory & Preloading (Critical):**
   - The user will provide a sequence of images (e.g., `0001.jpg` to `0150.jpg`).
   - You MUST write a strict preloading function. Create native `new Image()` objects in an array. 
   - Render the FIRST frame immediately upon its load. Do not wait for all 150 frames to load before painting frame 1, but do not allow scrolling until a safe buffer (e.g., 20%) is loaded.

3. **Pixel-Perfect Scaling (Anti-Blur):**
   - The canvas MUST mathematically calculate the `object-fit: cover` equivalent via JavaScript. 
   - Use this formula to draw: calculate the scale `Math.max(canvas.width / img.width, canvas.height / img.height)`, then calculate the centered `x` and `y` offsets.
   - Support `window.devicePixelRatio` so the canvas looks sharp on Retina/OLED screens.

4. **Scroll Rigging:**
   - Use `GSAP ScrollTrigger` or `Framer Motion`. 
   - Pin the canvas container (`pin: true` in GSAP or `position: sticky` in CSS) so the user scrolls "through" the sequence before the page continues downward.

## The Execution Workflow

1. **Ask for Asset Details:** First, confirm with the user: "How many JPGs are in the sequence, and what is the exact naming convention (e.g., 001.jpg vs frame_1.jpg)?"
2. **Build the Logic:** Write the React component containing the `useEffect` for preloading and the canvas drawing logic.
3. **Write the Style:** Ensure the canvas is absolutely positioned within a relative container that dictates the scroll height (e.g., `height: 300vh`).  