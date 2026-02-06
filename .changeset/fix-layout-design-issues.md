---
'@levino/shipyard-base': patch
---

Fixed multiple layout and design issues in the page builder:

- Footer now spans full viewport width instead of being constrained to the drawer-content area, fixing the color mismatch between sidebar and footer
- Sidebar drawer only opens on desktop when there is actual sidebar content, eliminating 224px of dead whitespace on pages like About or Splash
- Brand name in navbar stays visible between 768-1024px viewports where the sidebar isn't yet shown
- Long brand names in the sidebar are now properly truncated instead of overflowing
- Main content area has a max-width constraint preventing text from stretching across ultra-wide screens
- Navbar dropdown menus now close when clicking outside or pressing Escape
- Sidebar breakpoints aligned to lg (1024px) to match the drawer-open breakpoint, fixing missing theme/language controls in the 768-1024px range
- Sidebar uses min-h-full instead of min-h-screen for proper scroll behavior
