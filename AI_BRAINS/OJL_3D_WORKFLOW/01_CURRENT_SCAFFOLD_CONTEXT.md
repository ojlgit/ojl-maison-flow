# 01 - Current Scaffold Context

## Known project state

Project: `/Users/ilarischmidt/projects/cartierflow`

Current implemented scaffold:

- Vite app.
- Core source is mainly in `src/main.js`.
- Styling is mainly in `src/styles.css`.
- `AGENTS.md` exists and should be extended, not ignored.
- Earlier implementation had four individual Three.js WebGL alcoves.
- Later implementation changed to a smoother full-screen version.
- Current implementation is one fixed full-screen WebGL scene with no vertical page scroll.
- Rooms are connected along the Z axis.
- Wheel, touch, keyboard, and progress dots control virtual forward progress.
- GSAP smooths camera movement.
- Howler crossfades ambience by active room.
- Current rooms are inspired by booth/showroom references, but assets are still procedural primitives.
- User wants true/high-grade materials and real elements, not just animated primitives.

## Current success that must not regress

```js
window.scrollY === 0

document.documentElement.scrollHeight === window.innerHeight

document.querySelectorAll('canvas').length === 1
```

Other required checks:

- `npm run build` passes.
- Browser console has 0 errors and 0 warnings.
- Desktop viewport renders nonblank WebGL.
- Mobile viewport renders nonblank WebGL.
- Wheel input advances camera/active room without moving the page.
- Sound toggle runs without console errors.

## Current limitation

The scaffold is visually functional but not production quality because:

- Jewelry objects are procedural primitives.
- Rooms are primitive geometry, not art-directed GLB scenes.
- Materials do not yet use production PBR texture maps.
- No HDRI/environment lighting workflow is formalized.
- No local asset manifest governs real model integration.
- No asset budget/inspection process exists.
- There is no contract between Blender/C4D assets and Three.js runtime.

## Next target

Add a real asset workflow while preserving the camera-only forward movement.

The goal is not to make a different website. The goal is to replace placeholders with real models through a controlled asset pipeline.
