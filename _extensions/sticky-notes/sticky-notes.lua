-- quarto-sticky-notes: render .sticky divs for HTML / revealjs.

local NAMED_HEX = {
  yellow = "fff7a8",
  pink   = "ffc1d4",
}

local POS_ATTRS  = { "top", "left", "width", "height" }
local SIZE_ATTRS = { "width", "height" }
local OUR_ATTRS  = { "color", "top", "left", "width", "height", "tilt" }

local function is_hex(s)
  return type(s) == "string" and s:sub(1, 1) == "#"
end

local function resolve_color(c)
  c = c or "yellow"
  if is_hex(c) then return "hex", c:sub(2):lower() end
  if NAMED_HEX[c] then return "named", c end
  quarto.log.warning("sticky-notes: unknown color '" .. c .. "', falling back to yellow")
  return "named", "yellow"
end

local function strip_our_attrs(el)
  for _, k in ipairs(OUR_ATTRS) do el.attributes[k] = nil end
end

local css_added = false
local function ensure_css()
  if css_added then return end
  quarto.doc.add_html_dependency({
    name = "sticky-notes",
    version = "0.1.0",
    stylesheets = { "sticky-notes.css" },
    scripts = { "sticky-notes.js" },
  })
  css_added = true
end

local function html_for(el)
  ensure_css()
  local styles = {}
  local kind, val = resolve_color(el.attributes.color)
  if kind == "hex" then
    table.insert(styles, "--sticky-bg:#" .. val)
  else
    el.classes:insert("sticky-" .. val)
  end

  if not el.attributes.width and not el.attributes.height then
    el.classes:insert("square")
  end

  local positioned = el.attributes.top or el.attributes.left
  if positioned then
    el.classes:insert("sticky-positioned")
    for _, k in ipairs(POS_ATTRS) do
      if el.attributes[k] then
        table.insert(styles, k .. ":" .. el.attributes[k])
      end
    end
  else
    for _, k in ipairs(SIZE_ATTRS) do
      if el.attributes[k] then
        table.insert(styles, k .. ":" .. el.attributes[k])
      end
    end
  end

  if el.attributes.tilt then
    table.insert(styles, "transform:rotate(" .. el.attributes.tilt .. "deg)")
  end

  if #styles > 0 then
    local existing = el.attributes.style
    local new = table.concat(styles, ";")
    el.attributes.style = existing and (existing .. ";" .. new) or new
  end

  strip_our_attrs(el)
  return el
end

local warned_unsupported = false

function Div(el)
  if not el.classes:includes("sticky") then return nil end

  if quarto.doc.is_format("html") then return html_for(el) end

  if not warned_unsupported then
    quarto.log.warning("sticky-notes: only HTML formats are supported; rendering contents unstyled")
    warned_unsupported = true
  end
  return el.content
end
