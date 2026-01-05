---
title: TOC Level Filtering Example
description: Demonstrating toc_min_heading_level and toc_max_heading_level
sidebar_position: 62
toc_min_heading_level: 2
toc_max_heading_level: 4
---

# TOC Level Filtering

This page demonstrates how to filter which headings appear in the Table of Contents.

## Heading Level 2 - Included

This H2 heading should appear in the TOC.

### Heading Level 3 - Included

This H3 heading should appear in the TOC.

#### Heading Level 4 - Included

This H4 heading should appear in the TOC because we set `toc_max_heading_level: 4`.

##### Heading Level 5 - Excluded

This H5 heading should NOT appear in the TOC because the max level is 4.

###### Heading Level 6 - Excluded

This H6 heading should NOT appear in the TOC.

## Configuration

Set these frontmatter options to control TOC levels:

```yaml
toc_min_heading_level: 2  # Minimum depth (default: 2)
toc_max_heading_level: 4  # Maximum depth (default: 3)
```

### Default Behavior

By default, only H2 and H3 headings appear in the TOC. This page extends that to include H4 headings as well.

## Another H2 Section

This is another H2 section to demonstrate the TOC structure.

### Nested H3

With a nested H3.

#### And an H4

And even an H4 that appears in the TOC.
