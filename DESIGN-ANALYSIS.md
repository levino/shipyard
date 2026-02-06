# Shipyard Design Analysis - Issues & Improvement Proposals

Analysis of the demo sites (i18n, single-locale, versioned-docs) focused on visual and layout issues in the page builder components.

---

## 1. Footer Does Not Span Full Width / Color Mismatch with Sidebar

**Severity**: High
**Affected files**: `packages/base/astro/layouts/Page.astro`, `packages/base/astro/components/Footer.astro`

### Problem

The footer sits inside `.drawer-content`, which means on desktop (`lg:drawer-open`) it only spans the width of the main content area — the sidebar's width is excluded. The sidebar has `bg-base-100` while the footer uses either `bg-neutral` (dark style) or `bg-base-200` (light style). This creates a visible gap or color discontinuity: the sidebar column remains `bg-base-100` all the way down, while the footer next to it has a completely different background color.

**Visual effect**: On a docs page with a dark footer, you get a white sidebar strip on the left and a dark footer on the right. It looks broken — the footer appears to not go full-width.

### Root cause (Page.astro:111-144)

```
drawer (lg:drawer-open)
├── drawer-content           ← Footer lives HERE (excludes sidebar width)
│   ├── navbar
│   ├── main content
│   └── Footer               ← bg-neutral, but only covers drawer-content width
└── drawer-side
    └── SidebarNavigation     ← bg-base-100, extends full height, no footer
```

### Proposed fix

**Option A (Recommended)**: Move the footer outside the drawer entirely. Place it after the `.drawer` div so it naturally spans 100% viewport width.

```astro
<body>
  <div class="drawer lg:drawer-open">
    <div class="drawer-content overflow-x-hidden">
      <div class="flex min-h-screen flex-col">
        <GlobalDesktopNavigation ... />
        <div class="grow">
          <slot />
        </div>
        <!-- Footer removed from here -->
      </div>
    </div>
    <div class="drawer-side z-40">
      <SidebarNavigation ... />
    </div>
  </div>
  <Footer />  <!-- Now spans full viewport width -->
</body>
```

Note: This requires adjusting the `min-h-screen` strategy so the footer is still pushed to the bottom (e.g., make the body itself a flex column with min-h-screen, and the drawer gets `flex-grow`).

**Option B**: Keep the footer inside drawer-content but extend it visually using negative margins and viewport-width tricks (`w-screen` with `relative` positioning or `calc(100vw)` width). More hacky but preserves the current DOM structure.

---

## 2. Sidebar Brand/Logo Overflows with Long Names

**Severity**: Medium
**Affected file**: `packages/base/astro/components/SidebarNavigation.astro:22`

### Problem

The brand name is rendered as:
```astro
<a href="..." class="btn btn-ghost mb-2 text-xl">{brand}</a>
```

The sidebar has a fixed width of `w-56` (224px). With a long brand name like "Metro Gardens" this is already tight. A longer name (e.g., "Metropolitan Community Gardens Association") will overflow or wrap awkwardly because:

- `btn btn-ghost` has no text truncation
- `text-xl` is a large font size for a 224px container
- No `truncate`, `overflow-hidden`, or `text-ellipsis` is applied
- No `max-w` constraint on the text

### Same issue in the navbar

In `GlobalDesktopNavigation.astro:39-46`:
```astro
<a href="/" class="btn btn-ghost text-xl">{brand}</a>
```

The navbar brand also has no truncation, but at least it sits in a `flex-1` container, so it has more room. Still, extremely long names will cause layout issues.

### Proposed fix

- Add `truncate` (or `overflow-hidden text-ellipsis whitespace-nowrap`) to the brand link in the sidebar
- Consider reducing font size in the sidebar to `text-lg` or making it responsive
- Add `max-w-full` to the brand container in the sidebar
- Optionally: support a `brandShort` config for the sidebar and use the full `brand` only in the navbar

---

## 3. Sidebar Desktop Visibility Quirk — Hidden When No Local Nav

**Severity**: High
**Affected file**: `packages/base/astro/components/SidebarNavigation.astro:20`

### Problem

```astro
<ul class={cn("menu min-h-screen w-56 bg-base-100", { "md:hidden": !local })}>
```

When there is no local sidebar navigation (e.g., on the "About" page or Splash page), the class `md:hidden` is added. However, the Page.astro layout always uses `drawer lg:drawer-open`. This means:

1. On desktop, the drawer is forced open (`lg:drawer-open`), but the sidebar content inside it is hidden (`md:hidden`).
2. The result is an empty sidebar column occupying 224px of space — the `drawer-side` element is still rendered and taking up layout space, but the `<ul>` inside it is hidden.
3. This creates dead whitespace on the left side of the page on non-docs views.

### Proposed fix

