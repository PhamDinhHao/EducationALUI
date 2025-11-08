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
  onVideoEnded?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title = 'Video player',
  youtubeOptions,
  className = '',
  style,
  emptyMessage = 'Không có video',
  aspectRatio = '16/9',
  onVideoEnded,
  onTimeUpdate
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
      const containerId = `youtube-player-container-${videoId}`
      const playerRef = React.useRef<any>(null)
      const timeUpdateIntervalRef = React.useRef<NodeJS.Timeout | null>(null)
      
      React.useEffect(() => {
        if (!onVideoEnded && !onTimeUpdate) {
          return
        }

        if ((window as any).YT && (window as any).YT.Player) {
          initializePlayer()
        } else {
          const tag = document.createElement('script')
          tag.src = 'https://www.youtube.com/iframe_api'
          const firstScriptTag = document.getElementsByTagName('script')[0]
          firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)

          ;(window as any).onYouTubeIframeAPIReady = () => {
            initializePlayer()
          }
        }

        function initializePlayer() {
          try {
            setTimeout(() => {
              try {
                playerRef.current = new (window as any).YT.Player(containerId, {
                  videoId: videoId,
                  playerVars: {
                    autoplay: youtubeOptions?.autoplay ? 1 : 0,
                    controls: youtubeOptions?.controls !== false ? 1 : 0,
                    start: youtubeOptions?.start || 0,
                    enablejsapi: 1,
                  },
                  events: {
                    onStateChange: (event: any) => {
                      if (event.data === 0 && onVideoEnded) {
                        onVideoEnded()
                      }
                    },
                    onReady: () => {
                      if (onTimeUpdate && playerRef.current) {
                        setTimeout(() => {
                          try {
                            if (playerRef.current && playerRef.current.getCurrentTime && playerRef.current.getDuration) {
                              const currentTime = playerRef.current.getCurrentTime()
                              const duration = playerRef.current.getDuration()
                              if (duration > 0 && currentTime >= 0) {
                                onTimeUpdate(currentTime, duration)
                              }
                            }
                          } catch (error) {
                            console.error('Error getting YouTube video time:', error)
                          }
                        }, 2000)

                        timeUpdateIntervalRef.current = setInterval(() => {
                          try {
                            if (playerRef.current && playerRef.current.getCurrentTime && playerRef.current.getDuration) {
                              const currentTime = playerRef.current.getCurrentTime()
                              const duration = playerRef.current.getDuration()
                              if (duration > 0 && currentTime >= 0) {
                                onTimeUpdate(currentTime, duration)
                              }
                            }
                          } catch (error) {
                            console.error('Error getting YouTube video time:', error)
                          }
                        }, 10000)
                      }
                    },
                    onError: (error: any) => {
                      console.error('YouTube player error:', error)
                    }
                  }
                })
              } catch (error) {
                console.error('Error initializing YouTube player:', error)
              }
            }, 100)
          } catch (error) {
            console.error('Error in initializePlayer:', error)
          }
        }

        return () => {
          if (timeUpdateIntervalRef.current) {
            clearInterval(timeUpdateIntervalRef.current)
          }
          if (playerRef.current && playerRef.current.destroy) {
            try {
              playerRef.current.destroy()
            } catch (error) {
            }
          }
        }
      }, [videoId, onVideoEnded, onTimeUpdate])

      return (
        <div
          className={`relative bg-black rounded-lg overflow-hidden ${className}`}
          style={{ aspectRatio, ...style }}
        >
          <div id={containerId} style={{ width: '100%', height: '100%' }} />
          {!onVideoEnded && !onTimeUpdate && (
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
              style={{ display: playerRef.current ? 'none' : 'block' }}
            />
          )}
        </div>
      )
    }
  }

  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      if (onVideoEnded) {
        onVideoEnded()
      }
    }

    const handleTimeUpdate = () => {
      if (onTimeUpdate && video.duration && video.duration > 0) {
        const now = Date.now()
        const lastUpdate = (video as any).__lastUpdateTime || 0
        if (now - lastUpdate >= 5000) {
          onTimeUpdate(video.currentTime, video.duration)
          ;(video as any).__lastUpdateTime = now
        }
      }
    }

    video.addEventListener('ended', handleEnded)
    video.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [onVideoEnded, onTimeUpdate])

  return (
    <div
      className={`bg-black rounded-lg overflow-hidden flex items-center justify-center ${className}`}
      style={{ aspectRatio, ...style }}
    >
      <video
        ref={videoRef}
        src={src}
        controls
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default VideoPlayer

