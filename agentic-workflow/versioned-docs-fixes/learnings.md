# Learnings

## Zod Schema Extension

- **Cannot call `.extend()` on transformed schemas**: When you call `.transform()` or `.refine()` on a Zod object, it returns a `ZodEffects`, not a `ZodObject`. `ZodEffects` doesn't have `.extend()`.
- **Solution**: Extract the base object schema before applying transforms, then apply transforms separately to both schemas.

```typescript
// Wrong approach:
const schema = z.object({...}).transform(...).refine(...)
const extended = schema.extend({...}) // Error!

// Correct approach:
const baseSchema = z.object({...})
const transform = (data) => ({...})
const refinement = { check: (data) => boolean, message: 'error' }

const schema = baseSchema.transform(transform).refine(refinement.check, { message: refinement.message })
const extended = baseSchema.extend({...}).transform(transform).refine(refinement.check, { message: refinement.message })
```
