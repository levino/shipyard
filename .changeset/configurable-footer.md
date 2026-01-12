---
"@levino/shipyard-base": patch
---

Add configurable footer with Docusaurus-like API

You can now customize your site's footer with links, copyright notice, and styling. Shipyard supports both simple (single row) and multi-column footer layouts, similar to Docusaurus.

**Simple footer:**
```javascript
shipyard({
  footer: {
    links: [
      { label: 'Documentation', to: '/docs' },
      { label: 'GitHub', href: 'https://github.com/myorg/myrepo' },
    ],
    copyright: 'Copyright © 2025 My Company.',
  },
})
```

**Multi-column footer:**
```javascript
shipyard({
  footer: {
    style: 'dark',
    links: [
      {
        title: 'Docs',
        items: [
          { label: 'Getting Started', to: '/docs' },
        ],
      },
    ],
    copyright: 'Copyright © 2025 My Company.',
  },
})
```

The footer also includes a "Built with Shipyard" branding link by default, which can be hidden with `hideBranding: true`.
