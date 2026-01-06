# Requirements Document

## Introduction

The shipyard project requires a comprehensive Code Style Guide document that establishes consistent coding conventions for all contributors, including both human developers and Claude AI. Currently, coding standards are scattered across CLAUDE.md and exist primarily as informal knowledge, making it difficult for new contributors to understand and follow the expected patterns.

This style guide will serve as the authoritative reference for code quality and consistency in the shipyard codebase. It will document the project's commitment to functional programming principles, self-documenting code through clear naming, modern web standards using native browser APIs, and robust testing practices. The guide will be hosted in the documentation site at `apps/docs/src/content/docs/contributing/code-style.md` and referenced from CLAUDE.md.

The target audience includes all contributors to the shipyard project: human developers joining the project, Claude AI when assisting with code changes, and maintainers performing code reviews. By establishing clear, documented standards, the team can ensure code consistency, reduce review friction, and maintain high code quality as the project grows.

## Requirements

### Requirement 1: Functional Programming Style Documentation

**User Story:** As a contributor to shipyard, I want clear documentation of functional programming conventions, so that I can write code that follows the project's established patterns and integrates seamlessly with the existing codebase.

#### Acceptance Criteria
1. WHEN a contributor reads the functional programming section THEN the guide SHALL explain the preference for pure functions with explicit inputs and outputs
2. WHEN documenting immutability THEN the guide SHALL describe how to avoid mutating function arguments and prefer creating new data structures
3. WHEN explaining composition THEN the guide SHALL provide guidance on building complex functionality from smaller, focused functions
4. WHEN a contributor needs to understand side effects THEN the guide SHALL explain how to isolate side effects at the boundaries of the application
5. IF the guide provides code examples THEN it SHALL include both correct and incorrect patterns with explanations

### Requirement 2: Naming Conventions Documentation

**User Story:** As a code reviewer, I want documented naming conventions with clear examples, so that I can consistently evaluate whether submitted code meets the project's readability standards.

#### Acceptance Criteria
1. WHEN documenting variable naming THEN the guide SHALL require descriptive, full-word names that convey purpose
2. WHEN explaining function naming THEN the guide SHALL require names that describe what the function does or returns
3. WHEN listing prohibited patterns THEN the guide SHALL explicitly forbid single-letter variables and unclear abbreviations
4. IF exceptions exist for naming rules THEN the guide SHALL document them with specific allowed contexts
5. WHEN a contributor needs naming guidance THEN the guide SHALL provide concrete examples of good and poor names for common scenarios
6. WHEN documenting naming THEN the guide SHALL emphasize that names should make code self-documenting without needing comments

### Requirement 3: Documentation Through Code Policy

**User Story:** As a developer, I want to understand the project's approach to code documentation, so that I know how to make my code understandable without relying on comments that may become stale.

#### Acceptance Criteria
1. WHEN documenting the comment policy THEN the guide SHALL state that JSDoc comments are not used in this project
2. WHEN explaining the rationale THEN the guide SHALL describe how comments tend to become outdated and misleading
3. WHEN defining alternatives THEN the guide SHALL explain that clear naming and TypeScript types serve as documentation
4. WHEN a contributor considers adding comments THEN the guide SHALL direct them to improve naming or type definitions instead
5. IF comments are ever appropriate THEN the guide SHALL specify the limited circumstances where they may be used

### Requirement 4: Web Components and Native APIs Documentation

**User Story:** As a frontend developer, I want clear guidance on implementing interactive features, so that I can build components using the project's preferred approach of native browser technologies.

#### Acceptance Criteria
1. WHEN documenting interactive component patterns THEN the guide SHALL specify that web components and custom elements are the preferred approach
2. WHEN explaining framework restrictions THEN the guide SHALL state that React, Svelte, jQuery, and similar frameworks should not be used for interactive components
3. WHEN a contributor needs to add interactivity THEN the guide SHALL explain the benefits of native browser APIs for this project
4. WHEN documenting custom elements THEN the guide SHALL provide guidance on when and how to create them within the Astro context
5. IF a framework is already used in the codebase THEN the guide SHALL explain how to maintain consistency with existing patterns

### Requirement 5: Integration Testing Requirements Documentation

**User Story:** As a feature developer, I want clear testing requirements and patterns, so that I can write appropriate tests that verify my implementation works correctly in real-world scenarios.

#### Acceptance Criteria
1. WHEN documenting testing requirements THEN the guide SHALL state that every feature needs meaningful integration tests
2. WHEN explaining demo apps THEN the guide SHALL describe how demo apps serve as example usages and test fixtures
3. WHEN documenting test structure THEN the guide SHALL explain that tests verify correct implementation of demos locally
4. WHEN explaining element selection THEN the guide SHALL require using data attributes to query markup in tests
5. WHEN a contributor writes tests THEN the guide SHALL emphasize testing actual behavior and output rather than implementation details
6. IF a feature lacks tests THEN the guide SHALL make clear the feature is not considered complete

### Requirement 6: Effect-TS Library Usage Documentation

**User Story:** As a developer working with asynchronous operations or error handling, I want guidance on using Effect-TS, so that I can leverage the library's functional patterns consistently throughout the codebase.

#### Acceptance Criteria
1. WHEN documenting Effect-TS THEN the guide SHALL explain that Effect is used for writing pipes and functional compositions
2. WHEN explaining use cases THEN the guide SHALL describe scenarios where Effect patterns should be applied
3. WHEN a contributor needs to handle errors THEN the guide SHALL point to Effect's error handling patterns
4. WHEN documenting async operations THEN the guide SHALL explain how Effect handles asynchronous workflows
5. IF the guide provides Effect examples THEN it SHALL show idiomatic usage patterns from the codebase

### Requirement 7: TypeScript Standards Documentation

**User Story:** As a TypeScript developer, I want documented type safety standards, so that I can write properly typed code that leverages TypeScript's features for documentation and safety.

#### Acceptance Criteria
1. WHEN documenting TypeScript requirements THEN the guide SHALL state that all code must be written in TypeScript
2. WHEN explaining strict mode THEN the guide SHALL confirm strict mode is required and explain its implications
3. WHEN documenting type usage THEN the guide SHALL explain how types serve as living documentation
4. WHEN a contributor considers type annotations THEN the guide SHALL provide guidance on when explicit types add value versus relying on inference
5. WHEN documenting type patterns THEN the guide SHALL discourage using `any` and explain alternatives

### Requirement 8: Astro Content Loaders Documentation

**User Story:** As an Astro developer, I want guidance on content handling patterns, so that I can load and process content using Astro's built-in mechanisms rather than direct file system access.

#### Acceptance Criteria
1. WHEN documenting content loading THEN the guide SHALL state that direct file system reads should be avoided
2. WHEN explaining the preferred approach THEN the guide SHALL describe Astro content loaders as the correct pattern
3. WHEN a contributor needs to load content THEN the guide SHALL explain why content loaders are preferred over direct file access
4. WHEN documenting content patterns THEN the guide SHALL provide guidance on using Astro's content collections
5. IF direct file access is necessary THEN the guide SHALL explain the exceptional circumstances where it may be justified
