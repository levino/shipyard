# single-locale-demo

## 0.0.2

### Patch Changes

- 20eddf6: feat: restore support for non-i18n pages

  - Made i18n optional in shipyard base configuration
  - Updated docs and blog integrations to handle both i18n and non-i18n cases
  - Added conditional route patterns based on i18n configuration
  - Maintained full backward compatibility with existing i18n projects
  - Added single-locale demo application to demonstrate non-i18n usage
  - Updated documentation with comprehensive i18n vs non-i18n examples

- Updated dependencies [20eddf6]
  - @levino/shipyard-base@0.5.3
  - @levino/shipyard-blog@0.4.2
  - @levino/shipyard-docs@0.4.2
