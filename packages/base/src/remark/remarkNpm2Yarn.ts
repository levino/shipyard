import type { Code, Root } from 'mdast'
import { map, pipe, replace, test, trim } from 'ramda'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

/**
 * Package manager types supported by npm2yarn.
 */
type PackageManager = 'npm' | 'yarn' | 'pnpm'

/**
 * Transforms an npm command to the equivalent yarn command.
 */
const npmToYarn = (npmCommand: string): string => {
  const trimmed = trim(npmCommand)

  // npm install -> yarn
  if (test(/^npm\s+install$/, trimmed)) {
    return 'yarn'
  }

  // npm install <package> -> yarn add <package>
  if (test(/^npm\s+install\s+/, trimmed)) {
    return pipe(
      replace(/^npm\s+install\s+/, 'yarn add '),
      // Handle --save-dev / -D flag
      replace(/\s+--save-dev\b/, ' --dev'),
      replace(/\s+-D\b/, ' --dev'),
      // Handle --save flag (yarn doesn't need it)
      replace(/\s+--save\b/, ''),
      replace(/\s+-S\b/, ''),
      // Handle --global / -g flag
      replace(/\s+--global\b/, ' global'),
      replace(/\s+-g\b/, ' global'),
      trim,
    )(trimmed)
  }

  // npm uninstall <package> -> yarn remove <package>
  if (test(/^npm\s+uninstall\s+/, trimmed)) {
    return replace(/^npm\s+uninstall\s+/, 'yarn remove ')(trimmed)
  }

  // npm run <script> -> yarn <script>
  if (test(/^npm\s+run\s+/, trimmed)) {
    return replace(/^npm\s+run\s+/, 'yarn ')(trimmed)
  }

  // npm test -> yarn test
  if (test(/^npm\s+test$/, trimmed)) {
    return 'yarn test'
  }

  // npm init -> yarn init
  if (test(/^npm\s+init/, trimmed)) {
    return replace(/^npm\s+init/, 'yarn init')(trimmed)
  }

  // npm ci -> yarn install --frozen-lockfile
  if (test(/^npm\s+ci$/, trimmed)) {
    return 'yarn install --frozen-lockfile'
  }

  // npm update -> yarn upgrade
  if (test(/^npm\s+update/, trimmed)) {
    return replace(/^npm\s+update/, 'yarn upgrade')(trimmed)
  }

  // Default: just replace npm with yarn
  return replace(/^npm\s+/, 'yarn ')(trimmed)
}

/**
 * Transforms an npm command to the equivalent pnpm command.
 */
const npmToPnpm = (npmCommand: string): string => {
  const trimmed = trim(npmCommand)

  // npm install -> pnpm install
  if (test(/^npm\s+install$/, trimmed)) {
    return 'pnpm install'
  }

  // npm install <package> -> pnpm add <package>
  if (test(/^npm\s+install\s+/, trimmed)) {
    return pipe(
      replace(/^npm\s+install\s+/, 'pnpm add '),
      // Handle --save-dev / -D flag (pnpm uses -D)
      replace(/\s+--save-dev\b/, ' -D'),
      // Handle --save flag (pnpm doesn't need it)
      replace(/\s+--save\b/, ''),
      replace(/\s+-S\b/, ''),
      // Handle --global / -g flag
      replace(/\s+--global\b/, ' --global'),
      replace(/\s+-g\b/, ' -g'),
      trim,
    )(trimmed)
  }

  // npm uninstall <package> -> pnpm remove <package>
  if (test(/^npm\s+uninstall\s+/, trimmed)) {
    return replace(/^npm\s+uninstall\s+/, 'pnpm remove ')(trimmed)
  }

  // npm run <script> -> pnpm <script>
  if (test(/^npm\s+run\s+/, trimmed)) {
    return replace(/^npm\s+run\s+/, 'pnpm ')(trimmed)
  }

  // npm test -> pnpm test
  if (test(/^npm\s+test$/, trimmed)) {
    return 'pnpm test'
  }

  // npm init -> pnpm init
  if (test(/^npm\s+init/, trimmed)) {
    return replace(/^npm\s+init/, 'pnpm init')(trimmed)
  }

  // npm ci -> pnpm install --frozen-lockfile
  if (test(/^npm\s+ci$/, trimmed)) {
    return 'pnpm install --frozen-lockfile'
  }

  // npm update -> pnpm update
  if (test(/^npm\s+update/, trimmed)) {
    return replace(/^npm\s+update/, 'pnpm update')(trimmed)
  }

  // Default: just replace npm with pnpm
  return replace(/^npm\s+/, 'pnpm ')(trimmed)
}

/**
 * Converts npm commands to equivalent commands for all package managers.
 */
const convertCommands = (npmCode: string): Record<PackageManager, string> => {
  const lines = npmCode.split('\n')
  const yarnLines = map(npmToYarn, lines)
  const pnpmLines = map(npmToPnpm, lines)

  return {
    npm: npmCode,
    yarn: yarnLines.join('\n'),
    pnpm: pnpmLines.join('\n'),
  }
}

/**
 * Remark plugin to transform npm code blocks into tabbed package manager blocks.
 *
 * This plugin transforms code blocks with the `npm2yarn` meta tag:
 * ```bash npm2yarn
 * npm install @levino/shipyard-base
 * ```
 *
 * Into a structure that renders as tabs showing npm, yarn, and pnpm commands.
 *
 * @example
 * ```ts
 * import { remarkNpm2Yarn } from '@levino/shipyard-base/remark'
 *
 * export default defineConfig({
 *   markdown: {
 *     remarkPlugins: [remarkNpm2Yarn],
 *   },
 * })
 * ```
 */
export const remarkNpm2Yarn: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code, index, parent) => {
      // Check if this code block has npm2yarn meta
      const meta = node.meta ?? ''
      if (!meta.includes('npm2yarn')) {
        return
      }

      // Only process bash/shell code blocks
      const lang = node.lang?.toLowerCase() ?? ''
      if (!['bash', 'sh', 'shell', 'zsh', ''].includes(lang)) {
        return
      }

      const commands = convertCommands(node.value)

      // Create a tabs structure using HTML
      // We'll create a custom element that gets styled by CSS
      const tabsHtml = `<div class="npm2yarn-tabs" data-tabs="package-manager">
<div class="tabs-header">
<button class="tab-button active" data-tab="npm">npm</button>
<button class="tab-button" data-tab="yarn">Yarn</button>
<button class="tab-button" data-tab="pnpm">pnpm</button>
</div>
<div class="tab-content active" data-tab-content="npm">

\`\`\`bash
${commands.npm}
\`\`\`

</div>
<div class="tab-content" data-tab-content="yarn">

\`\`\`bash
${commands.yarn}
\`\`\`

</div>
<div class="tab-content" data-tab-content="pnpm">

\`\`\`bash
${commands.pnpm}
\`\`\`

</div>
</div>`

      // Replace the code node with an HTML node
      if (parent && typeof index === 'number') {
        const htmlNode = {
          type: 'html' as const,
          value: tabsHtml,
        }
        parent.children.splice(index, 1, htmlNode)
      }
    })
  }
}

export default remarkNpm2Yarn
