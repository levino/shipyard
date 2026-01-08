---
title: Naming Conventions
sidebar:
  position: 3
  label: Naming Conventions
description: Naming conventions for shipyard
---

# Naming Conventions

We write functions, not variables. Function names must explain what the function does.

## Rules

- Always use **camelCase**
- No shortcuts or abbreviations
- Names must be descriptive and self-explanatory

## Function Names

Good:

```typescript
const getUsersByAge = (users: User[], minAge: number) => ...
const calculateAveragePrice = (products: Product[]) => ...
const filterActiveSubscriptions = (subscriptions: Subscription[]) => ...
```

Avoid:

```typescript
const getUsersByAge = (u: User[], a: number) => ...  // Abbreviations
const calc = (products: Product[]) => ...       // Too short
const doFilter = (subs: Subscription[]) => ...  // Vague, abbreviation
```

## Variable Names (when necessary)

The same rules apply if you must use a variable:

Good:

```typescript
const activeUsers = getActiveUsers(db)
const totalRevenue = calculateTotalRevenue(orders)
```

Avoid:

```typescript
const au = getActiveUsers(db)     // Abbreviation
const x = calculateTotalRevenue(orders)  // Single letter
const data = getActiveUsers(db)   // Too generic
```

Good function names eliminate the need for comments. See [Documentation Through Code](/de/docs/contributing/code-style/documentation-through-code) for more details.
