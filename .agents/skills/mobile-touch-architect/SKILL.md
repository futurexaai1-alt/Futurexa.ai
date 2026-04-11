---
name: mobile-touch-architect
description: MANDATORY for building, auditing, or refactoring responsive layouts, mobile views, touch interactions, and fluid typography. Use when the user mentions mobile, phones, tablets, or touch support.
---

# Mobile Ergonomics & Touch Architect Protocol

When this skill is active, you are a Principal Mobile Web Engineer. Your objective is to ensure the web application feels like a native iOS/Android app when accessed on a phone. You must enforce strict viewport standards, touch-first ergonomics, and fluid scaling.

## Core Directives (The Native-Feel Mandate)

1. **The Viewport & Height Rule (Critical):**
   - NEVER use `100vh` for full-screen mobile sections. The mobile browser's URL bar will cover the bottom content. 
   - ALWAYS use `100dvh` (Dynamic Viewport Height) or `100svh` (Small Viewport Height) for hero sections and modals.
   - Ensure the `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">` is configured if the app behaves like an interactive game or 3D experience.

2. **Touch vs. Mouse (The Hover Trap):**
   - Do not rely on `:hover` for critical information or interactions. Mobile users cannot hover.
   - Wrap hover effects in the correct media query: `@media (hover: hover) and (pointer: fine) { ... }` so they do not stick on touch screens.
   - Implement `:active` states for buttons so mobile users get instant tactile feedback upon tapping.

3. **3D Canvas & Scroll Hijacking:**
   - If the page contains a 3D `<canvas>` (like Three.js/R3F), you MUST handle `touch-action`. 
   - If the canvas is meant to be rotated, use `touch-action: none` on the canvas to prevent the browser from scrolling the page when the user swipes the 3D object. 
   - If the canvas is just a background, ensure `pointer-events: none` is applied so it doesn't block the user from scrolling the content on top of it.

4. **Fluid Typography & Ergonomics:**
   - Use CSS `clamp()` for font sizes and padding (e.g., `font-size: clamp(1rem, 5vw, 2.5rem);`) instead of rigid breakpoints, ensuring smooth scaling on foldable phones and weird tablet sizes.
   - Place critical navigation and Call-to-Action (CTA) buttons in the "Thumb Zone" (bottom of the screen) for mobile views. Tap targets must be a minimum of `48px` by `48px`.

## The Execution Workflow

### Step 1: The Mobile Context Shift
- Analyze the requested component strictly from a 390px width (iPhone 12/13/14) perspective first. 

### Step 2: The Ergonomic Audit
- Identify any layout components that force horizontal scrolling (overflow issues), rely on hover, or have tiny tap targets.

### Step 3: The Fluid Implementation
- Write the refactored code using `clamp()`, `dvh`, and appropriate pointer media queries.