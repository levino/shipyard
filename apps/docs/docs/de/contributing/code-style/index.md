---
title: Code Style Guide
sidebar:
  position: 1
  label: Code Style
description: Coding conventions for shipyard contributors
---

# Code Style Guide

This guide establishes the coding conventions for the shipyard project.

## Quick Reference

| Topic | Key Point |
|-------|-----------|
| [Functional Programming](/de/docs/contributing/code-style/functional-programming) | Use `flow` and `pipe` to compose transformations; avoid intermediary variables |
| [Naming Conventions](/de/docs/contributing/code-style/naming-conventions) | Use descriptive, full-word names that make code self-documenting |
| [Documentation Through Code](/de/docs/contributing/code-style/documentation-through-code) | Avoid comments; extract complex code to well-named functions instead |
| [Web Components and Native APIs](/de/docs/contributing/code-style/web-components) | Use custom elements instead of React, Vue, jQuery for interactivity |
| Integration Testing | Every feature requires meaningful tests using demo apps as fixtures |
| Effect | Use [Effect](https://effect.website/docs/getting-started/introduction) for functional pipes, compositions, and option handling |
| TypeScript Standards | Write all code in strict TypeScript; types are living documentation |
| Astro Content Loaders | Use Astro content collections instead of direct file system access |
