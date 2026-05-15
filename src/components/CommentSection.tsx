"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Send, MoreHorizontal, Smile } from "lucide-react";
import Image from "next/image";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

const MOCK_COMMENTS: Comment[] = [];

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: "aria_guest",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop",
      },
      text: newComment,
      timestamp: "방금 전",
      likes: 0,
      isLiked: false,
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  const toggleLike = (id: string) => {
    setComments(prev => prev.map(c => 
      c.id === id ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 } : c
    ));
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 px-4">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-forest/5 dark:border-white/10">
        <h3 className="text-xl font-black text-forest dark:text-white/90 flex items-center gap-2 tracking-tighter">
          <MessageCircle className="w-5 h-5 text-accent" />
          댓글 <span className="text-accent">{comments.length}</span>
        </h3>
        <button className="text-xs font-bold text-forest/40 dark:text-white/40 hover:text-accent transition-colors">
          최신순
        </button>
      </div>

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="mb-10 group">
        <div className="relative flex items-center gap-3 p-4 bg-white dark:bg-white/5 rounded-3xl shadow-sm border border-forest/5 dark:border-white/10 group-focus-within:border-accent/30 group-focus-within:shadow-xl group-focus-within:shadow-accent/5 transition-all duration-500">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-forest/5 dark:border-white/10">
            <Image 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop" 
              alt="My Avatar" 
              width={40} 
              height={40} 
              className="object-cover"
            />
          </div>
          <input 
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="칭찬 섞인 따뜻한 댓글을 남겨주세요..."
            className="flex-1 bg-transparent text-sm font-medium text-forest dark:text-white outline-none placeholder:text-forest/20 dark:placeholder:text-white/20"
          />
          <div className="flex items-center gap-2">
            <button type="button" className="p-2 text-forest/20 dark:text-white/20 hover:text-accent transition-colors">
              <Smile size={20} />
            </button>
            <button 
              type="submit"
              disabled={!newComment.trim()}
              className="p-2 bg-accent text-white rounded-2xl hover:bg-forest disabled:opacity-30 disabled:hover:bg-accent transition-all duration-300"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-8">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div 
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex gap-4 group"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-forest/5 dark:border-white/10 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Image 
                  src={comment.user.avatar} 
                  alt={comment.user.name} 
                  width={40} 
                  height={40} 
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-forest dark:text-white tracking-tight">{comment.user.name}</span>
                    <span className="text-[10px] font-bold text-forest/20 dark:text-white/30">{comment.timestamp}</span>
                  </div>
                  <button className="text-forest/20 dark:text-white/20 hover:text-accent opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                <p className="text-sm text-forest/80 dark:text-white/80 font-medium leading-relaxed">
                  {comment.text}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <button 
                    onClick={() => toggleLike(comment.id)}
                    className={`flex items-center gap-1 text-[11px] font-black transition-colors ${comment.isLiked ? 'text-rose-500' : 'text-forest/30 dark:text-white/40 hover:text-rose-500'}`}
                  >
                    <Heart size={14} fill={comment.isLiked ? "currentColor" : "none"} />
                    {comment.likes > 0 && comment.likes}
                  </button>
                  <button className="text-[11px] font-black text-forest/30 dark:text-white/40 hover:text-accent transition-colors uppercase tracking-widest">
                    Reply
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
