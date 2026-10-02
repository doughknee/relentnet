import { marked } from 'marked'
import msa from '../../../../docs/MSA.md?raw'
import sow from '../../../../docs/SOW.md?raw'
import sha from '../../../../docs/SupportAndHosting.md?raw'

// Plain text stays plain: no auto-linking of the email address in SOW 6.3.
marked.use({ tokenizer: { url: () => undefined } })

export const legalMarkdown: Record<string, string> = { msa, sow, sha }

// The Markdown is our own repo file, not user content, so the HTML is trusted.
// The page header already shows the title, so the file's leading H1 is dropped;
// tables get a scroll wrapper so they never overflow on phones.
export const legalHtml: Record<string, string> = Object.fromEntries(
  Object.entries(legalMarkdown).map(([id, md]) => [
    id,
    marked
      .parse(md.replace(/^# .*\r?\n/, ''), { async: false })
      .replaceAll('<table>', '<div class="legal-table"><table>')
      .replaceAll('</table>', '</table></div>'),
  ]),
)
