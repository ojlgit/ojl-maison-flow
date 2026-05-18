# OJL 3D Workflow Brain Ladder

This folder is the operating brain for turning the current OJL Maison Flow scaffold into a production-friendly local 3D asset workflow.

The goal is to let local agents such as Hermes and Gemma work safely on the site without breaking the core experience:

- one WebGL canvas
- no page/document scroll
- camera moves forward through rooms along the Z axis
- products and rooms can be replaced by local GLB/GLTF assets
- procedural objects remain as fallbacks
- missing assets never crash the site
- every patch keeps `npm run build` passing

## Read order

1. `00_START_HERE.md`
2. `01_CURRENT_SCAFFOLD_CONTEXT.md`
3. `02_TARGET_ARCHITECTURE.md`
4. `03_AGENT_OPERATING_RULES.md`
5. `04_LOCAL_3D_ASSET_WORKFLOW.md`
6. `05_FILE_STRUCTURE_AND_DATA_CONTRACTS.md`
7. `06_IMPLEMENTATION_LADDER.md`
8. `07_QUALITY_GATES_AND_TESTS.md`
9. `08_ART_DIRECTION_AND_MATERIAL_RULES.md`
10. `09_PROMPTS_FOR_HERMES_AND_GEMMA.md`
11. `10_BACKLOG_TASKS.md`
12. `11_AGENTS_MD_APPEND.md`
13. `12_RISK_REGISTER.md`

## First implementation milestone

Create a safe local asset pipeline before replacing visuals:

1. Add `src/experience/assets/assetManifest.js`.
2. Add an `AssetRegistry`.
3. Add a safe GLB loader wrapper.
4. Add `public/assets/` folder contracts.
5. Move procedural products/rooms behind named fallback factories.
6. Replace one product with optional GLB loading.
7. Verify no missing-asset console errors when external assets are disabled.
8. Verify one real GLB can be dropped in and loaded.

## Main rule

The site must run in three modes:

1. Procedural-only mode.
2. Mixed mode: some real GLBs, some procedural fallbacks.
3. Production mode: all approved local GLB/textures/audio loaded through the manifest.
