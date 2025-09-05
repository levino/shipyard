---
"@levino/shipyard-base": patch
"@levino/shipyard-blog": patch
"@levino/shipyard-docs": patch
"single-locale-demo": patch
---

feat: restore support for non-i18n pages

- Made i18n optional in Shipyard base configuration
- Updated docs and blog integrations to handle both i18n and non-i18n cases
- Added conditional route patterns based on i18n configuration  
- Maintained full backward compatibility with existing i18n projects
- Added single-locale demo application to demonstrate non-i18n usage
- Updated documentation with comprehensive i18n vs non-i18n examples