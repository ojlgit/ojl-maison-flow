# 16 - Blender AI MCP Command Library

## Purpose

This document adds Blender AI / MCP command knowledge to the OJL Maison Flow brain ladder.

It turns the uploaded Blender automation blueprint into practical rules and command contracts that local agents can use when working with Blender, Rhino-exported jewelry assets, room GLBs, preview renders, and production WebGL assets.

This file is for Hermes/Gemma/local agents that need to:

- control Blender through a local MCP bridge
- run safe headless Blender commands
- batch-convert approved 3D assets into GLB
- inspect scenes and object hierarchies
- create anchors for product placement and hotspots
- apply material overrides for jewelry materials
- render proof frames and multi-camera previews
- keep all automation local, sandboxed, and reversible

## Source context

The uploaded blueprint describes a professional local AI-to-Blender architecture built around:

- Blender command-line execution
- strict sequential command parsing
- `--factory-startup` for deterministic runs
- `--python-exit-code 1` for failure signaling
- Python script injection with `-P` or `--python-expr`
- `--` as the delimiter between Blender arguments and script arguments
- a three-tier MCP bridge: AI client -> MCP server -> Blender add-on over local TCP
- synchronous tools for lightweight scene actions
- asynchronous jobs for renders, bakes, conversions, and heavy operations
- Blender 4.2+ / 5.0 importer changes
- strict sandboxing of generated Python code

## OJL usage boundary

The Blender MCP system is allowed to help with:

- converting OJL product exports to optimized GLB
- creating product anchors and hotspot markers
- creating and validating room GLBs
- assigning material classes for white gold, diamonds, glass, stone, and lacquer
- creating preview renders
- creating staging scenes around real product geometry
- exporting WebGL-ready runtime assets

It must not:

- invent final jewelry geometry
- alter approved product design without human approval
- commit raw proprietary CAD/Rhino files into public GitHub
- use remote assets from unknown sources
- create copyrighted or brand-confusing designs
- run unsandboxed arbitrary Python
- write outside approved project directories

## Core architecture

```txt
AI client / local agent
  -> MCP tool call with strict JSON schema
    -> local MCP server validates arguments
      -> Blender bridge add-on on 127.0.0.1, usually port 9876
        -> Blender Python API / command execution
          -> structured result, stdout, stderr, job id, or error
```

Rules:

- The bridge must run locally only.
- No telemetry.
- No public network calls from generated Blender code.
- Heavy tasks return a job id instead of blocking.
- Tools expose structured JSON schemas.
- Scene mutations should push undo steps when possible.

## Headless Blender command rules

Blender parses command-line arguments in strict sequential order. Configuration must come before execution triggers.

### Always put render trigger last

Correct:

```bash
blender --factory-startup -b project.blend -E CYCLES -o //renders/shot_#### -F PNG -x 1 -t 0 -f 1
```

Incorrect:

```bash
blender -b project.blend -f 1 -o //renders/shot_#### -F PNG
```

Why it is wrong: Blender starts the render before it reads the output path and format.

### Common headless flags

| Flag | Meaning | OJL rule |
|---|---|---|
| `-b` / `--background` | Run without GUI | Default for conversions, previews, batch jobs |
| `--factory-startup` | Ignore user startup/preferences | Default for deterministic automation |
| `--python-exit-code 1` | Return non-zero on Python error | Required for CI/agent jobs |
| `-E CYCLES` | Set render engine | Use for high-quality proof renders |
| `-E BLENDER_EEVEE_NEXT` | Set Eevee Next | Use for fast previews when acceptable |
| `-o` | Output path | Must precede `-f` or `-a` |
| `-F` | Render format | Must precede `-f` or `-a` |
| `-x 1` | Use file extension | Use for predictable output files |
| `-s` / `-e` | Frame range | Must precede `-a` |
| `-f` | Render one frame | Must be final Blender trigger |
| `-a` | Render animation | Must be final Blender trigger |
| `-t 0` | Use all CPU threads | OK for local heavy render jobs |

### Cycles device argument rule

Cycles-specific arguments go after a double dash:

```bash
blender --factory-startup -b project.blend -E CYCLES -o //renders/shot_#### -F PNG -x 1 -f 1 -- --cycles-print-stats
```

For GPU use, choose the device available on the workstation:

