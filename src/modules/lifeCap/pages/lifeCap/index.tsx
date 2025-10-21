import { useState } from 'react'

interface CommentType {
  id: number;
  author: string;
  avatar?: string;
  content: string;
  datetime: string;
  votes: number;
  userVote: 'up' | 'down' | null;
  replies: CommentType[];
  isRemoved?: boolean;
  isOP?: boolean;
  edited?: string;
}

const RedditCommentSystem = () => {
  const [comments, setComments] = useState<CommentType[]>([
    {
      id: 1,
      author: 'NuFu',
      content: "I can't speak from personal experience, but I do know one thing.\n\nIt's not your fault.",
      datetime: '2h ago',
      votes: 246,
      userVote: null,
      replies: [
        {
          id: 2,
          author: 'SeriousAccount66',
          content: 'Comment removed by Reddit',
          datetime: '1h ago',
          edited: '1h ago',
          votes: 47,
          userVote: null,
          isRemoved: true,
          replies: [
            {
              id: 3,
              author: 'squishymelonus',
              content: "thank you for caring. i don't wish any of them harm tho because what if they actually didn't mean to hurt me idk... i feel like it's my fault these things happened so that's why i am afraid to talk to them about or pursue any kind of retribution. i don't even want to blame them bc they're like untrained animals. with 0 higher consciousness just running off survival instincts. i was naive for the choices i made to trust them. i just want men to listen and learn the first time that no means no. crying means no. and if a girl is basically passed out drunk that also is an automatic no. i want for men to hold their friends accountable for this. & for myself to learn how to grow out of this situation & hopefully help others",
              datetime: '1h ago',
              votes: 8,
              userVote: null,
              isOP: true,
              replies: []
            }
          ]
        }
      ]
    },
    {
      id: 4,
      author: 'Any-Interest-7225',
      content: "it's my fault these things happened so that's why i am afraid to talk to them about or pursue any kind of retribution.",
      datetime: '43m ago',
      edited: '38m ago',
      votes: 0,
      userVote: null,
      replies: []
    }
  ])

  const [replyText, setReplyText] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [expandedComments, setExpandedComments] = useState<number[]>([])

  const handleVote = (commentId: number, voteType: 'up' | 'down') => {
    setComments(prevComments => {
      const updateComment = (comment: CommentType): CommentType => {
        if (comment.id === commentId) {
          const currentVote = comment.userVote
          let newVote: 'up' | 'down' | null = voteType
          let voteDiff = 0

          if (currentVote === voteType) {
            newVote = null
            voteDiff = voteType === 'up' ? -1 : 1
          } else if (currentVote === null) {
            voteDiff = voteType === 'up' ? 1 : -1
          } else {
            voteDiff = voteType === 'up' ? 2 : -2
          }

          return {
            ...comment,
            userVote: newVote,
            votes: comment.votes + voteDiff
          }
        }

        return {
          ...comment,
          replies: comment.replies.map(updateComment)
        }
      }

      return prevComments.map(updateComment)
    })
  }

  const handleReply = (commentId: number) => {
    if (!replyText.trim()) return

    const newReply: CommentType = {
      id: Date.now(),
      author: 'CurrentUser',
      content: replyText,
      datetime: 'now',
      votes: 0,
      userVote: null,
      replies: []
    }

    setComments(prevComments => {
      const addReply = (comment: CommentType): CommentType => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply]
          }
        }
        return {
          ...comment,
          replies: comment.replies.map(addReply)
        }
      }

      return prevComments.map(addReply)
    })

    setReplyText('')
    setReplyingTo(null)
  }

  const toggleCommentExpansion = (commentId: number) => {
    setExpandedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    )
  }

  const CommentComponent = ({ comment, depth = 0 }: { comment: CommentType; depth?: number }) => {
    const canHaveReplies = depth < 2;

    return (
      <div className={`comment-container ${depth > 0 ? 'ml-8' : ''}`}>
        <div className="flex gap-2">
          {/* Vote buttons */}
          <div className="flex flex-col items-center pt-1">
            <button
              onClick={() => handleVote(comment.id, 'up')}
              className={`p-1 rounded hover:bg-gray-100 ${
                comment.userVote === 'up' ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
              </svg>
            </button>
            <span className={`text-xs font-medium ${
              comment.userVote === 'up' ? 'text-orange-500' : 
              comment.userVote === 'down' ? 'text-blue-500' : 'text-gray-600'
            }`}>
              {comment.votes}
            </span>
            <button
              onClick={() => handleVote(comment.id, 'down')}
              className={`p-1 rounded hover:bg-gray-100 ${
                comment.userVote === 'down' ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="m7 10 5 5 5-5z"/>
              </svg>
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <span className="font-medium text-sm text-gray-900">{comment.author}</span>
              {comment.isOP && (
                <span className="text-xs bg-blue-500 text-white px-1 rounded">OP</span>
              )}
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{comment.datetime}</span>
              {comment.edited && (
                <>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">Edited {comment.edited}</span>
                </>
              )}
            </div>

            <div className={`text-sm mb-2 ${comment.isRemoved ? 'text-gray-500 italic' : 'text-gray-900'}`}>
              {comment.content.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              {canHaveReplies ? (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1 .2 0 .5-.1.7-.3L14.4 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12H5v-2h8v2zm3-3H5V9h11v2zm0-3H5V6h11v2z"/>
                  </svg>
                  Reply
                </button>
              ) : (
                <span className="text-gray-400 text-xs">Maximum reply depth reached</span>
              )}
              <button className="flex items-center gap-1 hover:text-gray-700">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                </svg>
                Share
              </button>
              <button className="hover:text-gray-700">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
              {comment.replies.length > 0 && (
                <button
                  onClick={() => toggleCommentExpansion(comment.id)}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d={expandedComments.includes(comment.id) 
                      ? "M7 10l5 5 5-5z" 
                      : "M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"
                    }/>
                  </svg>
                  {expandedComments.includes(comment.id) ? 'Hide Replies' : `Show ${comment.replies.length} Replies`}
                </button>
              )}
            </div>

            {replyingTo === comment.id && canHaveReplies && (
              <div className="mt-3 mb-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="w-full p-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReply(comment.id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={!replyText.trim()}
                  >
                    Comment
                  </button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies.length > 0 && expandedComments.includes(comment.id) && (
              <div className="mt-4">
                {comment.replies.map(reply => (
                  <CommentComponent key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </div>
            )}
          </div>
        </div>

        {depth === 0 && <div className="border-b border-gray-200 my-4"></div>}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white">
      <div className="bg-white rounded-lg">
        {/* Main reply form */}
        <div className="mb-6">
          <textarea
            placeholder="What are your thoughts?"
            className="w-full p-3 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          <div className="flex justify-end mt-2">
            <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
              Comment
            </button>
          </div>
        </div>

        {/* Comments */}
        <div>
          {comments.map(comment => (
            <CommentComponent key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RedditCommentSystem