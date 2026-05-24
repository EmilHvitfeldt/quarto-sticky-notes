# quarto-sticky-notes

A Quarto extension that turns `.sticky` fenced divs into styled sticky-note
boxes. HTML and Reveal.js only.

## Install

```bash
quarto add emilhvitfeldt/quarto-sticky-notes
```

Then add the filter to your document or `_quarto.yml`:

```yaml
filters:
  - sticky-notes
```

## Usage

```markdown
::: {.sticky}
A default yellow square sticky note, inline in the page flow.
:::

::: {.sticky color="pink"}
A pink one.
:::

::: {.sticky color="#c8e6c9" top="120px" left="40%" width="18em" tilt="-3"}
Positioned, sized, tilted, custom hex background.
:::
```

## Attributes

| attr     | values                                            | default            |
|----------|---------------------------------------------------|--------------------|
| `color`  | named (`yellow`, `pink`) or hex (`#abcdef`)       | `yellow`           |
| `top`    | any CSS length                                    | —                  |
| `left`   | any CSS length                                    | —                  |
| `width`  | any CSS length                                    | square (12em)      |
| `height` | any CSS length                                    | square (12em)      |
| `tilt`   | number, degrees (may be negative)                 | `0`                |

- A sticky with neither `width` nor `height` renders as a 12em square.
  Setting either one switches to a freeform rectangle that grows with its
  content.
- A sticky with no `top`/`left` flows inline as a styled block.
- A sticky with either `top` or `left` becomes absolutely positioned. In
  plain HTML it anchors to the page `<body>`; in Reveal.js it anchors to
  the current slide section so it stays with the slide.
- Initial stacking follows source order — later stickies cover earlier ones.
- Text color and font are inherited from the surrounding document.

Unknown named colors fall back to yellow and emit a render-time warning.

## Interactivity

Stickies are draggable: click and drag to reposition. The active sticky
rises to the top of the stack. Positions are not persisted — a reload
restores the original layout.

## Example

See `docs/example.qmd` and `docs/example-revealjs.qmd`.
