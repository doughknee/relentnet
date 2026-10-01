//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  // Windows clones with core.autocrlf=true check out CRLF; the index is LF.
  // 'auto' keeps each file's existing ending so --check reports real drift only.
  endOfLine: 'auto',
}

export default config
