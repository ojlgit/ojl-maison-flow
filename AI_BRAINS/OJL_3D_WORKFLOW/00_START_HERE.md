# 00 - Start Here

## Mission

Convert the current local 3D prototype into a production-friendly OJL luxury 3D experience that can load real local GLB assets for rooms, jewelry, vitrines, lighting markers, materials, HDR environments, and future sound while keeping the existing no-page-scroll, forward-camera flow.

## Non-negotiables

1. One WebGL renderer/canvas for the whole experience.
2. No document/page scroll.
3. `html`, `body`, and app root must remain fixed to one viewport.
4. User input controls virtual forward progress, not vertical page scroll.
5. Camera moves forward through rooms along the Z axis.
6. Real assets are GLB/GLTF based, not hard-coded primitive geometry only.
7. Procedural assets remain as fallbacks.
8. Missing assets must not crash the site.
9. No external CDN/runtime remote dependencies for assets.
10. No Cartier or other brand assets, logos, designs, copy, or watch faces.
11. All asset changes go through manifest entries and quality gates.
12. Every agent patch must keep `npm run build` passing.
13. Every agent patch must keep console errors at zero.
14. Every patch must preserve `window.scrollY === 0` during interaction.
15. Every patch must preserve `document.documentElement.scrollHeight === window.innerHeight` unless a human explicitly approves changing the no-scroll architecture.

## Definition of success

The local site loads a cinematic 3D room flow. Each room can be switched from procedural placeholder to real local GLB by editing an asset manifest. Products look like premium jewelry/product models, with PBR materials, HDR/environment lighting, reflections, shadows, and mobile-safe performance.

## Agent roles

### Hermes agent

Use Hermes for implementation: edit source code, create modules, integrate loaders, add manifest entries, run commands, fix imports, run build, and report exact files changed.

Hermes must work in small patches and must not rewrite the entire app unless instructed by a task packet.

### Gemma 4 26B

Use Gemma for planning and review: read the brain ladder, create patch plans, check for architecture violations, review diffs, produce QA checklists, identify missing asset/material information, and keep Hermes focused.

Gemma should not approve visual shortcuts that weaken the premium goal.

### Human lead

Human decides final art direction, product truth, legal safety, asset approvals, room order, product story, and when to ship.

## Required workflow for every task

1. Read the relevant brain files.
2. State the task objective in one paragraph.
3. List files expected to change.
4. Make the smallest useful patch.
5. Run build.
6. Run no-scroll verification.
7. Run console verification if browser is available.
8. Report changed files, checks passed, and unresolved issues.

## Do not do this

- Do not bring back vertical sections or page scroll.
- Do not create one canvas per room.
- Do not import remote 3D assets from the web.
- Do not add high-size GLBs directly to production paths without optimization.
- Do not hard-code product paths inside rendering logic.
- Do not delete procedural fallbacks.
- Do not treat procedural geometry as final jewelry quality.
- Do not modify camera controls in a way that breaks wheel/touch/keyboard/dot navigation.
- Do not create sound autoplay errors.
- Do not leave broken paths in the console.
