# Cartierflow Agent Notes

## Project Shape
- Vanilla Vite app using ES modules.
- Single fixed full-screen Three.js `WebGLRenderer`; the document itself does not scroll.
- Wheel, touch, keyboard, and progress-dot input update a virtual forward progress value, and GSAP eases the camera through connected room groups.
- Room groups use Cartier-booth inspired architecture: warm beige galleries, illuminated arches, vitrines, display tables, cloud/branch fantasy rooms, procedural jewelry pieces, lighting setups, and Howler ambience crossfaded by active room.

## Commands
- Install: `npm install`
- Develop: `npm run dev`
- Build: `npm run build`
- Preview production build: `npm run preview`

## Verification
- Run `npm run build` after code changes.
- For UI changes, start `npm run dev` and inspect the local Vite URL in a browser at desktop and mobile widths.
- Confirm `document.documentElement.scrollHeight === window.innerHeight`; room movement should come from virtual progress, not page scroll.

## Constraints
- Production dependencies are intentionally limited to `three`, `gsap`, and `howler`.
- Audio is generated as small in-browser WAV data URIs so the project has no external media asset dependency.
