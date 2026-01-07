---
title: Documentation Through Code
sidebar:
  position: 4
  label: Documentation Through Code
description: Let code document itself through clear names and types
---

# Documentation Through Code

Avoid comments. Let clear function names and TypeScript types document your code.

## No JSDoc Comments

JSDoc comments are not used in this project. They duplicate what the code already says and become stale.

Avoid:

```typescript
/**
 * This function filters users to only include active ones,
 * then sorts them by their registration date in ascending order.
 * @param users - Array of user objects
 * @returns Filtered and sorted array of active users
 */
const process = (users: User[]) =>
  users
    .filter((user) => user.isActive)
    .toSorted((a, b) => a.registrationDate - b.registrationDate)
```

Good:

```typescript
import { Array, flow } from 'effect'

const getActiveUsersSortedByRegistrationDate = flow(
  Array.filter((user: User) => user.isActive),
  Array.sort((a, b) => a.registrationDate - b.registrationDate),
)
```

## Extract Instead of Comment

If you feel the need to add a comment because the code is complex, don't add the comment - extract the complex part to well-named functions.

Avoid:

```typescript
const getEligibleUsers = (users: User[]) =>
  users.filter(
    // User must be active, over 18, and have verified email
    (user) => user.isActive && user.age >= 18 && user.emailVerified
  )
```

Good:

```typescript
const isActive = (user: User) => user.isActive
const isAdult = (user: User) => user.age >= 18
const hasVerifiedEmail = (user: User) => user.emailVerified

const getEligibleUsers = flow(
  Array.filter(isActive),
  Array.filter(isAdult),
  Array.filter(hasVerifiedEmail),
)
```

Benefits of extracting to functions:

- **Testable**: You can unit test each predicate independently
- **Reusable**: Use `isActive`, `isAdult`, `hasVerifiedEmail` in other contexts
- **Composable**: Combine predicates using `flow`
- **Self-documenting**: The function name explains the intent

## Complex Expressions

When you have complex filter expressions, boolean logic, or transformations - extract them:

Avoid:

```typescript
const result = users.filter(
  (user) =>
    user.role === 'admin' ||
    (user.role === 'moderator' && user.permissions.includes('delete')) ||
    user.isSuperUser
)
```

Good:

```typescript
const canDeleteContent = (user: User) =>
  user.role === 'admin' ||
  (user.role === 'moderator' && user.permissions.includes('delete')) ||
  user.isSuperUser

const getUsersWhoCanDeleteContent = flow(
  Array.filter(canDeleteContent),
)
```

Now `canDeleteContent` can be tested, reused, and composed with other functions.
