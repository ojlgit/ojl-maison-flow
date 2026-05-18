# 13 - ComfyUI Art Factory Workflow

## Purpose

This document adds the missing art-production layer to the OJL Maison Flow brain ladder.

The earlier workflow covers real GLB/GLTF models, asset manifests, room definitions, material rules, and safe runtime loading. This file defines how the existing ComfyUI environment should be used as an automated art factory for high-premium floors, tables, plinths, wall panels, skies, background plates, material swatches, murals, light masks, transition imagery, and fallback video/image sequences.

## Core principle

ComfyUI should support the 3D experience, not replace the real product.

Real OJL jewelry GLB files must remain the center of attention. AI-generated art assets are used for:

- concept exploration
- material references
- room mood boards
- texture candidates
- background plates
- sky/cloud/fantasy elements
- wall art
- floor/table/plinth surface maps
- transition masks
- fallback video/image sequences
- product-safe retouching previews

AI-generated assets must not invent final product geometry or misrepresent jewelry details. The real jewelry files are loaded through the 3D asset manifest and placed at the hero anchors.

## Existing ComfyUI capabilities to use

Based on the current ComfyUI setup described by the user, the local environment already supports:

- ComfyUI 0.21.1 under `./comfy-native/ComfyUI/`
- ComfyUI-Manager
- Impact Pack for segmentation and masking workflows
- API nodes for OpenAI, Gemini, Anthropic, Stability, and Luma style orchestration
- Flux.1 Dev/Krea/Fill workflows
- Z-Image-Turbo and Ernie Image workflows
- LTX and Wan video workflows
- Qwen/Flux inpainting workflows
- SAM3 segmentation
- BiRefNet background removal
- upscaling/editing workflows
- audio/video/subtitle experimental workflows

This means the project can operate as an AI-agent art pipeline: LLM writes a brief, ComfyUI creates variants, segmentation/upscaling/refinement produces clean assets, and the web app consumes approved outputs through manifests.

## What ComfyUI should produce

### 1. Art direction boards

Use ComfyUI to generate room references before modeling:

- warm beige showroom
- illuminated arches
- gallery alcoves
- champagne line frames
- reflective black lacquer floors
- ivory stone floors
- smoked glass vitrines
- fantasy cloud/branch room
- moonlit sky room
- luxury table and plinth studies

Output path:

```txt
assets_source/comfy/concepts/<room-id>/
```

These are reference images only, not runtime assets unless approved.

### 2. Runtime background plates

Use image generation or inpainting to create 2D plates that can be placed on planes behind 3D geometry:

- distant sky
- clouds
- moon/sun glow
- soft wall murals
- abstract landscapes
- blurred showroom extensions
- fantasy branches in the distance

Output path:

```txt
public/assets/textures/ai/backgrounds/
```

Use in WebGL as:

- large background planes
- sky dome texture candidates
- wall artwork
- distant parallax cards
- transition backdrops

### 3. Runtime texture candidates

Generate or refine material textures:

- ivory stone
- travertine
- brushed champagne metal reference
- subtle leather grain
- silk/fabric backdrop
- plaster wall
- dark lacquer
- warm bronze patina
- paper/blueprint line art

Output path:

```txt
public/assets/textures/ai/materials/
```

Use these only after QA. For real PBR materials, the final runtime should prefer proper texture sets: base color, roughness, normal, metalness, ambient occlusion, alpha, emissive where needed.

### 4. Light masks and projection textures

Generate grayscale masks for:

- arch glow
- soft window light
- caustic-like reflections
- wall gradients
- spotlight falloff
- cloud shadows
- jewelry reveal masks

Output path:

```txt
public/assets/textures/ai/light-masks/
```

Use as alpha/emissive/gradient textures, not as uncontrolled full-scene overlays.

### 5. Video plates

Use Wan/LTX/Luma-capable workflows for restrained looping atmospheric video:

- slow clouds
- moving fabric
- drifting dust
- soft light movement
- distant branches
- showroom reflection shimmer

Output path:

```txt
public/assets/video/ai/
```

Rules:

- Keep loops short and compressed.
- Use only as background/atmosphere planes.
- Never let video compete with jewelry.
- Provide still fallback image for each video.

### 6. Cutout props

Use SAM3/BiRefNet to cut out generated or photographed elements:

- branches
- curtains
- abstract display props
- distant silhouettes
- wall art fragments

Output path:

```txt
public/assets/textures/ai/cutouts/
```

Use as transparent planes only when it improves depth without adding heavy geometry.

## Do not use ComfyUI for

- final OJL jewelry geometry
- product shapes that could misrepresent what is sold
- fake gemstone placement that differs from the real product
- copied luxury brand references
- final brand logo generation
- unapproved product claims
- direct generation of trademarked designs
- uncontrolled high-frequency backgrounds that distract from products

## Recommended local folders

```txt
assets_source/comfy/
  briefs/
  workflows/
  inputs/
  concepts/
  candidates/
  selected/
  rejected/
  masks/
  logs/

public/assets/textures/ai/
  backgrounds/
  materials/
  light-masks/
  cutouts/
  ui/

public/assets/video/ai/
  loops/
  fallbacks/
```

## Naming convention

```txt
ojl-room02-floor-ivory-stone.v001.webp
ojl-room03-bg-soft-clouds.v003.webp
ojl-room04-lightmask-arch-glow.v002.webp
ojl-room05-loop-drifting-clouds.v001.mp4
ojl-room05-loop-drifting-clouds-fallback.v001.webp
```

Avoid:

```txt
final.png
cartier-bg.png
nice-floor-2.png
upscaled.png
```

## Automation loop

```txt
RoomSpec
  -> LLM Art Director creates ComfyUI Render Brief
    -> ComfyUI generates 4-12 variants
      -> segmentation/masking/upscale/refine
        -> Gemma/Hermes review against style rules
          -> human selects candidate
            -> asset card created
              -> image/video optimized
                -> art component manifest entry added
                  -> WebGL scene consumes the asset
```

## Runtime integration principle

Every AI-generated runtime asset must go through an art component manifest, not random direct imports.

The 3D scene should ask:

```txt
What background plate belongs to room 3?
What floor material texture belongs to room 2?
What light mask belongs to this arch?
What video loop belongs to the final chamber?
```

It should not hard-code arbitrary image paths inside rendering logic.

## First ComfyUI milestone

Create one complete room material pack:

```txt
room: Geometry Vault
hero product: real/procedural ring at center
Comfy outputs:
- floor ivory stone base color
- wall warm plaster base color
- arch glow light mask
- distant warm gallery background plate
- optional soft dust/light overlay plate
```

Then wire those assets through `artComponentManifest.js` while the ring remains loaded through the 3D product manifest.
