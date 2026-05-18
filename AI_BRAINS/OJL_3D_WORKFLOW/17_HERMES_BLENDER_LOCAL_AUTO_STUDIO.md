# 17 - Hermes Blender Local Auto Studio

## Purpose

This document adds the Hermes Blender Local Auto Studio workflow to the OJL Maison Flow brain library.

It defines how Hermes, Gemma, ComfyUI, Blender, and optional 3D generation tools should cooperate to create premium editorial 3D product frames, runtime GLB/USD packages, turntables, and room assets around real OJL jewelry files.

The goal is not to create generic AI 3D experiments. The goal is a repeatable local studio pipeline that can produce:

- high-premium campaign stills
- Blender staging scenes
- WebGL-ready GLB assets
- USD interchange exports
- product turntables
- supporting room art assets
- clear logs, manifests, asset cards, and QA reports

## Newest Blender policy

Use the newest locally installed stable Blender as the primary DCC, renderer, and export host.

Agents must not hard-code Blender 4.5 as the only supported version. The operating rule is:

```txt
Primary: newest stable Blender available locally.
Expected direction: Blender 5.x or newer when available.
Fallback: Blender 4.5 LTS only if the newest local version breaks an importer, exporter, add-on, or pipeline script.
```

Before every Blender job, Hermes must run:

```bash
blender --version
```

If Blender is not on PATH, use the configured macOS app binary:

```bash
/Applications/Blender.app/Contents/MacOS/Blender --version
```

The detected version must be written into the job log and QA report.

Generated scripts must inspect operator availability and fail gracefully instead of assuming a fixed API. For example, modern Blender builds should prefer `bpy.ops.wm.obj_import` and `bpy.ops.wm.fbx_import` where available, but scripts must fall back or report a clear error if the operator differs in the local build.

## Target look

The target is luxury editorial product imagery, not packshot automation.

Hermes should aim for:

- clean hero silhouette
- reflective premium materials
- shallow depth of field
- restrained bloom/glare
- dramatic HDRI/world lighting
- subtle volumetric atmosphere
- designed environment, not random AI clutter
- strong negative space
- product-first composition
- final asset package usable in both Blender and WebGL

References are atmosphere templates only. Do not copy protected brand designs, layouts, logos, watch faces, or campaign compositions.

## Product-first OJL rule

For OJL, real product geometry is the hero.

If the user provides CAD, `.3dm`, GLB, FBX, OBJ, clean product photos, or an existing mesh, Hermes must skip fake product generation and build the scene around the supplied asset.

AI generation may support the product with:

- concept boards
- background plates
- floors
- plinths and tables
- light masks
- wall art
- sky/cloud plates
- cutouts
- atmosphere loops
- material references

AI generation must not replace approved product geometry.

For the MNB Original 1.5ct Brilliantti RH7 product, the raw `.3dm` stays local and the runtime product should become:

```txt
public/assets/models/products/mnb-original-1-5ct-brilliantti-rh7.v001.glb
```

## Recommended stack

### Blender

Use the newest local stable Blender as:

- DCC host
- scene assembler
- material staging tool
- preview/final renderer
- GLB/USD exporter
- turntable renderer
- validation environment

Required capabilities:

- background execution
- Python API control
- Cycles rendering for finals
- Eevee preview when useful
- glTF/GLB export
- USD export when available
- OBJ/FBX import through current operators
- compositor for editorial splits and final plate layout
- Asset Browser reuse where useful

### Ollama + Gemma 4 26B

Use Gemma 4 26B as the local planner and multimodal director when available.

Gemma responsibilities:

- inspect reference images
- create stable YAML/JSON job manifests
- choose scene recipe
- plan ComfyUI prompts
- choose concept candidate
- decide whether TRELLIS/Hunyuan/SF3D is needed
- check style gates
- check license/compliance gates
- produce QA notes

Planning runs should use temperature 0 for stable schema-valid output.

### ComfyUI

Use ComfyUI as a local helper service, not a manual click tool.

ComfyUI responsibilities:

- concept images
- atmosphere boards
- transparent-background cutouts
- masks
- light masks
- background plates
- sky/cloud plates
- inpainting fixes
- selected upscales
- atmosphere video loops

