import type { Root } from 'mdast'
import { directiveFromMarkdown } from 'mdast-util-directive'
import { directive } from 'micromark-extension-directive'
// `remark-parse` augments unified's `Data` with `micromarkExtensions` and
// `fromMarkdownExtensions`. shipyard ships raw TypeScript source, so a consumer
// compiles this file in their own program — importing the augmentation here
// keeps it available there instead of relying on a transitive dev dependency.
import type {} from 'remark-parse'
import type { Plugin, Processor } from 'unified'

/**
 * Like `remark-directive`, but only enables block-level directives — container
 * (`:::name`) and leaf (`::name`) — and disables inline text directives
 * (`:name`).
 *
 * Why: the inline text directive syntax conflicts with the German gender
 * colon (e.g. `Organisator:innen`, `Ordner:innen`), which would otherwise be
 * tokenised as a directive and rendered as an empty `<div>`, tearing the
 * surrounding paragraph apart.
 *
 * Block directives stay available so admonitions (`:::note`, `:::warning`)
 * keep working.
 */
export const remarkBlockDirective: Plugin<[], Root> = function () {
  const self = this as unknown as Processor<Root>
  const data = self.data()

  if (!data.micromarkExtensions) {
    data.micromarkExtensions = []
  }
  if (!data.fromMarkdownExtensions) {
    data.fromMarkdownExtensions = []
  }

  const { flow } = directive()
  data.micromarkExtensions.push({ flow })
  data.fromMarkdownExtensions.push(directiveFromMarkdown())
}

export default remarkBlockDirective
