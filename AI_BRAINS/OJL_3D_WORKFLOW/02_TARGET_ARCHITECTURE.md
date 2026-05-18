# 02 - Target Architecture

## High-level architecture

```txt
User input
  -> InputProgressController
    -> virtualProgress 0..1
      -> CameraRig
      -> ActiveRoomController
      -> UIController
      -> AudioManager
      -> AssetStreaming/VisibilityController

Renderer
  -> one THREE.WebGLRenderer
  -> one canvas
  -> one main Scene
  -> rooms placed along negative Z
  -> products and room assets loaded from manifest or procedural fallback
```

## Runtime layers

### Core layer

Owns renderer, scene, camera, clock, resize, DPR, tone mapping, animation loop, and disposal helpers.

Rules:

- Only one renderer is created.
- Renderer is initialized once.
- Canvas stays fixed full-screen.
- Renderer size updates on resize.
- DPR is clamped by quality mode.
- Disposal helpers are used when unloading/replacing real GLBs.

### Input progress layer

Converts wheel, touch, keyboard, and progress dot events into normalized `targetProgress`.

Rules:

- `window.scrollY` must remain 0.
- Do not rely on document scroll progress.
- Input must be smoothed.
- Touch gestures must not create document bounce when possible.
- Progress must be clamped between 0 and 1.

### Camera layer

Moves the camera forward through rooms.

Rules:

- Camera follows virtual progress, not physical scroll.
- Camera path is data-driven.
- Position and look-at target are separate.
- Each room has entrance, hero, and exit camera beats.
- Movement should be slow, smooth, and premium.
- Camera should never clip through real room assets unless that transition is designed.

### Room layer

Creates room containers along the Z axis. Each room can contain procedural fallback geometry and/or loaded real GLB assets.

Rules:

- Rooms are data-driven.
- Room positions are controlled by `roomDefinitions.js`.
- Real room GLBs attach to room containers.
- Procedural fallback remains available.
- Far rooms may be simplified/hidden for performance.

### Asset layer

Loads GLBs, textures, HDRI, material presets, and future audio according to a manifest.

Rules:

- Renderer code asks the asset registry for assets; it does not hard-code paths.
- Manifest is the source of truth.
- Missing or disabled real assets use procedural fallback.
- Asset loading must be async-safe.
- No unhandled promise rejections.
- No missing asset requests in default mode.
- Asset references are versioned.

### Material and lighting layer

Defines OJL material presets and environment lighting.

Rules:

- Jewelry metal should use `MeshPhysicalMaterial` or carefully tuned PBR materials.
- Use HDR/environment lighting for reflective metals and glass.
- Diamonds/gems should use simplified transmissive/physical materials until custom shader work is justified.
- Material overrides should be keyed by mesh/material names, not random traversal hacks.

### UI/audio layer

UI observes active room and asset states. Audio crossfades by active room but starts only after user gesture.

Rules:

- Sound is off by default.
- No autoplay errors.
- UI must remain usable without WebGL audio.
- Progress dots change virtual progress, not document scroll.
