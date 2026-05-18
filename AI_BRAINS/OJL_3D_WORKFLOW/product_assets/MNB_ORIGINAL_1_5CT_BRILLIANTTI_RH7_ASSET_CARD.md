# Product Asset Card - MNB Original 1.5ct Brilliantti RH7

## Asset ID

```txt
mnbOriginal15ctBrillianttiRh7
```

## Source file received in chat

```txt
MNB Original 1,5ct Brilliantti 1-1 RH7.3dm
```

## Security / repository rule

Do not commit the raw `.3dm` source file into this public repository unless the human lead explicitly approves it.

Recommended local-only source location:

```txt
assets_source/products/mnb-original-1-5ct-brilliantti-rh7/MNB Original 1,5ct Brilliantti 1-1 RH7.3dm
```

Recommended runtime output location after conversion and optimization:

```txt
public/assets/models/products/mnb-original-1-5ct-brilliantti-rh7.v001.glb
```

## File inspection notes

The uploaded file is a Rhino/OpenNURBS `.3dm` source model. Header inspection showed:

```txt
3D Geometry File Format 70
Rhinoceros 8.14
3dm Version: 7
File size: approximately 3.4 MB
```

Visible embedded material names from the file strings include:

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

These names must be treated as source material clues only. The web runtime should use explicit material override rules after GLB export.

## Runtime role

This product should be treated as a hero jewelry GLB.

Rules:

- It should sit at the room hero anchor: `ANCHOR_product_hero`.
- It should be the first visual priority in the camera hero beat.
- Floors, plinths, backgrounds, and ComfyUI-generated assets must support it, not compete with it.
- The actual product geometry should come from this approved product file after conversion to GLB.
- ComfyUI must not invent or replace the final product geometry.

## Target manifest entry

```js
mnbOriginal15ctBrillianttiRh7: {
  id: 'mnbOriginal15ctBrillianttiRh7',
  enabled: false,
  type: 'product',
  path: '/assets/models/products/mnb-original-1-5ct-brilliantti-rh7.v001.glb',
  fallback: 'proceduralRing',
  materialPreset: 'whiteGoldDiamondHero',
  scale: 1,
  position: [0, 1.35, 0],
  rotation: [0, 0, 0],
  castShadow: true,
  receiveShadow: false,
  hotspots: [
    {
      id: 'centerStone',
      label: 'Center brilliant diamond',
      attachTo: 'HOTSPOT_center_stone',
      fallbackPosition: [0, 0.35, 0],
      text: 'Hero stone detail. Use the real GLB geometry, not generated replacement detail.'
    },
    {
      id: 'whiteGoldSetting',
      label: 'White gold setting',
      attachTo: 'HOTSPOT_white_gold_setting',
      fallbackPosition: [0.32, 0.12, 0],
      text: 'White gold material should use a controlled reflective MeshPhysicalMaterial override.'
    }
  ]
}
```

## Required export cleanup in Rhino / MatrixGold

Before export, create a web-display copy of the product file.

Checklist:

- [ ] Keep source `.3dm` untouched.
- [ ] Duplicate into an export working file.
- [ ] Remove manufacturing-only curves, annotations, dimensions, hidden references, and construction geometry unless needed visually.
- [ ] Keep real product surfaces/meshes required for visual accuracy.
- [ ] Confirm model units and scale.
- [ ] Set product pivot/origin to a useful hero center.
- [ ] Add or preserve clean material/layer separation.
- [ ] Create named anchor empties/points if possible:
  - `ANCHOR_product_hero`
  - `HOTSPOT_center_stone`
  - `HOTSPOT_white_gold_setting`
  - `HOTSPOT_side_stones` if present
- [ ] Rename export materials to web-friendly names:
  - `MAT_white_gold_14k`
  - `MAT_diamond_clear`
  - `MAT_yellow_gold_14k`
  - `MAT_opal_white`
  - `MAT_pearl_white`
- [ ] Export GLB with material groups preserved.
- [ ] Create LODs if the hero model is too heavy.

## Material override targets

### White Gold 14k

Runtime material should be reflective but not flat chrome.

Suggested starting values:

```txt
metalness: 1.0
roughness: 0.14 - 0.24
color: cool off-white metal
clearcoat: optional subtle
normal/bump: very subtle only
```

### Diamond

Runtime material should be handled as a hero gem material.

Suggested starting values:

```txt
transmission: high
ior: approximately diamond-like
roughness: very low
thickness: tuned visually
color: near white
extra sparkle: restrained, optional, shader/post effect only after baseline
```

### Yellow Gold 14k

Use only if visible in the final product.

Suggested starting values:

```txt
metalness: 1.0
roughness: 0.12 - 0.22
color: warm champagne/gold, not saturated yellow
```

## Runtime quality target

- Hero GLB compressed size: ideally under 5-8 MB.
- Secondary/mobile LOD: ideally 1-3 MB.
- Materials remain separate by class.
- Product must look sharp in close-up.
- The model must not dominate memory or frame time.

## ComfyUI support pack

ComfyUI should generate supporting art around this product, not the product itself.

Recommended first room pack:

```txt
Room: Geometry Vault
Hero: mnbOriginal15ctBrillianttiRh7
ComfyUI outputs:
- ivory stone floor texture candidate
- warm plaster alcove wall texture candidate
- arch glow light mask
- subtle boutique background plate
- soft table/plinth light mask
```

Negative rule:

```txt
Do not generate fake diamond ring details to replace the product geometry.
```

## QA acceptance

- [ ] GLB loads through asset manifest.
- [ ] Fallback appears when GLB is disabled or missing.
- [ ] Product is centered at hero camera beat.
- [ ] No page scroll returns.
- [ ] One canvas only.
- [ ] Console has no missing asset errors in default mode.
- [ ] Material overrides recognize exported material names.
- [ ] Product reads as high-quality jewelry on desktop.
- [ ] Mobile quality mode remains usable.
