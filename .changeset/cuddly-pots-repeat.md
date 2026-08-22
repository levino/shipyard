---
'@levino/shipyard-base': patch
'@levino/shipyard-docs': patch
'@levino/shipyard-blog': patch
---

Fixes the `@levino/shipyard-base/astro` entrypoint, which could not be imported at all. It pointed at `./astro/components` and `./astro/layouts` from inside `src/`, but those directories sit one level up, so `import { components } from '@levino/shipyard-base/astro'` always failed to resolve.

The docs frontmatter schema now actually describes your frontmatter. `z.infer<typeof docsSchema>` was silently resolving to `unknown`, so anything reading a docs entry's `data` got no type safety at all.

shipyard's remark plugins now declare the packages whose type augmentations they rely on (`remark-parse`, `mdast-util-to-hast`). Type-checking a project that uses shipyard no longer reports errors from inside shipyard's own source.

Optional properties that are absent are now omitted rather than set to `undefined` — `GitMetadata.lastUpdated`/`lastAuthor`, `PaginationInfo.prev`/`next` when pagination is explicitly disabled, and optional sidebar `TreeNode` fields. Reading these behaves identically; only an `in` or `Object.keys` check could tell the difference.
