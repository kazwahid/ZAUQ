'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, Sparkles, Share2 } from 'lucide-react';
import { RankedCatalogItem } from '@/types/catalog';
import { triggerHaptic } from '@/lib/haptics';

interface CardProps {
  item: RankedCatalogItem;
  isSaved: boolean;
  isLiked: boolean;
  isSkipped?: boolean;
  onLike: (id: string) => void;
  onSkip?: (id: string) => void;
  onToggleSave: (id: string) => void;
  onClickDetail?: (item: RankedCatalogItem) => void;
  onToast?: (msg: string) => void;
  showMatchScore?: boolean;
  isDeckMode?: boolean;
  isStreamMode?: boolean;
}

export const Card: React.FC<CardProps> = ({
  item,
  isSaved,
  isLiked,
  onLike,
  onToggleSave,
  onClickDetail,
  onToast,
  showMatchScore = true,
  isStreamMode = true,
}) => {
  const [lastTap, setLastTap] = useState(0);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  // Double tap to like (Instagram/TikTok gesture with double haptic pulse)
  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      e.stopPropagation();
      triggerHaptic('double');
      onLike(item.id);
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
    }
    setLastTap(now);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('medium');
    onLike(item.id);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('success');
    onToggleSave(item.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    const shareText = `Check out ${item.name} (${item.brand || 'Zauq'}) on Zauq: $${item.price}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      if (onToast) onToast('Look details copied to clipboard!');
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col rounded-3xl bg-white overflow-hidden transition-all duration-300 border ${
        isStreamMode ? 'h-full max-h-[80dvh] sm:max-h-[82dvh] w-full shadow-lg border-[#E8E2D9]' : 'aspect-[3/4] border-[#E8E2D9] shadow-xs hover:shadow-md'
      }`}
      aria-label={`${item.name} by ${item.brand || 'Zauq'}`}
    >
      {/* Visual Media Container */}
      <div
        onClick={() => onClickDetail?.(item)}
        onTouchEnd={handleDoubleTap}
        onDoubleClick={handleDoubleTap}
        className="relative w-full h-full overflow-hidden bg-[#F4EFEA] cursor-pointer select-none"
      >
        {/* Main Fashion Look Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out pointer-events-none"
        />

        {/* Cinematic Vignette Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />

        {/* Top Header Floating Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {showMatchScore && item.score > 0 ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111]/90 backdrop-blur-md text-white text-[11px] font-medium tracking-wide border border-white/15 shadow-sm">
                <Sparkles className="w-3 h-3 text-white" />
                <span>{Math.round(item.score * 10)}% Match</span>
              </div>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#111111] shadow-xs">
                {item.category}
              </span>
            )}
          </div>

          <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white font-semibold text-xs border border-white/10">
            ${item.price}
          </span>
        </div>

        {/* Double-tap Heart Burst Animation (Instagram/TikTok style) */}
        <AnimatePresence>
          {showHeartBurst && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0.3, 1.3, 1.1], opacity: [0, 1, 0.9] }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <div className="p-4 rounded-full bg-black/40 backdrop-blur-sm">
                <Heart className="w-20 h-20 text-[#FF2D55] fill-[#FF2D55] drop-shadow-2xl" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right-Side Social Action Rail (TikTok / Reels Layout - only in Stream Mode) */}
        {isStreamMode && (
          <div className="absolute right-3 bottom-4 z-20 flex flex-col items-center gap-3">
            {/* Like Button */}
            <button
              type="button"
              onClick={handleLikeClick}
              className={`flex flex-col items-center justify-center w-10 h-10 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-md ${
                isLiked
                  ? 'bg-[#FF2D55] text-white shadow-[#FF2D55]/30 ring-2 ring-white/30'
                  : 'bg-black/45 text-white hover:bg-black/70 hover:text-[#FF2D55]'
              }`}
              aria-label={isLiked ? 'Liked outfit' : 'Like outfit'}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
            </button>

            {/* Bookmark / Wardrobe Save Button */}
            <button
              type="button"
              onClick={handleSaveClick}
              className={`flex flex-col items-center justify-center w-10 h-10 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-md ${
                isSaved
                  ? 'bg-white text-[#111111] ring-2 ring-white/40'
                  : 'bg-black/45 text-white hover:bg-black/70'
              }`}
              aria-label={isSaved ? 'Remove from wardrobe' : 'Save to wardrobe'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#111111]' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-black/45 text-white hover:bg-black/70 backdrop-blur-md transition-all active:scale-90 shadow-md"
              aria-label="Share outfit"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom Details Content Overlay - only in Stream Mode */}
        {isStreamMode ? (
          <div className="absolute bottom-3 left-3 right-16 z-10 text-white pointer-events-none flex flex-col gap-1">
            {/* AI Recommendation Reason */}
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-stone-200 border border-white/10 w-fit mb-0.5">
              <Sparkles className="w-2.5 h-2.5 text-white shrink-0" />
              <span className="truncate font-medium">
                {item.matchedTags && item.matchedTags.length > 0
                  ? `Matched: ${item.matchedTags.slice(0, 2).map((t) => t.value).join(' & ')}`
                  : `Curated: ${[item.silhouette?.[0], item.occasion?.[0]].filter(Boolean).join(' • ') || 'Zauq Edit'}`}
              </span>
            </div>

            {item.brand && (
              <p className="text-[10px] uppercase tracking-widest text-stone-300 font-semibold mb-0.5 drop-shadow-sm">
                {item.brand}
              </p>
            )}
            <h3 className="font-serif text-base sm:text-lg font-medium leading-snug truncate drop-shadow-md">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-[11px] text-stone-200/90 line-clamp-1 mt-0.5 leading-relaxed drop-shadow-sm">
                {item.description}
              </p>
            )}

            {/* Compact Aesthetic Tag Badges on overlay */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {item.occasion?.slice(0, 2).map((occ) => (
                <span
                  key={occ}
                  className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-medium text-white tracking-wide border border-white/10"
                >
                  #{occ}
                </span>
              ))}
              {item.palette?.slice(0, 1).map((pal) => (
                <span
                  key={pal}
                  className="px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-[9px] font-medium text-stone-200 tracking-wide border border-white/10"
                >
                  {pal}
                </span>
              ))}
            </div>
          </div>
        ) : (
          /* Subtle Instagram Explore Tile Hover Overlay */
          <div className="absolute inset-0 bg-black/0 hover:bg-black/25 transition-colors flex items-end p-2.5 sm:p-3 pointer-events-none opacity-0 group-hover:opacity-100">
            <span className="text-white text-xs font-medium truncate drop-shadow-md">
              {item.name}
            </span>
          </div>
        )}
      </div>

      {/* Matched Specificity Tags Footer (Active only in Stream Mode when filters match) */}
      {isStreamMode && item.matchedTags && item.matchedTags.length > 0 && (
        <div className="px-3.5 py-2 bg-white flex flex-wrap items-center gap-1.5 border-t border-[#F4EFEA]">
          <span className="text-[10px] font-semibold text-[#786E65] uppercase tracking-wider">
            Matched:
          </span>
          {item.matchedTags.slice(0, 3).map((mt) => (
            <span
              key={`${mt.field}-${mt.value}`}
              className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E8E2D9] text-[#111111] text-[10px] font-medium"
            >
              {mt.value}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  );
};