The `lg:drawer-open` class on the drawer should be conditional — only applied when there IS a local sidebar navigation. On pages without sidebar content (About, Splash), the drawer should remain closed/collapsed on desktop.

```astro
<!-- Page.astro -->
<div class={cn("drawer", { "lg:drawer-open": props.sidebarNavigation })}>
```

---

## 4. Navbar Brand Shows/Hides Inconsistently

**Severity**: Low-Medium
**Affected file**: `packages/base/astro/components/GlobalDesktopNavigation.astro:40-43`

### Problem

```astro
<a href="/" class={cn("btn btn-ghost text-xl", { "md:hidden": !showBrand })}>
  {brand}
</a>
```

The `showBrand` prop is set to `!props.sidebarNavigation` in Page.astro. So when a sidebar exists, the navbar brand is hidden at `md:` and above. The idea is: the sidebar already shows the brand, so the navbar doesn't need to repeat it.

But there's a breakpoint mismatch:
- The sidebar becomes visible at `lg:` (1024px) via `lg:drawer-open`
- The navbar brand is hidden at `md:` (768px) via `md:hidden`

Between 768px and 1024px, **neither** the sidebar brand **nor** the navbar brand is visible. The site appears brandless in this viewport range.

### Proposed fix

Change `md:hidden` to `lg:hidden` so the brand disappears from the navbar only when the sidebar (which also shows the brand) actually becomes visible:

```astro
<a href="/" class={cn("btn btn-ghost text-xl", { "lg:hidden": !showBrand })}>
```

---

## 5. Sidebar Global Nav Section — Mobile-Only Logic Is Confusing

**Severity**: Low-Medium
**Affected file**: `packages/base/astro/components/SidebarNavigation.astro:26-46`

### Problem

The global navigation items (Documentation, Blog, About, etc.) are inside a `block md:hidden` div in the sidebar. This means they only show on mobile. The assumption is that on tablet+ the top navbar already shows these items.

But between `md` (768px) and `lg` (1024px):
- The sidebar is accessible via hamburger (not auto-open yet)
- When the user opens the hamburger drawer, the global nav items are hidden (`md:hidden`)
- The desktop navbar IS visible with horizontal nav items — so this is mostly OK

However, there's a UX issue: the divider between global and local nav is also `md:hidden`, but the theme toggle and language switcher are ALSO inside this `block md:hidden` div. This means on tablet-sized screens (768px-1024px):
- Opening the sidebar shows only the local nav items
- No theme toggle or language switcher is visible in the sidebar
- The navbar shows these controls, so they're accessible — but it's inconsistent

### Proposed fix

Move the theme toggle and language switcher outside the `block md:hidden` div, or use `lg:hidden` instead of `md:hidden` to match the drawer's `lg:drawer-open` breakpoint.

---

## 6. Content Area Has No max-width Constraint

**Severity**: Medium
**Affected file**: `packages/base/astro/layouts/Page.astro:122-125`

### Problem

```astro
<div class="grow">
  <div class="mx-auto px-4">
    <slot />
  </div>
</div>
```

The main content wrapper only has `px-4` and `mx-auto` but no `max-w-*` constraint. The `mx-auto` does nothing without a max-width. On wide monitors, content stretches across the full viewport width (minus sidebar).

The Docs layout adds its own `max-w-7xl` inside the slot, but pages using the base layout directly (Splash pages, custom pages) get unbounded width. The Markdown layout wraps content in `prose mx-auto` which provides some constraint, but the container itself is still full-width.

### Proposed fix

Add a reasonable `max-w-7xl` (or similar) to the content wrapper in Page.astro:

```astro
<div class="mx-auto max-w-7xl px-4">
  <slot />
</div>
```

---

## 7. Sidebar `min-h-screen` Creates Scroll Issues

**Severity**: Low
**Affected file**: `packages/base/astro/components/SidebarNavigation.astro:20`

### Problem

```astro
<ul class="menu min-h-screen w-56 bg-base-100">
```

The sidebar uses `min-h-screen` to ensure it fills the viewport height. However, when the sidebar content itself is longer than the viewport (many docs sections, deeply nested nav), the `min-h-screen` is redundant and the sidebar doesn't scroll independently.

DaisyUI's `drawer-side` handles the sidebar scroll behavior, but the `min-h-screen` on the inner `<ul>` can cause the sidebar to extend beyond the drawer-side's scroll container in some edge cases.

### Proposed fix

Remove `min-h-screen` from the `<ul>` and instead ensure the `drawer-side` handles overflow properly:

```astro
<ul class={cn("menu w-56 bg-base-100 min-h-full", { "md:hidden": !local })}>
```

Use `min-h-full` instead, which fills the parent container without forcing viewport-height minimum.

---

## 8. Docs Grid Layout Doesn't Account for Sidebar Width

**Severity**: Low
**Affected file**: `packages/docs/astro/Layout.astro:340`

