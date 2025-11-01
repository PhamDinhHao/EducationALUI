import React from 'react'
import { Typography } from 'antd'
import { getYouTubeVideoId, isYouTubeUrl, createYouTubeEmbedUrl } from '@/shared/utils/youtube'

const { Title } = Typography

export interface VideoPlayerProps {
  src?: string | null
  title?: string
  youtubeOptions?: {
    autoplay?: boolean
    controls?: boolean
    start?: number
  }
  className?: string
  style?: React.CSSProperties
  emptyMessage?: string
  aspectRatio?: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title = 'Video player',
  youtubeOptions,
  className = '',
  style,
  emptyMessage = 'Không có video',
  aspectRatio = '16/9'
}) => {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-black rounded-lg ${className}`}
        style={{ aspectRatio, ...style }}
      >
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          {emptyMessage}
        </Title>
      </div>
    )
  }

  if (isYouTubeUrl(src)) {
    const videoId = getYouTubeVideoId(src)
    if (videoId) {
      const embedUrl = createYouTubeEmbedUrl(videoId, youtubeOptions)
      return (
        <div
          className={`relative bg-black rounded-lg overflow-hidden ${className}`}
          style={{ aspectRatio, ...style }}
        >
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      )
    }
  }

  return (
    <div
      className={`bg-black rounded-lg overflow-hidden flex items-center justify-center ${className}`}
      style={{ aspectRatio, ...style }}
    >
      <video
        src={src}
        controls
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default VideoPlayer

