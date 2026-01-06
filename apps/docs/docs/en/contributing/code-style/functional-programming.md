---
title: Functional Programming
sidebar_position: 2
sidebar_label: Functional Programming
description: Functional programming conventions for shipyard
---

# Functional Programming

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

## Prefer Functions Over Methods

Use `flow` with Effect's `Array` functions instead of method chaining. This enables better composition and point-free style.

✅ Good:

```typescript
import { Array, flow } from 'effect'

const getActiveUsersSorted = flow(
  Array.filter((user: User) => user.isActive),
  Array.sort((a, b) => a.registrationDate - b.registrationDate),
)
```

✅ Acceptable (simple cases):

```typescript
const getActiveUsersSorted = (users: User[]) =>
  users
    .filter((user) => user.isActive)
    .sort((a, b) => a.registrationDate - b.registrationDate)
```

❌ Avoid:

```typescript
const getActiveUsersSorted = (users: User[]) => {
  const active = users.filter((user) => user.isActive)
  const sorted = active.sort((a, b) => a.registrationDate - b.registrationDate)
  return sorted
}
```

## Avoid Mutation

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
