---
'@levino/shipyard-blog': patch
---

Fixed circular dependency warning in blog package that caused Vite warnings during build about exports being "reexported through module while both modules are dependencies of each other".
