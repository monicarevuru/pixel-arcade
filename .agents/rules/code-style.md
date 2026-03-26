---
trigger: always_on
---

# Code Style Rules

## Component Rules
- One component per file, filename matches component name
- All components are functional (no class components)
- Default export for every component file
- Named exports for hooks and utilities
- Props must have default values where applicable

## Naming Conventions
- Components: PascalCase → `GameCard.jsx`
- Hooks: camelCase prefixed with `use` → `useGameLoop.js`
- Utils: camelCase → `audioEngine.js`
- CSS Modules: camelCase → `styles.title`
- Constants: UPPER_SNAKE_CASE → `COLORS.PASTEL_PINK`
- Event handlers: prefixed with `handle` → `handleKeyPress`
- Boolean variables: prefixed with `is/has/can` → `isPlaying`, `hasStarted`

## File Structure Per Component
```
ComponentName/
  index.jsx        ← component code
  styles.module.css ← scoped styles
```

## Hooks Rules
- All game loop logic lives in `useGameLoop.js`
- All audio logic lives in `useAudio.js`
- Hooks must clean up on unmount (clearInterval, cancelAnimationFrame, AudioContext.close)
- Never call a hook conditionally

## State Management
- `useState` for UI state (current screen, scores, mode)
- `useRef` for canvas refs and values that shouldn't trigger re-renders (game objects, animation frame IDs)
- `useReducer` for complex game state (Memory Mode sequence, game phase)
- Never store game loop variables in useState — always useRef

## Code Quality
- No unused imports or variables
- No console.log in production code (use comments instead)
- Every function must have a single clear responsibility
- Prefer descriptive variable names over comments
- Max function length: 40 lines — extract if longer
- Always handle cleanup in useEffect return function

## Import Order
1. React imports
2. Hook imports
3. Component imports
4. Util/constant imports
5. Style imports
