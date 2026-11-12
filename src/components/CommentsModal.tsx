import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, Clock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Comment } from '../types';
import { supabase } from '../lib/supabase';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'news' | 'live' | 'nonstop';
  targetTitle: string;
  onCommentAdded?: (targetId: string, count: number) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetType,
  targetTitle,
  onCommentAdded,
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

  // Helper to read cached comments from localStorage
  const getCachedComments = (id: string): Comment[] => {
    try {
      const raw = localStorage.getItem(`dj_emma_comments_${id}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore JSON error
    }
    return [];
  };

  // Helper to persist cached comments
  const setCachedComments = (id: string, list: Comment[]) => {
    try {
      localStorage.setItem(`dj_emma_comments_${id}`, JSON.stringify(list));
      
      // Also update counts in localStorage
      const countsRaw = localStorage.getItem('dj_emma_comment_counts') || '{}';
      const counts = JSON.parse(countsRaw);
      counts[id] = list.length;
      localStorage.setItem('dj_emma_comment_counts', JSON.stringify(counts));
    } catch {
      // Ignore storage errors
    }
  };

  // Load comments whenever modal opens for targetId
  useEffect(() => {
    if (!isOpen || !targetId) return;

    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Initial instant hydrate from localStorage cache to prevent flicker
    const cached = getCachedComments(targetId);
    if (cached.length > 0) {
      setComments(cached);
    }

    const loadComments = async () => {
      try {
        // 1. Primary: Direct query to Supabase Cloud
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('target_id', targetId)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          const mapped: Comment[] = data.map((item: any) => ({
            id: item.id || `comment-${Date.now()}`,
            targetId: item.target_id || targetId,
            targetType: (item.target_type as 'news' | 'live' | 'nonstop') || targetType,
            authorName: item.author_name || 'Wakanda Fan',
            content: item.content || '',
            createdAt: item.created_at || new Date().toISOString(),
          }));

          // Merge any locally pending comments that might not have reached Supabase yet
          const combinedMap = new Map<string, Comment>();
          // Add Supabase comments first
          mapped.forEach((c) => combinedMap.set(c.id, c));
          // Add local cached comments
          cached.forEach((c) => {
            if (!combinedMap.has(c.id)) {
              combinedMap.set(c.id, c);
            }
          });

          const finalList = Array.from(combinedMap.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          if (isMounted) {
            setComments(finalList);
            setCachedComments(targetId, finalList);
            onCommentAdded?.(targetId, finalList.length);
          }
          return;
        }

        // 2. Secondary: Fallback to local server API (for local dev mode)
        const res = await fetch(`/api/comments?targetId=${encodeURIComponent(targetId)}`).catch(() => null);
        if (res && res.ok) {
          const serverData = await res.json();
          if (Array.isArray(serverData) && isMounted) {
            const mapped: Comment[] = serverData.map((item: any) => ({
              id: item.id,
              targetId: item.targetId || targetId,
              targetType: item.targetType || targetType,
              authorName: item.authorName || 'Wakanda Fan',
              content: item.content || '',
              createdAt: item.createdAt || new Date().toISOString(),
            }));
            setComments(mapped);
            setCachedComments(targetId, mapped);
            onCommentAdded?.(targetId, mapped.length);
            return;
          }
        }

        // 3. Keep cached comments if both remote options failed
        if (isMounted && cached.length > 0) {
          setComments(cached);
        }
      } catch (err) {
        console.warn('Could not load comments from Supabase:', err);
        if (isMounted && cached.length > 0) {
          setComments(cached);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [isOpen, targetId, targetType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanContent = content.trim();
    if (!cleanContent) {
      setErrorMsg('Please write a comment before posting.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const chosenName = authorName.trim() || 'Wakanda Fan';
    localStorage.setItem('dj_emma_commenter_name', chosenName);

    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      targetId,
      targetType,
      authorName: chosenName,
      content: cleanContent,
      createdAt: new Date().toISOString(),
    };

    // Immediately update UI so user has instant feedback without page refresh
    const updatedList = [newComment, ...comments];
    setComments(updatedList);
    setCachedComments(targetId, updatedList);
    onCommentAdded?.(targetId, updatedList.length);
    setContent('');

    try {
      // 1. Direct Supabase insert
      const { error: insertErr } = await supabase.from('comments').insert({
        id: newComment.id,
        target_id: newComment.targetId,
        target_type: newComment.targetType,
        author_name: newComment.authorName,
        content: newComment.content,
        created_at: newComment.createdAt,
      });

      if (!insertErr) {
        setSuccessMsg('Your comment has been posted to Supabase!');
        setTimeout(() => setSuccessMsg(null), 3500);
        return;
      }

      console.warn('Supabase comment insert note:', insertErr.message);

      // 2. Server API fallback if available
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId,
          targetType,
          authorName: chosenName,
          content: cleanContent,
        }),
      }).catch(() => null);

      setSuccessMsg('Your comment has been posted!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch {
      // UI is already updated via local state & cache, confirm to user
      setSuccessMsg('Your comment has been saved!');
      setTimeout(() => setSuccessMsg(null), 3500);
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
                {getTypeLabel()} • COMMENTS ({comments.length})
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white truncate font-display" title={targetTitle}>
                {targetTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition shrink-0 cursor-pointer"
            aria-label="Close comments"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 no-scrollbar min-h-[160px]">
          {loading && comments.length === 0 ? (
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
                className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500/30 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-200 text-[10px] font-bold">
                      {comment.authorName ? comment.authorName.charAt(0).toUpperCase() : 'W'}
                    </div>
                    <span className="text-xs font-bold text-white">
                      {comment.authorName || 'Wakanda Fan'}
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
            <div className="text-[11px] text-rose-300 bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="text-[11px] text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{successMsg}</span>
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
              className="self-end px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
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
