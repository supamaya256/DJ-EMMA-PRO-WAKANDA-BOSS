import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, User, Clock, Heart, Loader2 } from 'lucide-react';
import { Comment } from '../types';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'news' | 'live' | 'nonstop';
  targetTitle: string;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetType,
  targetTitle,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState(() => {
    return localStorage.getItem('dj_emma_commenter_name') || '';
  });
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load comments whenever modal opens for targetId
  useEffect(() => {
    if (!isOpen || !targetId) return;

    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);

    fetch(`/api/comments?targetId=${encodeURIComponent(targetId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data)) {
            setComments(data);
          } else {
            setComments([]);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Could not load comments:', err);
          setComments([]);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, targetId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMsg('Please write a comment before posting.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const chosenName = authorName.trim() || 'Wakanda Fan';
    localStorage.setItem('dj_emma_commenter_name', chosenName);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId,
          targetType,
          authorName: chosenName,
          content: content.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setContent('');
        setSuccessMsg('Your comment has been posted!');
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(data.error || 'Failed to post comment. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('Network error. Could not post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCommentTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffSecs = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diffSecs < 60) return 'Just now';
      if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
      if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  const getTypeLabel = () => {
    switch (targetType) {
      case 'live':
        return 'LIVE MIX';
      case 'nonstop':
        return 'NONSTOP';
      default:
        return 'NEWS POST';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#1a1d24] border border-white/20 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-white/[0.05] to-transparent shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400 block">
                {getTypeLabel()} • COMMENTS
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white truncate font-display" title={targetTitle}>
                {targetTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition shrink-0"
            aria-label="Close comments"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 no-scrollbar min-h-[160px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="text-xs">Loading comments...</span>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10 space-y-2 text-slate-400">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-500">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">No comments yet</p>
              <p className="text-xs text-slate-500">
                Be the first to share your thoughts, hype, or love for DJ EMMA PRO!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500/30 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-200 text-[10px] font-bold">
                      {comment.authorName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-white">
                      {comment.authorName}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {formatCommentTime(comment.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-slate-200 pl-8 whitespace-pre-line leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Comment Posting Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-[#14161c] shrink-0 space-y-2.5">
          {errorMsg && (
            <div className="text-[11px] text-rose-300 bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-xl">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="text-[11px] text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
              {successMsg}
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Your Name (e.g. Brian, Wakanda Fan)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                maxLength={40}
                className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <textarea
              placeholder="Write your comment or reaction..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              maxLength={400}
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
            />

            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="self-end px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Post</span>
                </>
              )}
            </button>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center justify-between px-1">
            <span>Anyone can comment • No login required</span>
            <span>{content.length}/400</span>
          </div>
        </form>
      </div>
    </div>
  );
};
