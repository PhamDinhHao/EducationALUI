import { useState, useEffect } from 'react'
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  MessageOutlined,
  SendOutlined,
  HeartOutlined,
  ShareAltOutlined
} from '@ant-design/icons'
import { useLocation, useParams } from 'react-router-dom'
import { createComment, getBlogDetail, getComments, getRelatedPosts, likeBlog } from '@/modules/blog/services/blogService.service'
import { useBoundStore } from '@/shared/stores'
import { Helmet } from 'react-helmet-async'
import 'react-quill/dist/quill.snow.css'
const BlogDetail = () => {
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isVisible, setIsVisible] = useState(false)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentPage, setCommentPage] = useState<number>(1)
  const [commentPagination, setCommentPagination] = useState<any>(null)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const { id } = useParams()
  const { user: currentUser } = useBoundStore((state) => state)
  const { state } = useLocation()
  // Mock user - trong thực tế lấy từ auth context
  useEffect(() => {
    const fetchBlogDetail = async () => {
      setLoading(true)
      try {
        const [res, relatedRes] = await Promise.all([getBlogDetail(id as string), getRelatedPosts(id as string, { type: state?.type === 'CONTESTS' ? 'CONTESTS' : 'BLOG' })])

        const blogData = res.data.data || res.data
        setBlog(blogData)
        setRelatedPosts(relatedRes.data || [])

        setTimeout(() => setIsVisible(true), 200)
      } catch (err) {
        console.error('Error fetching blog detail:', err)
        alert('Không thể tải dữ liệu bài viết.')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchBlogDetail()
  }, [id])

  useEffect(() => {
    if (id) fetchComments()
  }, [id, commentPage])

  const fetchComments = async () => {
    setCommentLoading(true)
    try {
      const res = await getComments(id as string)

      const data = res.data
      const parentComments = data.data.filter((c: any) => !c.parentId)
      const childComments = data.data.filter((c: any) => c.parentId)

      // Gắn replies vào comment cha
      const commentsWithReplies = parentComments.map((parent: any) => ({
        ...parent,
        replies: childComments.filter((child: any) => child.parentId === parent.id)
      }))

      setComments(commentsWithReplies)
      setCommentPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching comments:', err)
    } finally {
      setCommentLoading(false)
    }
  }

  const handlePostComment = async () => {
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      await createComment(id as string, {
        userId: currentUser?.id,
        content: newComment
      })

      setNewComment('')
      setCommentPage(1)
      fetchComments()
    } catch (err) {
      console.error('Error posting comment:', err)
      alert('Không thể đăng bình luận')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePostReply = async (parentId: number) => {
    if (!replyContent.trim()) return

    setSubmitting(true)
    try {
      await createComment(id as string, {
        userId: currentUser?.id,
        content: replyContent,
        parentId
      })

      setReplyContent('')
      setReplyTo(null)
      fetchComments()
    } catch (err) {
      console.error('Error posting reply:', err)
      alert('Không thể đăng trả lời')
    } finally {
      setSubmitting(false)
    }
  }
  const handleShare = () => {
    const url = window.location.href;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank");
  };
  const handleLike = async () => {
    await likeBlog(id as string)
    setBlog((prev: any) => ({
      ...prev,
      hearts: prev?.hearts + 1
    }))
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return 'Invalid date'
    }
  }

  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return formatDate(dateString)
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
        <div className='text-center'>
          <div className='loading-spinner mx-auto mb-4'></div>
          <p className='text-lg text-gray-600'>Loading article...</p>
        </div>
        <style>{`
          .loading-spinner {
            border: 4px solid #f3f4f6;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
        <div className='text-center'>
          <p className='text-lg text-gray-600'>Blog not found</p>
          <button
            onClick={() => window.history.back()}
            className='mt-4 rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700'
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }
  const shareUrl = window.location.href;
  const shareImage = blog?.image || 'https://via.placeholder.com/1200x630?text=Blog+Image';
  const shareDescription = blog?.excerpt || (blog?.content ? blog.content.replace(/<[^>]*>/g, '').substring(0, 150) : 'Read this amazing article');
  console.log(shareDescription)
  console.log(shareImage)
  console.log(shareUrl)
  console.log(blog?.title)
  return (
    <>
    <Helmet>
        {/* Basic Meta Tags */}
        <title>{blog?.title || 'Blog Detail'}</title>
        <meta name="description" content={shareDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:title" content={blog?.title} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:image" content={shareImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Helmet>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .image-hover {
          transition: transform 0.5s ease;
        }

        .hover-lift:hover .image-hover {
          transform: scale(1.1);
        }

        .content-style h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          line-height: 1.3;
        }

        .content-style h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #334155;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .content-style p {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #475569;
          margin-bottom: 1.5rem;
        }

        .action-button {
          transition: all 0.3s ease;
        }

        .action-button:hover {
          transform: scale(1.1);
        }

        .tag-hover {
          transition: all 0.3s ease;
        }

        .tag-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .stagger-item {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .stagger-item:nth-child(1) { animation-delay: 0.1s; }
        .stagger-item:nth-child(2) { animation-delay: 0.2s; }
        .stagger-item:nth-child(3) { animation-delay: 0.3s; }

        .comment-reply-indicator {
          border-left: 3px solid #667eea;
          background: linear-gradient(90deg, rgba(102, 126, 234, 0.05) 0%, transparent 100%);
        }
      `}</style>

      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
        {/* Back Button */}
        <div className={`mx-auto max-w-6xl px-4 pt-8 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          <button
            onClick={() => window.history.back()}
            className='group flex items-center gap-2 font-semibold text-gray-600 transition-colors duration-300 hover:text-indigo-600'
          >
            <ArrowLeftOutlined className='transition-transform duration-300 group-hover:-translate-x-1' />
            <span>Back to Blog</span>
          </button>
        </div>

        {/* Hero Image */}
        <div className={`mx-auto mt-8 max-w-6xl px-4 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className='relative overflow-hidden rounded-3xl shadow-2xl' style={{ animationDelay: '0.1s' }}>
            <img
              src={blog?.coverImage || blog?.image || 'https://via.placeholder.com/1200x400'}
              alt={blog?.title || 'Blog cover'}
              className='h-96 w-full object-cover'
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/1200x400?text=No+Image'
              }}
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent'></div>
          </div>
        </div>

        {/* Main Content */}
        <div className='mx-auto max-w-6xl px-4 py-8'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            {/* Article Content */}
            <div className='lg:col-span-2'>
              {/* Title & Meta */}
              <div
                className={`mb-6 rounded-3xl bg-white p-8 shadow-xl ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                style={{ animationDelay: '0.2s' }}
              >
                {blog?.tags && blog.tags.length > 0 && (
                  <div className='mb-6 flex flex-wrap gap-2'>
                    {blog.tags.map((tag: any, idx: number) => (
                      <span
                        key={idx}
                        className='tag-hover rounded-full border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-1.5 text-sm font-semibold text-indigo-700'
                      >
                        #{tag?.name || ''}
                      </span>
                    ))}
                  </div>
                )}

                <h1 className='mb-6 text-4xl font-extrabold leading-tight text-gray-900 lg:text-5xl'>{blog.title}</h1>

                <div className='flex flex-wrap items-center gap-6 border-b border-gray-200 pb-6 text-gray-600'>
                  <div className='flex items-center gap-2'>
                    <CalendarOutlined className='text-indigo-500' />
                    <span className='font-medium'>{formatDate(blog?.createdAt || blog?.date)}</span>
                  </div>
                  {blog?.readTime && (
                    <div className='flex items-center gap-2'>
                      <ClockCircleOutlined className='text-purple-500' />
                      <span className='font-medium'>{blog.readTime} min read</span>
                    </div>
                  )}
                  {blog?.views && (
                    <div className='flex items-center gap-2'>
                      <EyeOutlined className='text-blue-500' />
                      <span className='font-medium'>{blog.views.toLocaleString()} views</span>
                    </div>
                  )}
                </div>

                {blog?.user && (
                  <div className='mt-6 flex items-center gap-4'>
                    <img
                      src={blog.user.avatar || 'https://via.placeholder.com/56'}
                      alt={blog.user.name || 'Author'}
                      className='h-14 w-14 rounded-full border-4 border-indigo-100'
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/56?text=Avatar'
                      }}
                    />
                    <div>
                      <p className='font-bold text-gray-900'>{blog.user.name || 'Anonymous'}</p>
                      <p className='text-sm text-gray-600'>{blog.user.bio || ''}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Article Body */}
              <div
                className={`mb-6 rounded-3xl bg-white p-8 shadow-xl ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                style={{ animationDelay: '0.3s' }}
              >
                <div
                  className='content-style'
                  dangerouslySetInnerHTML={{ __html: blog.content?.toString() || '<p>No content available</p>' }}
                />
              </div>

              {/* Action Buttons */}
              <div
                className={`mb-6 rounded-3xl bg-white p-6 shadow-xl ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                style={{ animationDelay: '0.4s' }}
              >
                <div className='flex flex-wrap items-center justify-between gap-4'>
                  <div className='flex items-center gap-4'>
                  <button className='cursor-pointer action-button flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 px-6 py-3 font-semibold text-red-600 transition-all hover:from-red-100 hover:to-pink-100' onClick={handleLike}>
                      <HeartOutlined />
                      <span>{blog?.hearts || 0}</span>
                    </button>
                    <button className='action-button flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 font-semibold text-blue-600 transition-all hover:from-blue-100 hover:to-indigo-100'>
                      <MessageOutlined />
                      <span>{comments.length}</span>
                    </button>
                    <button onClick={() => handleShare()} className='action-button flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg'>
                    <ShareAltOutlined />
                    <span>Share</span>
                  </button>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div
                className={`mb-16 rounded-3xl bg-white p-8 shadow-xl ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                style={{ animationDelay: '0.5s' }}
              >
                <h2 className='mb-6 text-2xl font-bold text-gray-900'>
                  Comments
                  {commentPagination && (
                    <span className='ml-2 text-lg font-normal text-gray-500'>({commentPagination.total})</span>
                  )}
                </h2>

                {/* New Comment Input */}
                <div className='mb-8 flex gap-4'>
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className='h-12 w-12 rounded-full border-2 border-indigo-100'
                  />
                  <div className='flex-1'>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder='Write your comment...'
                      className='w-full rounded-xl border-2 border-gray-200 p-4 text-gray-700 focus:border-indigo-500 focus:outline-none'
                      rows={3}
                    />
                    <div className='mt-2 flex justify-end'>
                      <button
                        onClick={handlePostComment}
                        disabled={submitting || !newComment.trim()}
                        className='flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 font-semibold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        <SendOutlined />
                        <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                {commentLoading ? (
                  <div className='py-8 text-center'>
                    <div className='loading-spinner mx-auto mb-4'></div>
                    <p className='text-gray-600'>Loading comments...</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className='py-12 text-center'>
                    <MessageOutlined className='mb-2 text-4xl text-gray-300' />
                    <p className='text-gray-500'>No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  <div className='space-y-6 mb-16'>
                    {comments.map((comment) => (
                      <div key={comment.id} className='border-b border-gray-100 pb-6 last:border-0'>
                        {/* Parent Comment */}
                        <div className='flex gap-4'>
                          <img
                            src={comment.user?.avatar || 'https://via.placeholder.com/48'}
                            alt={comment.user?.name || 'User'}
                            className='h-12 w-12 rounded-full border-2 border-gray-200'
                          />
                          <div className='flex-1'>
                            <div className='rounded-2xl bg-gray-50 p-4'>
                              <div className='mb-2 flex items-center justify-between'>
                                <h4 className='font-bold text-gray-900'>{comment.user?.name || 'Anonymous'}</h4>
                                <span className='text-sm text-gray-500'>{formatRelativeTime(comment.createdAt)}</span>
                              </div>
                              <p className='text-gray-700'>{comment.content}</p>
                            </div>
                            <button
                              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                              className='mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700'
                            >
                              Reply
                            </button>

                            {/* Reply Input */}
                            {replyTo === comment.id && (
                              <div className='mt-4 flex gap-3 pl-4'>
                                <img
                                  src={currentUser?.avatar}
                                  alt={currentUser?.name}
                                  className='h-10 w-10 rounded-full border-2 border-indigo-100'
                                />
                                <div className='flex-1'>
                                  <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`Reply to ${comment.user?.name}...`}
                                    className='w-full rounded-xl border-2 border-gray-200 p-3 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none'
                                    rows={2}
                                  />
                                  <div className='mt-2 flex justify-end gap-2'>
                                    <button
                                      onClick={() => {
                                        setReplyTo(null)
                                        setReplyContent('')
                                      }}
                                      className='rounded-lg px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100'
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handlePostReply(comment.id)}
                                      disabled={submitting || !replyContent.trim()}
                                      className='rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
                                    >
                                      {submitting ? 'Posting...' : 'Reply'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className='mt-4 space-y-4 pl-8'>
                                {comment.replies.map((reply: any) => (
                                  <div key={reply.id} className='comment-reply-indicator flex gap-3 py-2 pl-4'>
                                    <img
                                      src={reply.user?.avatar || 'https://via.placeholder.com/40'}
                                      alt={reply.user?.name || 'User'}
                                      className='h-10 w-10 rounded-full border-2 border-gray-200'
                                    />
                                    <div className='flex-1'>
                                      <div className='rounded-xl bg-gray-50 p-3'>
                                        <div className='mb-1 flex items-center justify-between'>
                                          <h5 className='text-sm font-bold text-gray-900'>
                                            {reply.user?.name || 'Anonymous'}
                                          </h5>
                                          <span className='text-xs text-gray-500'>
                                            {formatRelativeTime(reply.createdAt)}
                                          </span>
                                        </div>
                                        <p className='text-sm text-gray-700'>{reply.content}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {commentPagination && commentPagination.totalPages > 1 && (
                  <div className='mt-8 flex items-center justify-center gap-2'>
                    <button
                      onClick={() => setCommentPage((p) => Math.max(1, p - 1))}
                      disabled={commentPage === 1}
                      className='rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      ‹
                    </button>

                    {[...Array(commentPagination.totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCommentPage(i + 1)}
                        className={`h-10 w-10 rounded-lg font-semibold transition-all ${
                          commentPage === i + 1
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCommentPage((p) => Math.min(commentPagination.totalPages, p + 1))}
                      disabled={commentPage === commentPagination.totalPages}
                      className='rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className='lg:col-span-1'>
              {/* Author Card */}
              {blog?.user && (
                <div
                  className={`mb-6 rounded-3xl bg-white p-6 shadow-xl ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}
                  style={{ animationDelay: '0.2s' }}
                >
                  <h3 className='mb-4 text-xl font-bold text-gray-900'>About the Author</h3>
                  <div className='text-center'>
                    <img
                      src={blog.user.avatar || 'https://via.placeholder.com/96'}
                      alt={blog.user.name || 'Author'}
                      className='mx-auto mb-4 h-24 w-24 rounded-full border-4 border-indigo-100'
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/96?text=Avatar'
                      }}
                    />
                    <h4 className='mb-2 text-lg font-bold text-gray-900'>{blog.user.name || 'Anonymous'}</h4>
                  </div>
                </div>
              )}

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div
                  className={`mb-16 rounded-3xl bg-white p-6 shadow-xl ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}
                  style={{ animationDelay: '0.3s' }}
                >
                  <h3 className='mb-6 text-xl font-bold text-gray-900'>Related Articles</h3>
                  <div className='space-y-4'>
                    {relatedPosts.map((post, idx) => (
                      <div
                        key={post.id || idx}
                        className={`hover-lift stagger-item cursor-pointer overflow-hidden rounded-2xl bg-gray-50`}
                        onClick={() => (window.location.href = `/blog/${post.id}`)}
                      >
                        <div className='h-40 overflow-hidden'>
                          <img
                            src={post.image || post.coverImage || 'https://via.placeholder.com/400x160'}
                            alt={post.title || 'Related post'}
                            className='image-hover h-full w-full object-cover'
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/400x160?text=No+Image'
                            }}
                          />
                        </div>
                        <div className='p-4'>
                          <h4 className='mb-2 line-clamp-2 font-bold text-gray-900 transition-colors hover:text-indigo-600'>
                            {post.title}
                          </h4>
                          <div className='flex items-center gap-4 text-xs text-gray-500'>
                            <span className='flex items-center gap-1'>
                              <CalendarOutlined />
                              {formatDate(post.date || post.createdAt)}
                            </span>
                            {post.readTime && (
                              <span className='flex items-center gap-1'>
                                <ClockCircleOutlined />
                                {post.readTime} min
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogDetail
