export const formatAIText = (text: string): string => {
  if (!text) return ''
  let html = text
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    // Code blocks ``` ```
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg font-mono text-sm overflow-x-auto my-3"><code>$1</code></pre>')
    // Inline code `code`
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded font-mono text-sm">$1</code>')
    // Bold **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // Markdown headings (#, ##, ###, ####)
  html = html
    .replace(/^######\s+(.+)$/gm, '<h6 class="text-sm font-semibold text-gray-800 mt-3 mb-1">$1</h6>')
    .replace(/^#####\s+(.+)$/gm, '<h5 class="text-sm font-semibold text-gray-800 mt-3 mb-1">$1</h5>')
    .replace(/^####\s+(.+)$/gm, '<h4 class="text-base font-semibold text-gray-800 mt-3 mb-1">$1</h4>')
    .replace(/^###\s+(.+)$/gm, '<h3 class="text-base font-semibold text-gray-800 mt-3 mb-1">$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2 class="text-lg font-bold text-gray-900 mt-3 mb-2">$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1 class="text-xl font-bold text-gray-900 mt-3 mb-2">$1</h1>')

  // Headings: lines ending with ':' (fallback)
  html = html.replace(/^(?!\s*[\-•\*]|\d+\.|#)(.{3,}?):\s*$/gm, '<h3 class="text-base font-semibold text-gray-800 mt-3 mb-1">$1</h3>')

  // Bullets: - item / * item / • item
  html = html.replace(/^\s*[\-\*•]\s+(.+)$/gm, '• $1')

  // Numbered list keep as is
  html = html.replace(/^\s*(\d+)\.\s+/gm, '$1. ')

  // Notes highlight
  html = html.replace(/\b(Lưu ý|Gợi ý):/g, '<span class="text-orange-600 font-semibold">$1:</span>')

  // Line breaks
  html = html.replace(/\n/g, '<br />')
  return html
}
