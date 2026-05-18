# 04 - Local 3D Asset Workflow

## Purpose

This workflow turns Blender/C4D/Rhino/scan/CAD output into optimized local runtime assets for the OJL Maison Flow site.

## Accepted runtime formats

Preferred:

- `.glb` for models and scenes.
- `.hdr` or `.exr` for environment lighting if supported by current loader.
- `.ktx2`, `.webp`, or optimized `.jpg/.png` for textures.
- `.mp3` or `.ogg` for audio.

Do not ship raw `.blend`, `.fbx`, `.obj`, `.step`, or `.c4d` in runtime paths unless explicitly approved.

## Source vs runtime folders

Recommended local structure:

```txt
assets_source/
  blender/
  cad/
  scans/
  textures_source/
  audio_source/

public/assets/
  models/products/
  models/rooms/
  models/props/
  textures/materials/
  textures/baked/
  hdri/
  audio/
```

Only optimized runtime assets go under `public/assets/`.

## Asset naming

Use stable, versioned names:

```txt
ojl-ring-geometry.v001.glb
ojl-room-geometry-vault.v001.glb
warm-gallery.v001.hdr
brushed-gold-roughness.v001.webp
```

Never use vague names like `final.glb`, `new.glb`, `test2.glb`, or `cartier-style.glb`.

## GLB export requirements

- Correct scale.
- Correct orientation.
- Product pivot at useful center.
- Room origin aligns with room Z position.
- Meshes named clearly.
- Materials named by class, for example `MAT_gold_warm`, `MAT_diamond_clear`, `MAT_glass_smoked`.
- Optional anchor empties/nodes for product placement and hotspots:
  - `ANCHOR_product_hero`
  - `HOTSPOT_stone`
  - `HOTSPOT_clasp`
  - `CAM_entrance`
  - `CAM_hero`
  - `CAM_exit`
  - `LOOK_hero`

## Optimization targets

Use these as starting budgets:

- Hero jewelry product: 5-8 MB compressed max.
- Secondary product: 1-3 MB compressed max.
- Room model: 3-6 MB compressed max.
- Texture max desktop: 2K-4K only where visibly needed.
- Texture max mobile: 1K-2K.
- Avoid too many materials and draw calls.
- Prefer baked lighting for room architecture.
- Use real-time shadows only for hero contact moments.

## Inspection before runtime use

Every real asset needs an Asset Card with:

- source file
- runtime file
- legal status
- dimensions/scale
- triangle count
- draw call/material count
- texture list
- file size
- known issues
- approval status

## Loading rule

A real asset may only be loaded by adding an entry to `assetManifest.js` and enabling that entry. Rendering logic must not hard-code asset paths.

## Fallback rule

Every product and room must have a procedural fallback until production mode is explicitly approved.

## Recommended implementation tasks

1. Add `assetManifest.js`.
2. Add `AssetRegistry.js`.
3. Add `loadGLB.js` wrapper.
4. Add `applyMaterialOverrides.js`.
5. Add local folder structure.
6. Add placeholder `.gitkeep` files under runtime folders.
7. Replace one product with optional GLB loading.
8. Replace one room with optional GLB loading.
9. Add environment loader.
10. Add asset validation helpers.
