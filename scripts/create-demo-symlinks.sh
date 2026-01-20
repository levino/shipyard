#!/bin/bash
# Create symlinks for shipyard packages in demo node_modules
# This is needed for Tailwind CSS 4's @source directive to work correctly

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# List of demo directories
DEMOS=(
  "apps/demos/i18n"
  "apps/demos/single-locale"
  "apps/demos/versioned-docs"
  "apps/demos/versioned-i18n"
  "apps/demos/server-mode"
  "apps/demos/broken-links-test"
  "apps/test/server-mode"
)

for demo in "${DEMOS[@]}"; do
  demo_path="$ROOT_DIR/$demo"
  if [ -d "$demo_path" ]; then
    # Create @levino directory in node_modules
    mkdir -p "$demo_path/node_modules/@levino"

    # Create symlinks to packages
    ln -sfn "../../../../packages/base" "$demo_path/node_modules/@levino/shipyard-base"
    ln -sfn "../../../../packages/blog" "$demo_path/node_modules/@levino/shipyard-blog"
    ln -sfn "../../../../packages/docs" "$demo_path/node_modules/@levino/shipyard-docs"

    echo "Created symlinks for $demo"
  fi
done

echo "Done!"
