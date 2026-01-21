#!/bin/bash
# Test that shipyard CSS classes are present in built CSS files
# This verifies that Tailwind's @source directive is working correctly

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Expected shipyard component classes that must be in the CSS
EXPECTED_CLASSES=(
  ".admonition"
  ".admonition-note"
  ".admonition-tip"
  ".admonition-warning"
  ".admonition-danger"
  ".shipyard-tabs"
  ".shipyard-tab-button"
  ".npm2yarn-tabs"
  ".code-block-title"
  ".line-numbers"
  ".line.highlighted"
)

# Demos to test
DEMOS=(
  "apps/demos/i18n"
  "apps/demos/single-locale"
  "apps/demos/versioned-docs"
  "apps/demos/versioned-i18n"
)

FAILED=0

for demo in "${DEMOS[@]}"; do
  demo_path="$ROOT_DIR/$demo"
  demo_name=$(basename "$demo")

  echo "Testing $demo_name..."

  # Find CSS files in dist
  css_files=$(find "$demo_path/dist" -name "*.css" 2>/dev/null || true)

  if [ -z "$css_files" ]; then
    echo "  ERROR: No CSS files found in $demo_path/dist"
    echo "  Run 'npm run build' in $demo_path first"
    FAILED=1
    continue
  fi

  # Concatenate all CSS for checking
  all_css=$(cat $css_files)

  missing_classes=()
  for class in "${EXPECTED_CLASSES[@]}"; do
    # Escape dots for grep regex
    escaped_class=$(echo "$class" | sed 's/\./\\./g')
    if ! echo "$all_css" | grep -q "$escaped_class"; then
      missing_classes+=("$class")
    fi
  done

  if [ ${#missing_classes[@]} -gt 0 ]; then
    echo "  FAILED: Missing CSS classes:"
    for class in "${missing_classes[@]}"; do
      echo "    - $class"
    done
    FAILED=1
  else
    echo "  PASSED: All ${#EXPECTED_CLASSES[@]} expected classes found"
  fi
done

echo ""
if [ $FAILED -eq 1 ]; then
  echo "CSS verification FAILED"
  exit 1
else
  echo "CSS verification PASSED"
  exit 0
fi
