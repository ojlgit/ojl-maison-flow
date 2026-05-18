# Task Packet Template

## Task title

[Example: Add safe GLB loader with procedural fallback]

## Agent

[Hermes / Gemma / both]

## Objective

[One paragraph. What should be true after this task?]

## Relevant brain files to read

- `00_START_HERE.md`
- `03_AGENT_OPERATING_RULES.md`
- `[add task-specific files]`

## Allowed files to change

```txt
[path]
[path]
```

## Files not allowed to change

```txt
[path]
[path]
```

## Requirements

- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

## Non-negotiables

- One canvas.
- No page scroll.
- Procedural fallback remains.
- No missing asset requests in default mode.
- `npm run build` must pass.

## Acceptance checks

```bash
npm run build
```

Browser checks if available:

```js
window.scrollY === 0

document.documentElement.scrollHeight === window.innerHeight

document.querySelectorAll('canvas').length === 1
```

## Required report format

```txt
Task:
Files changed:
Checks run:
Known issues:
Next recommended task:
```
