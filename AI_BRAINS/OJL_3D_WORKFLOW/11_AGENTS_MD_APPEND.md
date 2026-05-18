# OJL 3D Asset Workflow Rules

Agents working on this repo must read `AI_BRAINS/OJL_3D_WORKFLOW/00_START_HERE.md` before changing the 3D experience.

## Non-negotiables

- Keep one WebGL canvas.
- Keep document/page scroll disabled.
- Preserve camera-only forward movement through Z-axis rooms.
- Preserve procedural fallback mode.
- Do not hard-code local asset paths inside rendering logic.
- All real assets must go through `assetManifest.js`.
- Default mode must not request missing assets.
- Missing GLB/HDR/texture/audio files must not crash the site.
- Do not use Cartier or other protected brand assets/designs.
- Run `npm run build` after changes.

## Required browser checks

```js
window.scrollY === 0

document.documentElement.scrollHeight === window.innerHeight

document.querySelectorAll('canvas').length === 1
```

## Agent report format

```txt
Task:
Files changed:
Checks run:
Result:
Known issues:
Next recommended task:
```