Hermes should submit saved workflow JSON, monitor queue/status/WebSocket events, collect outputs, sort candidates, and move approved assets into manifest-ready runtime folders.

### 3D generation backends

Default hierarchy:

```txt
1. Supplied real OJL product asset -> use directly.
2. TRELLIS.2 image-to-3D -> default AI generator for non-product props/proxies.
3. Hunyuan3D 2.1 -> opt-in upgrade path when licensed and resources allow.
4. Stable Fast 3D -> fast draft/proxy mode only.
```

For hero jewelry, supplied product geometry wins over all AI generation.

## Image-conditioned rule

Hermes must prefer image-conditioned 3D over text-only 3D.

If the user provides only words:

```txt
words
  -> ComfyUI concept frames
    -> selected image
      -> image-to-3D backend
        -> Blender cleanup and staging
```

If the user provides CAD, `.3dm`, GLB, FBX, OBJ, product photos, or other product truth:

```txt
supplied product asset
  -> Blender staging
    -> material mapping
      -> anchors/hotspots/cameras
        -> render/export pipeline
```

## Standard job manifest

Every Hermes Studio job should be represented by a manifest before execution.

```yaml
job_id: ojl_ring_editorial_hero
mode: premium_final

blender:
  version_policy: newest_stable
  detected_version: null
  fallback_version: 4.5_lts
  binary: blender

references:
  images: []
  use_as_style_only: true
  notes: "Use references for atmosphere and composition only. Do not copy protected designs."

product:
  source: supplied_asset
  category: jewelry_ring
  product_id: mnbOriginal15ctBrillianttiRh7
  supplied_mesh: null
  supplied_cad: assets_source/products/mnb-original-1-5ct-brilliantti-rh7/MNB Original 1,5ct Brilliantti 1-1 RH7.3dm
  supplied_textures: null
  runtime_glb: public/assets/models/products/mnb-original-1-5ct-brilliantti-rh7.v001.glb
  hero_anchor: ANCHOR_product_hero

scene_recipe:
  type: geometry_vault
  product_focus: hero
  brand_space: true
  camera_mood: editorial_luxury

art_generation:
  concept_engine: comfyui
  concept_count: 4
  use_concepts_for_product: false
  use_concepts_for_environment: true

mesh_generation:
  default_engine: trellis2_default
  upgrade_engine: hunyuan21_optional
  draft_engine: sf3d_optional
  allowed_for_hero_product: false
  allowed_for_environment_props: true

render:
  engine: cycles
  quality: hero_still
  resolution: 4096x4096
  output_stills: true
  output_turntable: true
  denoise: openimagedenoise
  dof: subtle
  bloom_glare: restrained
  caustics: off_by_default

exports:
  blend: true
  glb: true
  usd: true
  fbx: optional
  png_16bit: true
  exr: optional

qa:
  require_asset_card: true
  require_license_notes: true
  require_preview_renders: true
  require_webgl_test: true
```

## Workspace layout

Use this deterministic workspace:

```txt
/workspace/hermes_blender/
  refs/
  jobs/
  concepts/
  meshes/
  textures/
  blend/
  renders/
  exports/
  logs/
```

For OJL repo runtime assets, approved files move into:

```txt
public/assets/models/products/
public/assets/models/rooms/
public/assets/models/props/
public/assets/textures/ai/
public/assets/video/ai/
```

Keep source CAD, `.3dm`, `.blend`, scans, and vendor files local unless explicitly approved for commit.

## Core run pattern

Use background mode for deterministic jobs:

```bash
blender --background --factory-startup --python-exit-code 1 --python scripts/job_runner.py -- --job jobs/ojl_ring_editorial_hero.yaml
```

If Blender is not on PATH:

```bash
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python-exit-code 1 --python scripts/job_runner.py -- --job jobs/ojl_ring_editorial_hero.yaml
```

Direct render commands must keep the render trigger last:

```bash
blender --factory-startup -b scene.blend -E CYCLES -o //renders/hero_#### -F PNG -x 1 -f 1
```

Do not put `-f` or `-a` before engine, output path, format, frame range, thread count, or Cycles arguments.

## Hermes run order