```bash
# NVIDIA workstation example
blender --factory-startup -b project.blend -E CYCLES -o //renders/shot_#### -F PNG -x 1 -f 1 -- --cycles-device OPTIX

# CUDA example
blender --factory-startup -b project.blend -E CYCLES -o //renders/shot_#### -F PNG -x 1 -f 1 -- --cycles-device CUDA

# macOS/Apple Silicon example, if configured in Blender
blender --factory-startup -b project.blend -E CYCLES -o //renders/shot_#### -F PNG -x 1 -f 1 -- --cycles-device METAL
```

Agents must not assume the GPU backend. Query/configure the local machine first, or use CPU-safe fallback.

## Python execution commands

### Script execution with argument delimiter

Use `-P` for vetted scripts:

```bash
blender --factory-startup -b --python-exit-code 1 -P scripts/blender/convert_to_glb.py -- --input public/assets/inbox/model.fbx --output public/assets/models/products/product.v001.glb
```

Inside the Python script:

```python
import sys
args = sys.argv[sys.argv.index('--') + 1:]
```

Then parse `args` with `argparse`.

### Inline expression execution

Use `--python-expr` only for very small diagnostic commands:

```bash
blender --factory-startup -b project.blend --python-expr "import bpy; print(bpy.context.scene.name)"
```

Do not use inline expressions for multi-step conversions, material mapping, scene cleanup, or exports.

## MCP tool namespaces

### Scene inspection tools

These are read-only and safe for synchronous bridge execution.

#### `blender_scene_get_info`

Purpose: return global scene state.

Returns:

```json
{
  "scene_name": "Scene",
  "frame_start": 1,
  "frame_end": 120,
  "render_engine": "CYCLES",
  "resolution": [1920, 1080],
  "object_count": 48
}
```

#### `blender_scene_list_objects`

Purpose: list objects by optional type.

Input:

```json
{
  "type_filter": "MESH"
}
```

Allowed filters:

```txt
MESH, CAMERA, LIGHT, EMPTY, CURVE, ARMATURE, ALL
```

#### `blender_object_get_transform`

Purpose: get location, rotation, scale, and matrix for a named object.

Input:

```json
{
  "name": "ANCHOR_product_hero"
}
```

#### `blender_object_get_hierarchy`

Purpose: return parent-child structure for full scene or subtree.

Input:

```json
{
  "root": "Room_GeometryVault"
}
```

### Object manipulation tools

These mutate the scene. They should push undo steps where possible.

#### `blender_object_translate`

