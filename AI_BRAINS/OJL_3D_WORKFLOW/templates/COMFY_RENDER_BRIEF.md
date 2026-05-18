# ComfyUI Render Brief Template

## Brief ID

[example: room02-floor-ivory-stone-v001]

## Room ID

[example: geometry-vault]

## Component type

[floor / wall / plinth / background-plate / sky / cutout / light-mask / video-loop / material-reference]

## Purpose in WebGL scene

[Describe exactly how this will be used. Example: low-contrast ivory stone floor texture under the hero ring plinth.]

## Hero product relationship

Hero product asset key:

```txt
[example: ringGeometry]
```

The generated asset must support the jewelry by:

- keeping contrast lower than the product
- avoiding distracting detail behind the product
- leaving clean negative space around the product silhouette
- not inventing product details

## Visual direction

```txt
Premium OJL luxury gallery, warm champagne light, ivory stone, subtle natural imperfections, quiet material richness, cinematic but restrained.
```

## Positive prompt

```txt
[Write the ComfyUI generation prompt here. Avoid brand names and copyrighted references.]
```

## Negative prompt

```txt
logos, text, watermark, brand names, distorted jewelry, fake product, noisy pattern, cheap plastic, neon, cartoon, gaming style, overexposed, low resolution, harsh contrast, copied luxury brand design
```

## Composition rules

- output should leave product-safe center space: yes/no
- should tile: yes/no
- expected camera angle:
- desired crop/aspect ratio:
- background depth level:

## Technical target

Runtime format:

```txt
webp / avif / png / mp4 / glb reference only
```

Target dimensions:

```txt
[example: 2048x2048 for floor texture, 2560x1440 for background plate]
```

Runtime path:

```txt
public/assets/textures/ai/[category]/[filename]
```

## Workflow to use

```txt
Flux / Flux Fill / Qwen inpainting / SAM3 / BiRefNet / upscale / LTX / Wan / other
```

## Inputs

```txt
input image path(s):
mask path(s):
reference image path(s):
```

## Output candidates

```txt
assets_source/comfy/candidates/[room-id]/[component-type]/
```

## Selection criteria

- premium and restrained
- no text/logo artifacts
- no copied brand identity
- does not compete with jewelry
- clean enough for runtime use
- can be cropped/compressed
- visually matches room spec

## Approved output

```txt
selected file:
runtime file:
manifest key:
```

## Notes

[Add seed, workflow, model, node notes, and known issues.]
