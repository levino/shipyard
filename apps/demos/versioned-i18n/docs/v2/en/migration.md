---
title: Migration to v2
description: How to migrate from v1 to v2
sidebar_position: 3
---

# Migration Guide: v1 to v2

This guide helps you upgrade from v1 to v2.

## Overview

v2 brings significant improvements while maintaining backward compatibility where possible.

## Breaking Changes

1. **Node.js 18+ required**: v2 drops support for Node.js 16
2. **Configuration changes**: Some config options have been renamed
3. **Import paths**: Some imports have changed

## Step-by-Step Migration

### 1. Update Dependencies

```bash
npm install @levino/shipyard-base@latest @levino/shipyard-docs@latest
```

### 2. Update Configuration

```diff
// astro.config.mjs
- import { shipyard } from '@levino/shipyard-base'
+ import shipyard from '@levino/shipyard-base'
```

### 3. Update Content

Review your content for deprecated features and update accordingly.

## Getting Help

If you encounter issues during migration:

1. Check the [Configuration Guide](/en/docs/v2/configuration)
2. Review the [v1 documentation](/en/docs/v1/) for reference
