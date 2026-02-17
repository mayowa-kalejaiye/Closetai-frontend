import clsx from 'clsx'

export function cn(...inputs: any[]) {
  return clsx(inputs)
}

// Convert simple bold markup (**bold**) into safe HTML with <strong>
export function formatBoldHtml(input: string | undefined | null) {
  const text = (input || '') + ''
  // basic HTML escape
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  const escaped = escape(text)
  // replace **bold** with <strong>
  const html = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  return { __html: html }
}
