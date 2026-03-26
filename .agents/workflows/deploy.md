---
description: Build & Deploy
---

# Workflow: Build & Deploy

## Trigger
Use when ready to ship to production.
Command: `/workflow:deploy`

## Pre-deploy Checklist
Run `/workflow:review` first. All ❌ checks must be resolved before deploying.

## Steps

### Step 1 — Final checks
```bash
# Check for any TypeErrors or lint issues
npm run build
```
If build fails, fix errors and re-run before continuing.

### Step 2 — Test production build locally
```bash
npm run preview
```
Manually verify:
- [ ] Main menu loads correctly
- [ ] Both games launch from menu
- [ ] Back button returns to menu
- [ ] Sound plays on interaction
- [ ] No console errors
- [ ] Canvas renders pixel-perfect (no blurry sprites)

### Step 3 — Git commit
```bash
git add .
git commit -m "feat: pixel arcade — production build"
```
Use conventional commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `style:` for visual/CSS changes
- `refactor:` for code restructuring
- `docs:` for documentation changes

### Step 4A — Deploy to Netlify (recommended)
```bash
# Install Netlify CLI if not present
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```
Copy the live URL from the output.

### Step 4B — Deploy to Vercel (alternative)
```bash
# Install Vercel CLI if not present
npm install -g vercel

# Deploy
vercel --prod
```

### Step 4C — Deploy to GitHub Pages
Add to `vite.config.js`:
```js
export default defineConfig({
  base: '/pixel-arcade/', // your repo name
  plugins: [react()],
})
```
Then:
```bash
npm run build
# Push dist/ to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

### Step 5 — Post-deploy
- [ ] Visit live URL and test all games
- [ ] Test on mobile browser
- [ ] Copy live URL for LinkedIn post

## LinkedIn Post Template
```
🎮 Built Pixel Arcade — a retro mini-game collection!

✨ Two games: Zen Keys (piano memory game) + Asteroid Dodger
🤖 Built using agentic AI with Antigravity IDE
⚡ Zero dependencies — React + Canvas API + Web Audio API only
🎨 8-bit pixel art, soft pastels, pure dark mode

[Live link here]

#buildinpublic #AI #WebDev #React #AgenticAI #Antigravity
```
