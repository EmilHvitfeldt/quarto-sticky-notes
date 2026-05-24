# quarto-sticky-notes

A Quarto extension that turns `.sticky` fenced divs into styled sticky-note
boxes in HTML output.

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
A default yellow sticky note, inline in the page flow.
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
| `width`  | any CSS length                                    | CSS default        |
| `height` | any CSS length                                    | grows with content |
| `tilt`   | number, degrees (may be negative)                 | `0`                |

- A sticky with no `top`/`left` flows inline as a styled block.
- A sticky with either `top` or `left` becomes absolutely positioned,
  anchored to the page `<body>`.
- Stacking follows source order — later stickies cover earlier ones.
- Text color and font are inherited from the surrounding document.

Unknown named colors fall back to yellow and emit a render-time warning.

## Limitations

- **Reveal.js**: positioned stickies anchor to `<body>`, so they sit on top
  of the deck rather than inside a slide. Use inline (non-positioned)
  stickies inside slides.
- **LaTeX / Typst**: not implemented in v0.1. The filter passes the sticky's
  contents through unstyled and warns once per render.

## Example

See `example/example.qmd`.
