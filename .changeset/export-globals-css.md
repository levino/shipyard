---
"@levino/shipyard-base": patch
---

Export globals.css from package for custom layouts

You can now import the global styles directly when creating custom layouts:

```javascript
import '@levino/shipyard-base/globals.css'
```

This is useful when creating custom page layouts that don't use the built-in Shipyard layouts but still need the base styles.
