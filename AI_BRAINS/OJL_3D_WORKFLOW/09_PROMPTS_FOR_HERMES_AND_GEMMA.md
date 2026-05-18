# 09 - Prompts for Hermes and Gemma

## Hermes implementation prompt

```text
You are implementing the OJL Maison Flow local 3D asset workflow.

Before editing, read:
- AI_BRAINS/OJL_3D_WORKFLOW/00_START_HERE.md
- AI_BRAINS/OJL_3D_WORKFLOW/01_CURRENT_SCAFFOLD_CONTEXT.md
- AI_BRAINS/OJL_3D_WORKFLOW/03_AGENT_OPERATING_RULES.md
- the task-specific brain file named in the task packet

Non-negotiables:
- one WebGL canvas
- no document/page scroll
- virtual progress controls camera forward movement
- procedural fallbacks remain
- default mode must not request missing asset files
- npm run build must pass

Work in the smallest useful patch. Report files changed, checks run, and unresolved issues.
```

## Gemma planning prompt

```text
You are reviewing or planning changes for the OJL Maison Flow 3D site.

Your job is to keep the implementation aligned with the brain ladder.

Check:
- Does the plan preserve one canvas?
- Does it preserve no page scroll?
- Does it avoid hard-coded asset paths?
- Does it preserve procedural fallback mode?
- Does it avoid remote/copyrighted assets?
- Does it add testable acceptance criteria?
- Is the task small enough for Hermes to implement safely?

Return:
1. Summary
2. Architecture risks
3. Files likely to change
4. Acceptance checks
5. Improved task packet if needed
```

## First task packet for Hermes

```text
Task: Add local asset folder structure and manifest skeleton.

Read:
- 00_START_HERE.md
- 03_AGENT_OPERATING_RULES.md
- 04_LOCAL_3D_ASSET_WORKFLOW.md
- 05_FILE_STRUCTURE_AND_DATA_CONTRACTS.md
- 06_IMPLEMENTATION_LADDER.md

Objective:
Create the first safe foundation for local GLB/HDR/texture/audio assets without changing the current visuals.

Allowed changes:
- public/assets/**/.gitkeep
- src/experience/assets/assetManifest.js
- optionally AGENTS.md append only

Requirements:
- USE_EXTERNAL_ASSETS must default to false.
- Manifest entries must be disabled by default.
- No code should request missing files yet.
- npm run build must pass.
- No-scroll architecture must remain unchanged.
```
