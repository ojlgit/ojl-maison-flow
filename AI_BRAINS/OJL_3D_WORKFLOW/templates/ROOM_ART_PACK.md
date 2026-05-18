# Room Art Pack Template

## Room ID

[example: geometry-vault]

## Hero product

Product asset key:

```txt
[example: ringGeometry]
```

Hero rule:

```txt
The room exists to make this jewelry product feel valuable, clear, and central. All generated art components must support this product.
```

## Room mood

```txt
[Describe the emotional and material atmosphere.]
```

## Components

### Floor

```txt
component id:
type:
runtime path:
source brief:
material maps:
notes:
```

### Plinth / table

```txt
component id:
3D asset path or procedural fallback:
texture path(s):
hero anchor:
notes:
```

### Walls

```txt
component id:
texture/background path:
material type:
notes:
```

### Background / sky plate

```txt
component id:
runtime path:
plane placement:
should be blurred: yes/no
notes:
```

### Arch / portal / transition

```txt
component id:
3D asset or procedural fallback:
light mask path:
notes:
```

### Light masks

```txt
component id:
runtime path:
usage: alpha/emissive/projected/overlay
notes:
```

### Cutouts / depth cards

```txt
component id:
runtime path:
placement:
opacity target:
notes:
```

### Optional video loop

```txt
component id:
video path:
fallback still path:
loop duration:
notes:
```

## Camera notes

```txt
entrance beat:
hero beat:
exit beat:
product must be visible at:
```

## WebGL placement notes

```txt
z position:
product anchor:
scale notes:
parallax notes:
mobile simplification:
```

## QA checklist

- [ ] Product remains center of attention.
- [ ] No AI text/logos/artifacts.
- [ ] No copied brand identity.
- [ ] Background does not compete with jewelry.
- [ ] Floor/plinth scale feels believable.
- [ ] Assets are optimized.
- [ ] Manifest entries exist.
- [ ] Mobile version is acceptable.
- [ ] No missing asset console errors.
