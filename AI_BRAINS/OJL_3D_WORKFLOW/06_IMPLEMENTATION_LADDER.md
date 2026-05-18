# 06 - Implementation Ladder

Work in this order. Do not jump to full production GLB replacement before the asset pipeline exists.

## Step 1 - Freeze architecture

Confirm current app still has:

- one canvas
- no page scroll
- camera-only forward movement
- virtual progress input
- active room tracking
- sound toggle without autoplay errors

## Step 2 - Add asset folders

Create:

```txt
public/assets/models/products/.gitkeep
public/assets/models/rooms/.gitkeep
public/assets/models/props/.gitkeep
public/assets/textures/materials/.gitkeep
public/assets/textures/baked/.gitkeep
public/assets/hdri/.gitkeep
public/assets/audio/.gitkeep
```

## Step 3 - Add manifest

Create `src/experience/assets/assetManifest.js` with `USE_EXTERNAL_ASSETS = false` and disabled entries for products, rooms, environment, and audio.

## Step 4 - Add fallback registry

Name the current procedural product/room creators as stable fallback factories.

Example fallback keys:

- `proceduralRing`
- `proceduralPendant`
- `proceduralBracelet`
- `proceduralTimepiece`
- `proceduralOriginAtrium`
- `proceduralGeometryVault`

## Step 5 - Add safe GLB loader

Create `loadGLB.js` that:

- uses Three.js `GLTFLoader`
- resolves with a scene object
- catches errors
- logs controlled warnings only in dev
- never crashes the app
- can apply scale/position/rotation
- traverses mesh shadows/materials safely

## Step 6 - Add AssetRegistry

AssetRegistry should return either:

- loaded GLB asset, or
- procedural fallback object.

Default mode must not request missing paths.

## Step 7 - Replace one product optionally

Choose one room/product, probably the hero ring.

Behavior:

- external assets off: procedural ring appears
- external assets on with missing GLB: fallback appears and controlled warning
- external assets on with real GLB: real product appears

## Step 8 - Replace one room optionally

Same pattern for one room GLB.

## Step 9 - Add material presets

Create material presets for:

- warm gold
- brushed gold
- silver/platinum
- smoked glass
- ivory stone
- leather
- diamond/gem

Do not overcomplicate with custom shaders yet.

## Step 10 - Add HDR/environment workflow

Add optional environment loading. Default to generated studio lighting if no HDR exists.

## Step 11 - Add quality gates

Add documentation and maybe scripts for:

- asset size
- asset presence
- no missing 404s
- no-scroll checks
- one-canvas checks
- build

## Step 12 - Production asset pass

Only after steps 1-11:

- replace products one by one
- replace rooms one by one
- add baked textures
- add environment maps
- tune camera around real geometry
- tune material overrides
- create QA report per asset
