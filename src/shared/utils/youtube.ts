
export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null

  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  if (watchMatch) return watchMatch[1]

  const embedMatch = url.match(/youtube\.com\/embed\/([^&\n?#]+)/)
  if (embedMatch) return embedMatch[1]

  return null
}


export const isYouTubeUrl = (url: string): boolean => {
  return /youtube\.com|youtu\.be/.test(url)
}

export const createYouTubeEmbedUrl = (videoId: string, options?: {
  autoplay?: boolean
  controls?: boolean
  start?: number
}): string => {
  const params = new URLSearchParams()
  if (options?.autoplay) params.append('autoplay', '1')
  if (options?.controls === false) params.append('controls', '0')
  if (options?.start) params.append('start', String(options.start))
  // Hide related videos completely
  params.append('rel', '0')
  // Reduce YouTube branding
  params.append('modestbranding', '1')
  // Hide annotations
  params.append('iv_load_policy', '3')

  const queryString = params.toString()
  // Use youtube-nocookie.com which has better privacy and fewer suggestions
  return `https://www.youtube-nocookie.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`
}