Schema:

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "location": {
      "type": "array",
      "items": { "type": "number" },
      "minItems": 3,
      "maxItems": 3,
      "description": "Absolute [x, y, z] location."
    },
    "offset": {
      "type": "array",
      "items": { "type": "number" },
      "minItems": 3,
      "maxItems": 3,
      "description": "Relative [x, y, z] movement."
    }
  },
  "required": ["name"]
}
```

Rule: use either `location` or `offset`, not both.

#### `blender_object_rotate`

Use explicit units.

```json
{
  "name": "mnbOriginal15ctBrillianttiRh7",
  "rotation": [0, 0, 45],
  "unit": "degrees",
  "mode": "absolute"
}
```

#### `blender_object_scale`

```json
{
  "name": "mnbOriginal15ctBrillianttiRh7",
  "scale": [1.0, 1.0, 1.0],
  "mode": "absolute"
}
```

#### `blender_object_duplicate`

```json
{
  "source_name": "Plinth_Stone_Round",
  "new_name": "Plinth_Stone_Round_Copy",
  "linked_data": false,
  "location": [0, 0, -18]
}
```

#### `blender_object_delete`

Dangerous. Must require explicit object names and approval in agent plan.

```json
{
  "names": ["Cube", "Temporary_Boolean_Cutter"]
}
```

### Material tools

#### `blender_material_create`

```json
{
  "name": "MAT_white_gold_14k_runtime",
  "type": "principled",
  "base_color": [0.86, 0.86, 0.84, 1.0],
  "metallic": 1.0,
  "roughness": 0.18,
  "alpha": 1.0
}
```

Color arrays must be normalized floats from `0.0` to `1.0`, not 0-255 values.

#### `blender_material_assign`

```json
{
  "object_name": "Ring_Setting",
  "material_name": "MAT_white_gold_14k_runtime",
  "slot_index": 0
}
```

#### `blender_material_set_texture`

```json
{
  "material_name": "MAT_ivory_stone_floor",
  "texture_path": "public/assets/textures/ai/materials/ojl-room02-floor-ivory-stone.v001.webp",
  "channel": "base_color"
}
```

Allowed channels:

```txt
base_color, roughness, metallic, normal, ao, alpha, emission, displacement
```

### Jewelry material presets

For OJL product exports, material overrides should map source names into runtime-safe materials.

Source material clues for the uploaded MNB ring include:

```txt
White Gold-14k
Diamond
Yellow Gold-14k
Opal White
Pearl White
Diamond_Map
Gem_Map
MetalBump
Studio
```

Recommended runtime mapping:

```txt
White Gold-14k -> MAT_white_gold_14k_runtime
Diamond -> MAT_diamond_clear_runtime
Yellow Gold-14k -> MAT_yellow_gold_14k_runtime
Opal White -> MAT_opal_white_runtime
Pearl White -> MAT_pearl_white_runtime
```

White gold starting values:

```json
{
  "base_color": [0.86, 0.86, 0.84, 1.0],
  "metallic": 1.0,
  "roughness": 0.16
}
```

Diamond starting values:

```json
{
  "base_color": [1.0, 0.98, 0.94, 1.0],
  "metallic": 0.0,
  "roughness": 0.01,
  "transmission": 1.0,
  "ior": 2.4,
  "thickness": 0.2
}
```

Agents may tune these visually, but must not create fake product geometry.

### Asset import/export tools

#### `blender_asset_import`

Purpose: import source assets into the current Blender scene.

Input:

```json
{
  "path": "assets_source/products/exported/mnb-ring.fbx",
  "format": "FBX",
  "collection": "PRODUCT_mnbOriginal15ctBrillianttiRh7",
  "apply_transforms": true,
  "material_name_collision": "reference_existing"
}
```

Rules:

- Use `bpy.ops.wm.obj_import` for OBJ in modern Blender.
- Use `bpy.ops.wm.fbx_import` for FBX in modern Blender.
- Use `bpy.ops.import_scene.gltf` or direct GLTF import path only when supported by local version.
- For Rhino `.3dm`, prefer exporting from Rhino/MatrixGold to GLB/FBX/OBJ first unless an approved importer exists.

#### `blender_asset_export_glb`

Purpose: export selected scene content as runtime GLB.

Input:

```json
{
  "output_path": "public/assets/models/products/mnb-original-1-5ct-brilliantti-rh7.v001.glb",
  "selection_only": true,
  "apply_transforms": true,
  "include_materials": true,
  "include_custom_properties": true
}
```

Implementation should use:

```python
bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    use_selection=True
)
```

Exact exporter parameters may vary by Blender version; agents must inspect local API if an argument fails.

### OJL anchor tools

#### `blender_ojl_create_product_anchor`

Creates standard empty objects for product placement.

Input:

```json
{
  "product_id": "mnbOriginal15ctBrillianttiRh7",
  "anchor_location": [0, 1.35, 0],
  "hotspots": [
    { "id": "center_stone", "location": [0, 0.35, 0] },
    { "id": "white_gold_setting", "location": [0.32, 0.12, 0] }
  ]
}
```

Creates:

```txt
ANCHOR_product_hero
HOTSPOT_center_stone
HOTSPOT_white_gold_setting
```

#### `blender_ojl_place_product_at_anchor`

```json
{
  "product_object": "mnbOriginal15ctBrillianttiRh7",
  "anchor": "ANCHOR_product_hero",
  "align_rotation": true,
  "preserve_scale": true
}
```

### Camera and preview tools

#### `blender_camera_create_hero_preview`

```json
{
  "name": "CAM_hero_mnb_ring",
  "location": [0.0, 1.25, 3.6],
  "look_at": "ANCHOR_product_hero",
  "lens_mm": 70,
  "depth_of_field": true,
  "focus_object": "ANCHOR_product_hero",
  "aperture_fstop": 4.0
}
```

#### `blender_render_preview_frame`

Use async if high quality.

```json
{
  "camera": "CAM_hero_mnb_ring",
  "output_path": "renders/previews/mnb-ring-hero.v001.png",
  "engine": "CYCLES",
  "samples": 128,
  "resolution": [1600, 1200],
  "frame": 1,
  "async": true
}
```

#### `blender_render_multi_camera_set`

```json
{
  "cameras": ["CAM_front", "CAM_macro", "CAM_side"],
  "frames": [1],
  "output_dir": "renders/previews/mnb-ring-v001/",
  "engine": "CYCLES",
  "samples": 128
}
```

### Python execution tools

#### `blender_python_exec`

Use only for small synchronous code.

```json
{
  "code": "import bpy\nprint(bpy.context.scene.name)",
  "timeout_seconds": 10,
  "transport": "bridge"
}
```

#### `blender_python_exec_async`

Use for heavy jobs.

```json
{
  "script_path": "scripts/blender/export_product_glb.py",
  "args": {
    "input": "assets_source/products/mnb-ring/mnb-ring-export.fbx",
    "output": "public/assets/models/products/mnb-original-1-5ct-brilliantti-rh7.v001.glb"
  },
  "timeout_seconds": 3600,
  "transport": "headless"
}
```

#### `blender_job_status`

```json
{
  "job_id": "job-f8e2a1b3"
}
```

#### `blender_job_cancel`

```json
{
  "job_id": "job-f8e2a1b3"
}
```

### History tools

#### `blender_history_undo`

```json
{
  "steps": 1,
  "reason": "Revert incorrect product transform."
}
```

#### `blender_scene_save_incremental`

```json
{
  "path": "assets_source/blender/work/mnb-ring-staging.v002.blend"
}
```

## Blender 4.2+ and 5.0 API rules

Agents must prefer modern importer operators where available:

```txt
Legacy OBJ import: bpy.ops.import_scene.obj
Modern OBJ import: bpy.ops.wm.obj_import

