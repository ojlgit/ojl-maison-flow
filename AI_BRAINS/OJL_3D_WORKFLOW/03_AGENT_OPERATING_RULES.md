# 03 - Agent Operating Rules

## Prime directive

Make the smallest useful change that moves the 3D asset workflow forward while preserving the no-scroll camera-only architecture.

## Before editing

The agent must state:

1. Which brain files were read.
2. What the task objective is.
3. Which files are expected to change.
4. Which architecture risks exist.

## During editing

- Prefer additive modules over massive rewrites.
- Keep source readable for a smaller local model.
- Keep named functions small and explicit.
- Do not hide important behavior in clever abstractions.
- Preserve current UI/camera/audio behavior unless the task explicitly changes it.
- Add comments where a real GLB or PBR map should replace procedural fallback.

## After editing

Run or request these checks:

```bash
npm run build
```

Browser checks if possible:

```js
window.scrollY === 0

document.documentElement.scrollHeight === window.innerHeight

document.querySelectorAll('canvas').length === 1
```

Also check:

- console errors: 0
- missing asset 404s: 0 in default mode
- sound autoplay errors: 0
- wheel/touch/keyboard still move virtual progress
- progress dots still work

## Forbidden changes

- Multiple WebGL canvases.
- Reintroducing document scroll.
- Loading remote assets from public URLs.
- Removing procedural fallback mode.
- Turning missing assets into runtime crashes.
- Importing models directly inside visual code instead of through manifest/registry.
- Pushing real product assets without ownership/licensing confirmation.
- Committing heavy unoptimized GLBs without asset card + approval.
- Using Cartier or other brand-specific protected designs.

## Required report format

```txt
Task:
Files changed:
Checks run:
Result:
Known issues:
Next recommended task:
```
