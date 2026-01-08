---
title: Migration from v1
description: Guide for upgrading from v1 to v2
sidebar_position: 3
---

# Migration Guide: v1 to v2

This guide helps you upgrade from v1 to v2.

## Breaking Changes

### Node.js Version

v2 requires Node.js 18 or higher:

```bash
# Check your Node.js version
node --version

# Update if needed
nvm install 18
nvm use 18
```

### Configuration Format

The configuration format has changed:

**v1 (Old)**
```javascript
shipyard({
  siteTitle: 'My Site',
  siteTagline: 'Welcome',
})
```

**v2 (New)**
```javascript
shipyard({
  title: 'My Site',
  tagline: 'Welcome',
})
```

### Content Structure

If you're using versioned docs, update your content structure:

```
docs/
├── v2/
│   ├── index.md
│   └── guide.md
└── v1/           # Keep old version
    ├── index.md
    └── guide.md
```

## Migration Steps

1. **Update dependencies**
   ```bash
   npm update @levino/shipyard-base @levino/shipyard-docs
   ```

2. **Update configuration** following the new format above

3. **Test your build**
   ```bash
   npm run build
   ```

4. **Review deprecation warnings** and address any issues

## Getting Help

If you encounter issues during migration:

- Check the [v2 documentation](/docs/v2/index)
- Review the [changelog](#)
- Open an issue on GitHub