```txt
1. Read job manifest.
2. Detect Blender version.
3. Inspect references with Gemma vision -> style.json.
4. If no supplied product asset exists, generate 4 controlled concept frames in ComfyUI.
5. If supplied product asset exists, skip product generation.
6. Generate/select supporting environment art in ComfyUI.
7. Create/import non-product meshes through TRELLIS/Hunyuan/SF3D only if needed.
8. Import supplied product mesh or converted export into Blender staging scene.
9. Apply scene recipe template.
10. Create hero anchor and hotspots.
11. Apply material mapping and preview lighting.
12. Render Cycles stills and turntable.
13. Export editable .blend, runtime .glb, and interchange .usd.
14. Write logs, asset card, QA report, and manifest suggestions.
```

## Scene recipes

### Glass rain

Use for dramatic jewelry/product campaign stills.

Composition:

- dark glossy plane or waterline horizon
- hero product suspended in clean space
- foreground rain/streaks as curves or thin glass elements
- product sharp, foreground soft
- restrained bloom
- HDRI/world lighting
- subtle volumetric atmosphere
- camera depth of field

Rules:

- avoid clutter
- avoid heavy caustics by default
- use rain/glass for depth, not distraction

### Safari split

Use for editorial split compositions.

Composition:

- hero product in 3D
- left side as mood plate or staged environment
- right side as clean negative-space typography zone
- hard vertical split
- product render on its own pass
- final layout in Blender compositor

Rules:

- typography should be swappable without rerendering geometry
- no fake product details
- mood plate supports the product story

### Aviation deck

Use for premium metal/sky compositions.

Composition:

- brushed metal runway or fuselage-like plate
- rivets or panel seams
- slightly curved metal surface
- warm cloud HDRI
- optional sun lamp synced with HDRI
- crisp controlled reflections

Rules:

- use glossy noise-control strategies when useful
- avoid unnecessary caustics
- keep metal expensive, not noisy

### Geometry vault

Use for OJL ring or hero jewelry showcase.

Composition:

- ivory stone or warm plaster architecture
- round or oval plinth
- champagne arch frame
- subtle boutique background plate
- product at `ANCHOR_product_hero`
- camera hero beat focused on center stone/setting

Rules:

- background contrast lower than jewelry
- product stays central
- render exposes material quality clearly

### Material salon

Use for material/craft atmosphere.

Composition:

- soft plaster floor
- material swatch wall
- smoked glass panels
- side table
- warm fabric or stone surfaces

Rules:

- material references can come from ComfyUI
- product material comes from real GLB/material overrides

### Atelier corridor

Use for craft and technical detail.

Composition:

- darker corridor
- blueprint/technical line panels
- approved exploded-support elements only
- precise camera movement
- product or component still central

Rules:

- no false manufacturing claims
- technical art must not misrepresent the actual product

### Signature chamber

Use for final collection reveal.

Composition:

- reflective black lacquer floor
- hero collection plinth array
- grand arch portal
- champagne haze background
- optional soft video loop

Rules:

- jewelry remains primary visual hierarchy
- avoid overpopulating the frame
- use atmosphere to guide attention, not distract

## Render settings policy

### Finals

Use Cycles for final stills unless the brief explicitly calls for a realtime preview look.

Defaults:

```txt
engine: CYCLES
samples: 128-512 depending on asset and deadline
denoise: OpenImageDenoise or local equivalent
resolution: 4096x4096 for square hero stills unless otherwise specified
caustics: off by default
motion blur: off unless needed
DOF: subtle
bloom/glare: restrained in compositor
```

### Previews

Use faster settings:

```txt
engine: CYCLES or EEVEE_NEXT
samples: 32-96
resolution: 1200-1800 px
output: png
```

### Turntables

Use turntables for asset inspection, not only marketing.

Required angles:

- 0 degrees front
- 45 degrees
- 90 degrees side
- 180 degrees back
- macro/stone camera if jewelry

## Lighting policy

Use HDRI/world lighting as the base for reflective products.

Allowed additions:

- large soft area light
- narrow rim light
- subtle product kicker
- synced sun for aviation/cloud scenes
- low-density volumetric atmosphere

Avoid:

- too many small sharp lights
- noisy caustics
- over-bright bloom
- fake sparkle overload
- lighting that hides product silhouette

## Material policy

### White gold

Use controlled reflective metal. Avoid flat chrome.

Starting values:

```txt
base color: cool off-white metal
metallic: 1.0
roughness: 0.14-0.24
normal/bump: extremely subtle
```

### Diamond

Use physical/transmissive material where possible, but be practical for WebGL export.

Starting values:

```txt
base color: near white
roughness: very low
IOR: high, approx diamond-like
transmission: high in Blender final renders
WebGL export: simplify if GLB limitations require it
```

### Stone/floor/plaster

Use subtle texture and roughness variation. Avoid noisy marble or AI artifacts under the product.

### Glass/rain

Use sparse geometry and careful opacity. Too many overlapping transparent objects can create sorting and performance problems.

## Export package

Each completed job should output:

```txt
blend/scene-name.v001.blend
exports/scene-name.v001.glb
exports/scene-name.v001.usd
renders/scene-name-hero.v001.png
renders/scene-name-turntable/
logs/scene-name.v001.log
reports/scene-name-qa.v001.md
```

For website runtime, only optimized assets move to `public/assets/`.

## Quality gates

Hermes must reject a mesh or scene if any of these fail:

- broken silhouette
- asymmetry where symmetry is expected
- warped ring band or case geometry
- malformed prongs/settings/lugs/bezels/links
- roughness maps make polished metal look plastic
- fake/generated detail contradicts real product
- product is not the visual hero
- background contains logos/text/watermarks
- frame resembles a protected brand campaign too closely
- material names are unclear or un-mappable
- GLB export loses critical material classes
- runtime asset is too heavy without approval

## License and compliance gates

Safest default commercial stack:

```txt
Blender + supplied OJL product assets + TRELLIS.2 for non-product helper assets + CC0 environment/material sources when needed
```

Rules:

- Record licenses for every external asset/model/workflow.
- Treat Hunyuan3D 2.1 as opt-in until approved for the specific use case.
- Treat Stable Fast 3D as draft/proxy mode unless the license and quality gates are approved.
- For Poly Haven, ambientCG, or similar CC0 sources, record exact asset names and local paths.
- If compliance is unclear, fall back to Blender-native cleanup, real product assets, and approved local ComfyUI outputs.

## Resource management

Gemma 4 26B, 3D generators, ComfyUI, and Blender can compete for VRAM.

Hermes should run stages serially by default:

```txt
1. Gemma planning
2. ComfyUI concept/support generation
3. 3D generator if needed
4. Blender import/render/export
```

On a single GPU, unload idle backends before starting heavy render or texturing tasks. Simultaneous residency is only allowed on machines with enough VRAM and explicit human approval.

## WebGL handoff

After Blender export, the OJL site integration still follows the normal brain ladder:

```txt
optimized GLB
  -> asset card
    -> assetManifest entry
      -> AssetRegistry load
        -> fallback preserved
          -> one-canvas/no-scroll QA
```

The exported product must be tested in the OJL Maison Flow runtime. Blender beauty renders do not prove WebGL readiness.

## First OJL Hermes Studio task

```text
Task: Convert and stage the MNB Original 1.5ct Brilliantti RH7 product into a Blender hero scene.

Read:
- 00_START_HERE.md
- 04_LOCAL_3D_ASSET_WORKFLOW.md
- 16_BLENDER_AI_MCP_COMMAND_LIBRARY.md
- 17_HERMES_BLENDER_LOCAL_AUTO_STUDIO.md
- product_assets/MNB_ORIGINAL_1_5CT_BRILLIANTTI_RH7_ASSET_CARD.md

Objective:
Use the newest local stable Blender to create a staging scene, hero anchors, material mapping plan, preview render cameras, and manifest-ready runtime GLB path for the supplied product. Do not commit the raw .3dm.

Required outputs:
- detected Blender version log
- asset card update
- preview still
- exported GLB candidate
- suggested assetManifest entry
- QA report

Non-negotiables:
- real product geometry stays hero
- no fake product generation
- no raw proprietary CAD committed to public repo
- fallback mode in WebGL remains intact
```
