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
      
      // Load YouTube IFrame API for tracking progress
      React.useEffect(() => {
        if (!onVideoEnded && !onTimeUpdate) {
          // If no callbacks needed, just render iframe without API
          return
        }

        // Check if YouTube API is already loaded
        if ((window as any).YT && (window as any).YT.Player) {
          initializePlayer()
        } else {
          // Load YouTube IFrame API
          const tag = document.createElement('script')
          tag.src = 'https://www.youtube.com/iframe_api'
          const firstScriptTag = document.getElementsByTagName('script')[0]
          firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)

          // Wait for API to load
          ;(window as any).onYouTubeIframeAPIReady = () => {
            initializePlayer()
          }
        }

        function initializePlayer() {
          try {
            // Small delay to ensure container exists
            setTimeout(() => {
              try {
                playerRef.current = new (window as any).YT.Player(containerId, {
                  videoId: videoId,
                  playerVars: {
                    autoplay: youtubeOptions?.autoplay ? 1 : 0,
                    controls: youtubeOptions?.controls !== false ? 1 : 0,
                    start: youtubeOptions?.start || 0,
                    enablejsapi: 1, // Enable JS API for progress tracking
                  },
                  events: {
                    onStateChange: (event: any) => {
                      // 0 = ended
                      if (event.data === 0 && onVideoEnded) {
                        onVideoEnded()
                      }
                    },
                    onReady: () => {
                      // Start tracking time updates every 10 seconds
                      if (onTimeUpdate && playerRef.current) {
                        // Initial check after 2 seconds
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

                        // Set up interval for regular updates
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
                        }, 10000) // Update every 10 seconds
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
              // Ignore destroy errors
            }
          }
        }
      }, [videoId, onVideoEnded, onTimeUpdate])

      // Render YouTube player container
      return (
        <div
          className={`relative bg-black rounded-lg overflow-hidden ${className}`}
          style={{ aspectRatio, ...style }}
        >
          <div id={containerId} style={{ width: '100%', height: '100%' }} />
          {/* Fallback: if API fails, show regular iframe */}
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

  // For regular video elements
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
        // Throttle timeupdate events - only call callback every 5 seconds
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

