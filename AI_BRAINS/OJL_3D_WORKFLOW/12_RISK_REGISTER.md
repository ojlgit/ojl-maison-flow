# 12 - Risk Register

## Risk: Page scroll returns

Impact: Breaks the intended forward camera experience.

Prevention: Verify `window.scrollY === 0` and `scrollHeight === innerHeight` after every patch.

## Risk: Multiple WebGL canvases return

Impact: Higher memory usage, inconsistent transitions, harder asset streaming.

Prevention: Verify `document.querySelectorAll('canvas').length === 1`.

## Risk: Missing asset crashes

Impact: Development gets blocked when GLBs are not present.

Prevention: `USE_EXTERNAL_ASSETS = false` by default and procedural fallback for every asset.

## Risk: Heavy unoptimized GLBs

Impact: Slow loading and poor mobile performance.

Prevention: Asset cards, size budgets, GLB optimization, LODs, texture compression.

## Risk: Materials look cheap

Impact: Premium goal fails even if models load.

Prevention: HDR/environment lighting, PBR maps, correct metalness/roughness, contact shadows.

## Risk: Copyright/brand confusion

Impact: Legal and brand risk.

Prevention: Original OJL assets only. No Cartier assets, logos, copy, product designs, or watch faces.

## Risk: Local agents rewrite too much

Impact: Regressions and lost architecture.

Prevention: Task packets, small patches, required reports, Gemma review before large changes.
