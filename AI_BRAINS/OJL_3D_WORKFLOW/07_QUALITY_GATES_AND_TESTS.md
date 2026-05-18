# 07 - Quality Gates and Tests

## Every patch must pass

```bash
npm run build
```

## Browser checks

```js
window.scrollY === 0

document.documentElement.scrollHeight === window.innerHeight

document.querySelectorAll('canvas').length === 1
```

## Console checks

Required:

- 0 errors
- 0 missing asset 404s in default mode
- 0 sound autoplay errors
- 0 unhandled promise rejections

Warnings may exist only if they are intentional and documented.

## Input checks

- Wheel forward advances virtual progress.
- Wheel backward reverses virtual progress.
- Touch swipe works on mobile.
- Keyboard navigation works if implemented.
- Progress dots move the camera without document scroll.

## Asset checks

For each real GLB:

- path exists under `public/assets/`
- manifest entry exists
- fallback exists
- scale correct
- orientation correct
- pivot correct
- product centered in hero beat
- no console errors
- material classes recognized
- file size within budget or exception approved

## Visual checks

- product is hero of each room
- lighting feels premium
- materials do not look plastic unless intended
- camera does not clip through product unintentionally
- transition feels forward, not vertical
- mobile version remains usable

## Performance checks

Record:

- draw calls
- triangles
- texture count
- geometries
- GPU memory impression if available
- FPS impression
- whether memory stabilizes after repeated room movement

## QA report

Use `templates/QA_REPORT.md` after meaningful asset or architecture changes.
