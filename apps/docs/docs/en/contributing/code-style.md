---
title: Code Style Guide
sidebar_position: 1
sidebar_label: Code Style
description: Coding conventions for shipyard contributors
---

# Code Style Guide

This guide establishes the coding conventions for the shipyard project.

## Quick Reference

| Topic | Key Point |
|-------|-----------|
| Functional Programming | Use `flow` and `pipe` to compose transformations; avoid intermediary variables |
| Naming Conventions | Use descriptive, full-word names that make code self-documenting |
| Documentation Through Code | Let clear names and TypeScript types serve as documentation; avoid JSDoc comments |
| Web Components and Native APIs | Use custom elements and native browser APIs instead of frameworks for interactivity |
| Integration Testing | Every feature requires meaningful tests using demo apps as fixtures |
| Effect-TS Usage | Use Effect for functional pipes, compositions, and option handling |
| TypeScript Standards | Write all code in strict TypeScript; types are living documentation |
| Astro Content Loaders | Use Astro content collections instead of direct file system access |

---

## Functional Programming

Use `flow` from Effect to compose transformations point-free. Prefer expression bodies (no curly braces) over function bodies.

✅ Good:

```typescript
import { Array, flow } from 'effect'
import { getUsers } from 'db' // Pseudo package

const getActiveUserNames = flow(
  getUsers,
  Array.filter((user) => user.isActive),
  Array.map((user) => user.name),
)
```

❌ Avoid:

```typescript
const getActiveUserNames = (db: Database) => {
  const users = getUsers(db)
  const activeUsers = users.filter((user) => user.isActive)
  const names = activeUsers.map((user) => user.name)
  return names
}
```

Write functions that work on the same input type and compose them together:

✅ Good:

```typescript
import { Array, flow } from 'effect'
import { getUsers } from 'db' // Pseudo package for db access

// The implementation of these functions does not matter, it is the names which are telling. Usually these
// functions would be in separate files/modules.
const getFemaleAdults = flow(
  getUsers,
  Array.filter((user) => user.age >= 18 && user.gender === 'female'),
)

const getMinorMales = flow(
  getUsers,
  Array.filter((user) => user.age < 18 && user.gender === 'male'),
)

const getAllSeniors = flow(
  getUsers,
  Array.filter((user) => user.age >= 65),
)

// This is the important part. Clean and simple usage of well-named functions.
const femaleAdults = getFemaleAdults(db)
const minorMales = getMinorMales(db)
const seniors = getAllSeniors(db)
```

❌ Avoid making the reader zig zag through the code to follow the data:

```typescript
const users = getUsers(db)
const adults = users.filter((user) => user.age >= 18)
const minors = users.filter((user) => user.age < 18)
const seniors = users.filter((user) => user.age >= 65)
const femaleAdults = adults.filter((user) => user.gender === 'female') // See the mental hoops we have to jump through here? Which array is this filtering on? Scanning... scanning... ah, adults.
const minorMales = minors.filter((user) => user.gender === 'male')
```

### Avoid Mutation

Never mutate data. Always create new arrays and objects. We accept any runtime penalty for immutability — only optimize after measuring.

✅ Good:

```typescript
const getUserNames = (users: User[]) =>
    users.map((user) => user.name)
```

❌ Avoid:

```typescript
const getUserNames = (users: User[]) => {
  const result = []
  for (const user of users) {
    result.push(user.name) // Mutation!
  }
  return result
}
```

✅ Good:

```typescript
const getAverageAge = (users: User[]) =>
  users.reduce((sum, user) => sum + user.age, 0) / users.length
```

❌ Avoid:

```typescript
const getAverageAge = (users: User[]) => {
  let result = 0 // Mutable variable!
  for (const user of users) {
    result += user.age // Mutation!
  }
  result /= users.length // Mutation!
  return result
}
```
