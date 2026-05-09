---
'@levino/shipyard-base': patch
---

You can now use the German gender colon (e.g. `Organisator:innen`, `Ordner:innen`, `Anwohner:innen`) in your markdown without it tearing paragraphs apart. Previously the `:innen` suffix was parsed as an inline directive and rendered as an empty `<div>`, which broke the surrounding paragraph. Inline `:name` directives are no longer recognised — block directives like `:::note` admonitions still work as before.
