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

### Step 4 — Deploy to Netlify
```bash
# Install Netlify CLI if not present
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```
Copy the live URL from the output.


### Step 5 — Post-deploy
- [ ] Visit live URL and test all games
- [ ] Test on mobile browser
- [ ] Copy live URL for LinkedIn post

```