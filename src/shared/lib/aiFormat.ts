export const formatAIText = (text: string): string => {
  if (!text) return ''
  let html = text
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    
    // LaTeX Math Symbols - Must be first to avoid conflicts
    .replace(/\\Rightarrow/g, '<span class="math-symbol text-blue-600 font-bold">⇒</span>')
    .replace(/\\Leftrightarrow/g, '<span class="math-symbol text-blue-600 font-bold">⇔</span>')
    .replace(/\\iff/g, '<span class="math-symbol text-blue-600 font-bold">⇔</span>')
    .replace(/\\implies/g, '<span class="math-symbol text-blue-600 font-bold">⇒</span>')
    .replace(/\\le/g, '<span class="math-symbol text-red-600 font-bold">≤</span>')
    .replace(/\\ge/g, '<span class="math-symbol text-red-600 font-bold">≥</span>')
    .replace(/\\neq/g, '<span class="math-symbol text-red-600 font-bold">≠</span>')
    .replace(/\\ne/g, '<span class="math-symbol text-red-600 font-bold">≠</span>')
    .replace(/\\cdot/g, '<span class="math-symbol text-gray-600">·</span>')
    .replace(/\\cup/g, '<span class="math-symbol text-green-600 font-bold">∪</span>')
    .replace(/\\cap/g, '<span class="math-symbol text-green-600 font-bold">∩</span>')
    .replace(/\\infty/g, '<span class="math-symbol text-purple-600 font-bold">∞</span>')
    .replace(/\\bar\{([^}]+)\}/g, '<span class="math-bar"><span class="bar-content">$1</span><span class="bar-line border-t border-gray-600"></span></span>')
    .replace(/\\log_(\d+)/g, '<span class="math-log"><span class="log-base text-xs">$1</span><span class="log-symbol">log</span></span>')
    .replace(/\\alpha/g, '<span class="math-symbol text-purple-600 font-bold">α</span>')
    .replace(/\\beta/g, '<span class="math-symbol text-purple-600 font-bold">β</span>')
    .replace(/\\gamma/g, '<span class="math-symbol text-purple-600 font-bold">γ</span>')
    .replace(/\\delta/g, '<span class="math-symbol text-purple-600 font-bold">δ</span>')
    .replace(/\\epsilon/g, '<span class="math-symbol text-purple-600 font-bold">ε</span>')
    .replace(/\\theta/g, '<span class="math-symbol text-purple-600 font-bold">θ</span>')
    .replace(/\\lambda/g, '<span class="math-symbol text-purple-600 font-bold">λ</span>')
    .replace(/\\mu/g, '<span class="math-symbol text-purple-600 font-bold">μ</span>')
    .replace(/\\pi/g, '<span class="math-symbol text-purple-600 font-bold">π</span>')
    .replace(/\\sigma/g, '<span class="math-symbol text-purple-600 font-bold">σ</span>')
    .replace(/\\tau/g, '<span class="math-symbol text-purple-600 font-bold">τ</span>')
    .replace(/\\phi/g, '<span class="math-symbol text-purple-600 font-bold">φ</span>')
    .replace(/\\omega/g, '<span class="math-symbol text-purple-600 font-bold">ω</span>')
    
    // Fractions: \frac{numerator}{denominator}
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="math-fraction inline-block text-center"><span class="fraction-numerator text-sm border-b border-gray-400 pb-0.5">$1</span><span class="fraction-denominator text-sm pt-0.5">$2</span></span>')
    
    // Roots: \sqrt{content} and \sqrt[n]{content}
    .replace(/\\sqrt\[(\d+)\]\{([^}]+)\}/g, '<span class="math-root"><span class="root-index text-xs">$1</span><span class="root-symbol">√</span><span class="root-content">$2</span></span>')
    .replace(/\\sqrt\{([^}]+)\}/g, '<span class="math-root"><span class="root-symbol text-lg">√</span><span class="root-content">$1</span></span>')
    
    // Powers: a^{b} and a^b
    .replace(/\^(\d+)/g, '<sup class="math-superscript text-xs text-blue-600">$1</sup>')
    .replace(/\^\{([^}]+)\}/g, '<sup class="math-superscript text-xs text-blue-600">$1</sup>')
    
    // Subscripts: a_{b} and a_b
    .replace(/_(\d+)/g, '<sub class="math-subscript text-xs text-green-600">$1</sub>')
    .replace(/_\{([^}]+)\}/g, '<sub class="math-subscript text-xs text-green-600">$1</sub>')
    
    // Special subscript patterns for common math notation
    .replace(/u_(\w+)/g, '<span class="math-sequence">u<sub class="math-subscript text-xs text-green-600">$1</sub></span>')
    .replace(/S_(\w+)/g, '<span class="math-sum">S<sub class="math-subscript text-xs text-green-600">$1</sub></span>')
    .replace(/log_(\w+)/g, '<span class="math-log"><span class="log-base text-xs text-green-600">$1</span><span class="log-symbol">log</span></span>')
    .replace(/\\log_(\w+)/g, '<span class="math-log"><span class="log-base text-xs text-green-600">$1</span><span class="log-symbol">log</span></span>')
    
    // Negative exponents: a^{-n}
    .replace(/\^\{-(\d+)\}/g, '<sup class="math-superscript text-xs text-red-600">-$1</sup>')
    .replace(/\^-(\d+)/g, '<sup class="math-superscript text-xs text-red-600">-$1</sup>')
    
    // Number sets
    .replace(/\\mathbb\{R\}/g, '<span class="math-set text-blue-600 font-bold">ℝ</span>')
    .replace(/\\mathbb\{N\}/g, '<span class="math-set text-blue-600 font-bold">ℕ</span>')
    .replace(/\\mathbb\{Z\}/g, '<span class="math-set text-blue-600 font-bold">ℤ</span>')
    .replace(/\\mathbb\{Q\}/g, '<span class="math-set text-blue-600 font-bold">ℚ</span>')
    .replace(/\\mathbb\{C\}/g, '<span class="math-set text-blue-600 font-bold">ℂ</span>')
    
    // Integration symbol
    .replace(/\\int/g, '<span class="math-integral text-purple-600 font-bold text-lg">∫</span>')
    
    // Logarithmic equations: a^log b = c
    .replace(/(\w+)\^log\s+(\w+)\s*=\s*(\w+)/g, '<span class="math-log-equation"><span class="base">$1</span><sup class="log-superscript text-xs text-blue-600">log</sup> <span class="argument">$2</span> = <span class="result">$3</span></span>')
    
    // Mathematical expressions: $...$ (LaTeX) - Must be after symbol replacements
    .replace(/\$([^$]+)\$/g, '<span class="math-expression bg-blue-50 px-1 py-0.5 rounded text-blue-800 font-mono text-sm">$1</span>')
    
    // Sign tables (Bảng xét dấu) - Multi-line table format
    .replace(/^(\d+)\.\s+Lập bảng xét dấu\s+(.+)$/gm, '<div class="sign-table-section mt-3"><h4 class="text-lg font-semibold text-gray-800 mb-2">$1. Lập bảng xét dấu $2</h4></div>')
    
    // Mathematical conclusions with intervals - Must be before step-by-step
    .replace(/^(\d+)\.\s+(y'?\s*[><=]+\s*[^,]+),\s*(vậy|nên|do đó|suy ra)\s*(.+)$/gm, '<div class="math-conclusion bg-green-50 border-l-4 border-green-500 p-3 my-2 rounded-r"><div class="conclusion-step"><span class="step-number bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">$1</span><span class="conclusion-content"><span class="math-condition text-green-800 font-semibold">$2</span>, <span class="conclusion-text text-gray-800">$3 $4</span></span></div></div>')
    
    // Problem structure: Câu hỏi, Đáp án, Giải thích
    .replace(/^(Câu hỏi|Question):\s*(.+)$/gm, '<div class="problem-question bg-blue-50 border-l-4 border-blue-500 p-3 my-2 rounded-r"><strong class="text-blue-800">Câu hỏi:</strong> <span class="text-gray-800">$2</span></div>')
    .replace(/^(Đáp án|Answer):\s*(.+)$/gm, '<div class="problem-answer bg-green-50 border-l-4 border-green-500 p-3 my-2 rounded-r"><strong class="text-green-800">Đáp án:</strong> <span class="text-gray-800">$2</span></div>')
    .replace(/^(Giải thích|Explanation):\s*$/gm, '<div class="problem-explanation mt-3"><strong class="text-purple-800 text-lg">Giải thích:</strong></div>')
    
    // Step-by-step solutions: 1. 2. 3. etc. - Must be after math conclusions
    // .replace(/^(\d+)\.\s+(.+)$/gm, '<div class="solution-step bg-gray-50 border-l-4 border-gray-300 p-2 my-1 rounded-r"><span class="step-number bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">$1</span><span class="step-content">$2</span></div>')
    
    // Sub-steps: • item
    .replace(/^•\s+(.+)$/gm, '<div class="sub-step ml-6 my-1"><span class="bullet-point text-gray-600">•</span> <span class="sub-content">$1</span></div>')
    
    // Tips and Common Errors section (simple format)
    .replace(/^(Mẹo ghi nhớ|Tips?):\s*$/gm, '<div class="tips-section mt-4"><h4 class="font-bold text-lg mb-2">Mẹo ghi nhớ:</h4></div>')
    .replace(/^(Lỗi sai thường gặp|Common Errors?):\s*$/gm, '<div class="errors-section mt-4"><h4 class="font-bold text-lg mb-2">Lỗi sai thường gặp:</h4></div>')
    
    // Numbered tips with bold titles (simple format)
    .replace(/^(\d+)\.\s+\*\*(.+?)\*\*\s*(.+)$/gm, 
      '<div class="numbered-tip mb-3"><div class="tip-title font-bold text-gray-800 mb-1">$1. $2</div><div class="tip-description text-gray-700">$3</div></div>')
    
    // Topic headers: Bài X: Topic
    .replace(/^(Bài\s+\d+):\s*(.+)$/gm, '<h3 class="topic-header text-xl font-bold text-gray-900 mt-4 mb-3 pb-2 border-b-2 border-gray-300">$1: $2</h3>')
    
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
