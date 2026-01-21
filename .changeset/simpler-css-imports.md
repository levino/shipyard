---
"@levino/shipyard-base": patch
"@levino/shipyard-blog": patch
"@levino/shipyard-docs": patch
---

You can now use a simpler CSS import syntax in your Tailwind CSS 4 setup. Instead of manually adding `@source` directives for each package, simply import the packages directly:

```css
@import "tailwindcss";

@import "@levino/shipyard-base";
@import "@levino/shipyard-blog";
@import "@levino/shipyard-docs";

@plugin "daisyui";
@plugin "@tailwindcss/typography";
```

Each package now includes its own `@source` directives, so Tailwind automatically scans the package components for CSS classes. This eliminates the need for path-based `@source` directives that could break in different project structures.
