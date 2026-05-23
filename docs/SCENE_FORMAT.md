# Scene Format

A scene corresponds to one textbook page. It is a JSON file in `src/scenes/`. The teacher's tap advances through the steps of the scene in order. When the last step is reached, the next tap moves to the next page (next scene).

## Anatomy of a scene

Every scene file has this shape:

```json
{
  "id": "silk_road",
  "page": 14,
  "title": "The Silk Road",
  "topic": "Trade routes between East and West",
  "steps": [
    { ... step 1 ... },
    { ... step 2 ... }
  ]
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Unique identifier, kebab-case, used in filenames and URLs |
| `page` | yes | Textbook page number this scene corresponds to |
| `title` | yes | Short title; shown briefly at scene start unless `showTitle: false` |
| `topic` | yes | One-line summary of the page's instructional goal. For authors only; not displayed |
| `showTitle` | no | Set to `false` to suppress the title card |
| `steps` | yes | Ordered list of visual changes |

## Step types

Each step has a `type` field. Below are the step types supported in MVP. Add new types only by adding a new primitive component and updating `src/types/scene.ts`.

### `set_background`

Sets the background of the scene. Usually the first step.

```json
{ "type": "set_background", "asset": "asia_europe_map" }
```

`asset` references a file in `src/assets/` without extension; the loader resolves `.svg`.

### `highlight_region`

Highlights a named region on the current background. The region must be defined in the background SVG with `id="<region_id>"`.

```json
{
  "type": "highlight_region",
  "region": "china",
  "label": "China",
  "color": "amber",
  "duration": 1200
}
```

### `trace_route`

Traces a route across the map, drawing a line between named waypoints.

```json
{
  "type": "trace_route",
  "from": "xian",
  "to": "rome",
  "via": ["samarkand", "tehran", "antioch"],
  "duration": 4000,
  "color": "amber",
  "label": "The Silk Road"
}
```

`from`, `to`, and entries in `via` are waypoint IDs defined in the background SVG. `duration` defaults to 4000ms. `label` appears at route midpoint after the trace completes.

### `timeline_marker`

Drops a marker onto a timeline at the bottom of the scene. The timeline is created automatically the first time a `timeline_marker` step appears.

```json
{
  "type": "timeline_marker",
  "year": "130 BCE",
  "event": "Han dynasty opens route"
}
```

### `cause_effect_node`

Adds a node to a cause-effect chain. Nodes are connected in the order they are added. A new chain is created automatically when the first node appears.

```json
{
  "type": "cause_effect_node",
  "text": "Silk production in China",
  "icon": "silk"
}
```

### `annotation`

Adds a free-floating text annotation on the current scene.

```json
{
  "type": "annotation",
  "text": "Silk · spices · ideas · religion",
  "position": "midpoint",
  "duration": 800
}
```

`position` is `"midpoint"`, `"top"`, `"bottom"`, or a specific `{ x, y }` coordinate.

### `clear`

Clears all current visuals (fade out) and returns to a blank scene. Use sparingly; usually a page should accumulate rather than reset.

```json
{ "type": "clear" }
```

## Optional fields available on every step

| Field | Description |
|-------|-------------|
| `autoAdvance` | If present (in ms), advances to the next step automatically after that delay. Use sparingly; teachers prefer to control pacing |
| `pauseAfter` | Minimum ms before a tap can advance from this step. Use to prevent accidental skipping during long animations like `trace_route` |
| `note` | Author's note about why this step exists. Not displayed; treat it as required documentation |

## A complete example

See `src/scenes/silk_road.example.json` for a complete, annotated scene.

## Authoring checklist

Before committing a new scene, verify:

- [ ] Every step has a clear instructional reason (write it in `note`)
- [ ] No step exists purely for visual interest or atmosphere
- [ ] Total scene length is 6–12 steps (longer means the page is doing too much)
- [ ] The scene was viewed on a real projector before commit
- [ ] Colors and stroke widths are readable from the back of a classroom
- [ ] No proper nouns or claims are made that aren't on the textbook page
- [ ] No depiction of crowds, faces, violence, or dramatic reenactments

## Adding a new step type

If a textbook page genuinely requires a visual that doesn't fit any existing step type:

1. Discuss the addition before writing code. Adding step types is a high-cost decision because every step type becomes a permanent contract.
2. Add the type to `src/types/scene.ts`
3. Build the primitive in `src/primitives/`
4. Wire it into the player
5. Add it to this document with an example
6. Add it to the `/dev` view

Most pages can be expressed with the existing step types. Resist adding new ones for one-off needs.
