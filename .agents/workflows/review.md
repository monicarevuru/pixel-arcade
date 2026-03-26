---
description: Run before every commit to ensure code meets all project rules.
---

# Workflow: Code Review

## Trigger
Run before every commit to ensure code meets all project rules.
Command: `/workflow:review`

## Steps

### Step 1 — Check code-style.md rules
Review every `.jsx` and `.js` file in `src/` and verify:
- [ ] All components are functional (no class components)
- [ ] One component per file, filename matches component name
- [ ] All hooks start with `use`
- [ ] Event handlers start with `handle`
- [ ] Boolean variables start with `is`, `has`, or `can`
- [ ] No unused imports or variables
- [ ] No `console.log` statements
- [ ] `useEffect` returns cleanup function where applicable
- [ ] No function longer than 40 lines

### Step 2 — Check design-system.md rules
- [ ] No hardcoded hex color values — all colors imported from `utils/colors.js`
- [ ] No hardcoded font names — font applied via CSS variable `--font-pixel`
- [ ] All spacing is multiple of 8px
- [ ] No `border-radius` greater than 2px
- [ ] Canvas elements have `imageRendering: pixelated`
- [ ] Dark background (`BG_PRIMARY`) used consistently

### Step 3 — Check game-patterns.md rules
- [ ] No raw `requestAnimationFrame` calls — always `useGameLoop`
- [ ] Game loop variables stored in `useRef` not `useState`
- [ ] Canvas has `ctx.imageSmoothingEnabled = false`
- [ ] Delta time is capped: `Math.min(dt, 50)`
- [ ] Collision uses AABB pattern
- [ ] Keyboard listeners added/removed via `useEffect`

### Step 4 — Check Agent.md Do NOTs
- [ ] No game libraries installed (Phaser, PixiJS etc.)
- [ ] No `localStorage` or `sessionStorage`
- [ ] No inline styles on wrapper divs — CSS variables or CSS Modules only (background image divs are an exception: apply `backgroundImage` inline on the dedicated bg child div only)
- [ ] No audio files — all sound is Web Audio API
- [ ] No React Router — state-based routing only
- [ ] No new npm packages added
- [ ] Static image assets exist in `src/assets/` (not inline base64 or external URLs)

### Step 5 — Report
Output a summary:
```
✅ PASSED checks: [list]
⚠️  WARNINGS: [list] (non-blocking)
❌ FAILED checks: [list] (must fix before commit)
```
Fix all ❌ items before proceeding to commit.