Legacy FBX import: bpy.ops.import_scene.fbx
Modern FBX import: bpy.ops.wm.fbx_import
```

GLTF/GLB export remains through:

```txt
bpy.ops.export_scene.gltf
```

Rules:

- If an operator fails, inspect local Blender version and operator docs before guessing.
- Use context overrides when Window Manager operators require UI context.
- Prefer `--factory-startup` for deterministic headless execution.
- Do not rely on user-installed add-ons unless the task explicitly requires them.

## Security and sandbox policy

### Approved roots

Generated Blender scripts may read/write only within approved project roots, for example:

```txt
/Users/ilarischmidt/projects/cartierflow/
/Users/ilarischmidt/projects/ojl-maison-flow/
```

Project-local recommended paths:

```txt
assets_source/
public/assets/
renders/
scripts/blender/
AI_BRAINS/
```

### Dynamic code blocklist

For arbitrary `code` strings, block by default:

```txt
subprocess
shutil
socket
webbrowser
ctypes
multiprocessing
raw open outside approved roots
exec
eval
```

`os` may be allowed only in vetted `script_path` jobs when file traversal is required and approved roots are enforced.

### Transport rules

Use bridge/synchronous transport for:

- object transform queries
- material assignment
- anchor creation
- small scene inspection

Use headless/async transport for:

- renders
- batch conversion
- mesh quality analysis
- Boolean-heavy cleanup
- baking
- large imports/exports

## OJL product conversion workflow

For the uploaded MNB original brilliant ring, the recommended practical route is:

```txt
1. Keep the original .3dm local and untouched.
2. Export a clean working copy from Rhino/MatrixGold to GLB, FBX, or OBJ.
3. Import into Blender staging scene.
4. Remove manufacturing-only helpers if present.
5. Verify scale, orientation, and pivot.
6. Create ANCHOR_product_hero and hotspot empties.
7. Rename/material-map source materials.
8. Create hero preview cameras.
9. Render preview frames.
10. Export optimized GLB.
11. Add runtime path to assetManifest.
12. Test in OJL Maison Flow with fallback mode intact.
```

## First Hermes task using this library

```text
Task: Add Blender MCP command foundation docs and create a safe product GLB export task packet.

Read:
- 00_START_HERE.md
- 03_AGENT_OPERATING_RULES.md
- 04_LOCAL_3D_ASSET_WORKFLOW.md
- 16_BLENDER_AI_MCP_COMMAND_LIBRARY.md
- product_assets/MNB_ORIGINAL_1_5CT_BRILLIANTTI_RH7_ASSET_CARD.md

Objective:
Create scripts/blender/README.md and a task packet for converting the MNB ring export into a runtime GLB without committing the raw .3dm source.

Requirements:
- Do not modify the WebGL site yet.
- Do not commit raw product source files.
- Keep all paths manifest-ready.
- Include exact command examples for headless Blender.
- Include QA checks.
```
