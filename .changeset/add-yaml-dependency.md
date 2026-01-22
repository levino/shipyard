---
'@levino/shipyard-blog': patch
---

The `yaml` dependency is now correctly declared in package.json. This fixes build failures in clean environments (e.g., Docker) where transitive dependencies aren't available.
