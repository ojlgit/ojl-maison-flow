# 14 - Art Component Library

## Purpose

This file defines the actual room and art-style components that AI agents should create, source, model, generate, refine, approve, and wire into the OJL Maison Flow WebGL scene.

The point is to avoid vague prompts like `make it premium` and instead give Hermes/Gemma a component checklist for floors, tables, skies, background images, arches, plinths, wall art, vitrines, light masks, and product staging.

## Hero product rule

Every room is built around the jewelry file at the center of attention.

For each room:

1. Jewelry GLB is the hero.
2. Hero product sits at an anchor named `ANCHOR_product_hero`.
3. Camera hero beat looks at the jewelry first.
4. Table/plinth/floor/background must support the product, not compete with it.
5. AI-generated background or texture components must stay lower contrast than the jewelry unless they are part of a transition.

## Component categories

### 1. Floor systems

Purpose:

- ground the room
- catch reflections/shadows
- create premium material feeling

Approved floor types:

- reflective black lacquer
- ivory stone slab
- warm travertine
- soft matte plaster floor
- brushed champagne metal inlay
- subtle mirror strip only near product
- cloud/fantasy floor as distant stage, not under close jewelry unless intentional

Required runtime forms:

- simple plane with PBR material
- optional baked texture maps
- optional reflection-like shader or screen-space reflection if performance allows
- optional AI-generated base color/roughness candidate

ComfyUI can create:

- floor reference images
- base color candidates
- soft imperfection maps
- light/shadow masks

Never use:

- noisy marble that distracts from jewelry
- fake low-resolution tiled texture
- high-contrast pattern under small jewelry

### 2. Display tables and plinths

Purpose:

- physically place the product
- create a luxury boutique/gallery feel

Approved forms:

- oval stone display table
- round pedestal
- rectangular low plinth
- glass vitrine base
- floating shelf
- mirrored black pedestal
- thin champagne metal support

Required 3D rules:

- modeled as GLB or simple optimized geometry
- contact shadow enabled
- material should be stone/glass/lacquer/metal
- anchor product slightly above table surface

ComfyUI can create:

- table concept variants
- texture candidates for stone/lacquer/leather
- light projection masks for table top

Runtime manifest category:

```js
artComponents.plinths
```

### 3. Vitrines and glass elements

Purpose:

- make product feel protected and precious
- add reflections and depth

Approved forms:

- cylindrical glass case
- rectangular smoked glass sheet
- curved display shield
- side glass panels
- distant vitrines for parallax

Rules:

- use transparent material sparingly
- avoid many overlapping transparent meshes
- do not place heavy glass over product if it hurts visibility
- use subtle opacity and environment reflection

### 4. Arch and portal systems

Purpose:

- create room-to-room flow
- hide loading/transition
- give the site a premium exhibition structure

Approved forms:

- illuminated arch
- champagne rectangular line frame
- warm cove light portal
- layered doorway
- soft shadow tunnel
- fantasy moon/cloud frame in later rooms

ComfyUI can create:

- arch glow masks
- wall light gradients
- background plates seen through portals

Runtime manifest category:

```js
artComponents.lightMasks
artComponents.backgroundPlates
```

### 5. Wall systems

Purpose:

- define the room mood
- hold art plates, soft light, material panels

Approved wall types:

- warm plaster
- ivory stone
- dark lacquer
- smoked glass panel
- fabric panel
- gallery mural
- cloud/fantasy matte backdrop

ComfyUI can create:

- wall mural images
- plaster/stone/fabric texture candidates
- soft shadow maps
- fantasy background plates

Rules:

- walls must not look like flat AI art pasted into 3D unless intentionally distant
- use blur/depth/parallax for 2D plates
- combine 3D geometry with 2D plates for depth

### 6. Sky and background plates

Purpose:

- add atmosphere behind rooms
- create depth beyond the geometry

Approved backgrounds:

- warm boutique extension
- soft clouds
- moonlit sky
- abstract champagne haze
- distant branches
- pale fantasy horizon
- blurred architectural silhouettes

Rules:

- background should remain behind jewelry
- no text/logos in generated images
- no recognizable copyrighted architecture
- no high-frequency detail near jewelry silhouette
- compress and resize before runtime

### 7. Foreground depth cards

Purpose:

- create cinematic depth and parallax

Approved cards:

- soft curtain edge
- glass edge
- branch silhouette
- warm light flare
- shadow vignette
- blurred plinth edge

Rules:

- must be subtle
- should not block product CTA
- should not hide jewelry details

### 8. Light and shadow masks

Purpose:

- create high-end lighting without heavy real-time lights

Approved masks:

- arch glow
- window light
- spotlight cone
- table highlight
- cloud shadow
- caustic-like shimmer

Rules:

- use grayscale masks
- use as alpha/emissive/opacity maps
- avoid moving masks too fast

### 9. UI art elements

Purpose:

- support premium interface

Approved:

- subtle grain overlay
- soft vignette
- progress line texture
- loading shimmer
- gallery map line art

Rules:

- UI must remain minimal
- generated UI images should never include product claims or unreadable text

## Component manifest categories

Use a separate art component manifest or extend the main asset manifest:

```js
export const artComponentManifest = {
  floors: {},
  plinths: {},
  walls: {},
  backgroundPlates: {},
  skyPlates: {},
  cutouts: {},
  lightMasks: {},
  videoLoops: {},
  uiOverlays: {}
};
```

## Room component pack

Every room should eventually have a `Room Art Pack`:

```txt
room-id/
  floor
  plinth/table
  wall system
  background plate
  arch/portal
  light masks
  optional cutouts
  optional video loop
  hero product anchor
```

## First priority component packs

1. Geometry Vault
   - ivory stone floor
   - round champagne/stone plinth
   - warm alcove wall
   - arch glow mask
   - subtle boutique background plate

2. Material Salon
   - warm plaster floor
   - material-card wall system
   - smoked glass panels
   - soft fabric background
   - side-table prop

3. Atelier Corridor
   - dark floor
   - technical blueprint wall plates
   - fine line masks
   - table with exploded components

4. Signature Chamber
   - reflective black lacquer floor
   - hero collection plinth array
   - grand arch portal
   - champagne haze background
   - optional soft video loop
