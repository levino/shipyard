---
'@levino/shipyard-base': minor
---

You can now enable broken link detection during production builds. Shipyard automatically scans your built HTML files for internal links that point to non-existent pages, helping you catch issues before deploying.

Configure the behavior with the new `onBrokenLinks` option:

```javascript
shipyard({
  // ... other options
  onBrokenLinks: 'throw', // fail build on broken links
})
```

Available values:
- `'ignore'` - Don't check for broken links
- `'log'` - Log broken links but continue build
- `'warn'` - Log warnings (default)
- `'throw'` - Fail the build on broken links