### Problem

```astro
<div class="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
```

The `max-w-7xl` (1280px) is applied to the docs content grid. But this content sits inside the `drawer-content` which already loses ~224px to the sidebar. On a 1440px monitor:

- Viewport: 1440px
- Sidebar: 224px
- Available for content: ~1216px
- `max-w-7xl` = 1280px → nearly fills all available space with little breathing room

On smaller desktop screens (1280px), the content area after sidebar is only ~1056px, and the 3-column grid (content + TOC) gets quite cramped.

### Proposed fix

Consider using a smaller max-width (e.g., `max-w-6xl` = 1152px) or removing the hard max-width and using padding to create breathing room. Alternatively, use `max-w-[calc(100%-2rem)]` or similar to be responsive to the available space.

---

## 9. Navbar `<details>` Dropdown Doesn't Close on Click Outside

**Severity**: Medium
**Affected file**: `packages/base/astro/components/GlobalDesktopNavigation.astro:53-61`

### Problem

The desktop navbar uses native HTML `<details>` elements for dropdown menus:

```astro
<details>
  <summary>{entry.label ?? key}</summary>
  <ul class="rounded-t-none bg-base-100 p-2">...</ul>
</details>
```

Native `<details>` elements don't close when clicking outside. Users must click the summary again to close the dropdown. This is a common usability issue — most navigation dropdowns close on click-outside or when clicking another dropdown.

### Proposed fix

Add a small script that closes open `<details>` dropdowns in the navbar when:
- Clicking outside the dropdown
- Opening a different dropdown
- Pressing Escape

Or switch to DaisyUI's dropdown component which handles this behavior by default.

---

## 10. Footer Copyright Renders Raw HTML

**Severity**: Low
**Affected file**: `packages/base/astro/components/Footer.astro:163`

### Problem

```astro
<div set:html={config.copyright} />
```

The copyright string is rendered with `set:html`, allowing HTML injection. While this enables rich formatting, it's a potential XSS vector if the config is ever populated from user input. For a page builder, config typically comes from the developer's `astro.config.mjs`, so this is low-risk but worth noting.

---

## 11. Sidebar Drawer Overlay Z-Index Conflicts

**Severity**: Low
**Affected files**: `packages/base/astro/layouts/Page.astro:131`, `packages/base/astro/components/GlobalDesktopNavigation.astro:12`

### Problem

- Navbar: `z-10`
- Drawer-side: `z-40`

On mobile, when the drawer is open, the sidebar overlay correctly covers the navbar (z-40 > z-10). But if there are any other z-indexed elements (modals, tooltips, sticky headers), the z-index values are arbitrary and could clash. There's no z-index scale/system in place.

### Proposed fix

Define a z-index scale in a CSS custom property or Tailwind config:
```css
--z-navbar: 10;
--z-sidebar: 40;
--z-overlay: 50;
--z-modal: 60;
```

---

## 12. Theme Toggle and Language Switcher Placement Inconsistency

**Severity**: Low-Medium
**Affected files**: `SidebarNavigation.astro`, `GlobalDesktopNavigation.astro`

### Problem

- **Desktop navbar**: Theme toggle and language switcher appear in the top-right after the menu items
- **Mobile sidebar**: Theme toggle and language switcher appear below the global navigation, inside the `block md:hidden` section

When the sidebar is open on desktop (docs pages), there is no theme toggle or language switcher visible in the sidebar — they're in `block md:hidden`. The user must use the navbar controls. This is fine for functionality but creates an inconsistency: on mobile, these controls are in the sidebar; on desktop, they're in the navbar.

For docs-heavy pages where the user is focused on the sidebar, having the theme toggle accessible there would be convenient.

---

## Summary — Priority Ranking

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 1 | Footer not full-width / color mismatch | High | Visually broken on every page with sidebar |
| 3 | Empty sidebar space on non-docs pages | High | Wastes 224px on About/Splash pages |
| 4 | Brandless viewport between md and lg | Medium | No brand visible in 768-1024px range |
| 2 | Brand name overflow in sidebar | Medium | Broken layout with long names |
| 6 | No max-width on base content area | Medium | Text spans full width on wide screens |
| 9 | Dropdown doesn't close on click outside | Medium | Poor UX for nav dropdowns |
| 5 | Sidebar controls hidden at wrong breakpoint | Low-Med | Missing theme/lang controls in sidebar |
| 12 | Theme/lang placement inconsistency | Low-Med | UX inconsistency between mobile/desktop |
| 7 | Sidebar min-h-screen scroll issue | Low | Edge case with long navigation trees |
| 8 | Docs grid max-width vs available space | Low | Slightly cramped on smaller desktops |
| 10 | Copyright raw HTML rendering | Low | Minor security consideration |
| 11 | Z-index without system | Low | Potential future conflicts |
