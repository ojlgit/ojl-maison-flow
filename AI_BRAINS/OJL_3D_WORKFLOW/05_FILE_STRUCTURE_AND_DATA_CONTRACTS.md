# 05 - File Structure and Data Contracts

## Target source structure

```txt
src/experience/
  assets/
    assetManifest.js
    AssetRegistry.js
    loadGLB.js
    loadTexture.js
    loadEnvironment.js
    applyMaterialOverrides.js
    assetValidationRuntime.js
  camera/
    CameraRig.js
    cameraPaths.js
  core/
    createExperience.js
    createRenderer.js
    disposeObject3D.js
    resizeRenderer.js
  input/
    InputProgressController.js
  rooms/
    roomDefinitions.js
    createRoomNode.js
    createRoomSequence.js
  fallback/
    products/
    rooms/
  materials/
    materialPresets.js
  ui/
  audio/
```

This can be introduced gradually. Do not force a massive rewrite in one patch.

## Public asset folders

```txt
public/assets/
  models/products/.gitkeep
  models/rooms/.gitkeep
  models/props/.gitkeep
  textures/materials/.gitkeep
  textures/baked/.gitkeep
  hdri/.gitkeep
  audio/.gitkeep
```

## Asset manifest contract

All real assets are declared in `assetManifest.js`.

```js
export const USE_EXTERNAL_ASSETS = false;

export const assetManifest = {
  products: {},
  rooms: {},
  props: {},
  environments: {},
  audio: {}
};
```

Default must be `USE_EXTERNAL_ASSETS = false` so the app makes no missing-file requests.

## Product asset entry

```js
ringGeometry: {
  id: 'ringGeometry',
  enabled: false,
  type: 'product',
  path: '/assets/models/products/ojl-ring-geometry.v001.glb',
  fallback: 'proceduralRing',
  materialPreset: 'ojlLuxuryGoldGem',
  scale: 1,
  position: [0, 1.35, 0],
  rotation: [0, 0, 0],
  castShadow: true,
  receiveShadow: false,
  hotspots: []
}
```

## Room asset entry

```js
geometryVault: {
  id: 'geometryVault',
  enabled: false,
  type: 'room',
  path: '/assets/models/rooms/ojl-room-geometry-vault.v001.glb',
  fallback: 'proceduralGeometryVault',
  scale: 1,
  position: [0, 0, -18],
  rotation: [0, 0, 0],
  markers: {
    productAnchor: 'ANCHOR_product_hero',
    cameraHero: 'CAM_hero',
    lookHero: 'LOOK_hero'
  }
}
```

## Room definition contract

`roomDefinitions.js` maps the story flow to assets:

```js
{
  id: 'geometryVault',
  index: 1,
  z: -18,
  roomAsset: 'geometryVault',
  productAsset: 'ringGeometry',
  fallbackRoom: 'proceduralGeometryVault',
  fallbackProduct: 'proceduralRing',
  eyebrow: 'Geometry',
  title: 'Precision held in balance.',
  body: 'A sculptural form suspended between shadow, reflection, and light.',
  camera: {
    entrance: [0.4, 1.45, -11],
    hero: [0.05, 1.28, -15.5],
    exit: [-0.2, 1.5, -23],
    lookEntrance: [0, 1.2, -18],
    lookHero: [0, 1.25, -18],
    lookExit: [0, 1.2, -26]
  }
}
```

## Asset registry responsibilities

- read manifest
- decide whether external assets are enabled
- load GLB only when allowed
- return procedural fallback when disabled/missing
- cache loaded assets
- clone assets safely when reused
- expose load state for UI/debugging
- prevent unhandled errors

## Runtime mode contract

The project must support:

1. `procedural` mode: no external assets requested.
2. `mixed` mode: enabled assets load, disabled/missing assets use fallbacks.
3. `production` mode: all required assets enabled and validated.
