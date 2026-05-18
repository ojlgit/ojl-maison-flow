# QA Report Template

## Build

```txt
npm run build: pass/fail
notes:
```

## Browser/device

```txt
Device:
Browser:
Viewport:
Quality mode:
```

## No-scroll checks

```js
window.scrollY === 0
// result:

document.documentElement.scrollHeight === window.innerHeight
// result:

document.querySelectorAll('canvas').length === 1
// result:
```

## Input checks

```txt
Wheel forward:
Wheel backward:
Touch:
Keyboard:
Progress dots:
```

## Visual checks

```txt
Room 1 visible:
Room 2 visible:
Room 3 visible:
Room 4 visible:
Room 5 visible:
Products centered:
Transitions smooth:
UI updates:
```

## Console

```txt
Errors:
Warnings:
Missing asset requests:
```

## Performance

```txt
Draw calls:
Triangles:
Textures:
Geometries:
FPS impression:
Memory stable after loop:
```

## Asset checks

```txt
Asset IDs tested:
Fallback tested:
Real GLB tested:
Material classes correct:
Scale/orientation correct:
```

## Approval

```txt
Approved:
Approved with notes:
Rejected:
Reviewer:
Date:
```
