'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Bookmark, ExternalLink, Sparkles } from 'lucide-react';
import { RankedCatalogItem } from '@/types/catalog';

interface DetailModalProps {
  item: RankedCatalogItem | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  isLiked: boolean;
  onToggleSave: (id: string) => void;
  onLike: (id: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  item,
  isOpen,
  onClose,
  isSaved,
  isLiked,
  onToggleSave,
  onLike,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!item) return null;

  const googleShoppingUrl = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(
    `${item.brand || ''} ${item.name}`
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Card - Single Screen Fit Without Internal Scrolling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className="relative w-full max-w-sm md:max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 border border-[#E8E2D9] max-h-[85dvh] md:max-h-[500px] flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-colors active:scale-95"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image Side */}
            <div className="relative w-full md:w-1/2 h-52 sm:h-60 md:h-auto bg-[#F4EFEA] shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
              
              {item.score > 0 ? (
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111]/90 backdrop-blur-md text-white text-[11px] font-medium border border-white/15">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span>{Math.round(item.score * 10)}% Match</span>
                </div>
              ) : (
                <span className="absolute top-3.5 left-3.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#111111]">
                  {item.category}
                </span>
              )}

              {/* Price badge on mobile image */}
              <div className="absolute bottom-2.5 left-3 md:hidden">
                <span className="text-white text-lg font-bold drop-shadow-md">
                  ${item.price}
                </span>
              </div>
            </div>

            {/* Content Side */}
            <div className="p-4 sm:p-5 md:p-6 flex flex-col justify-between flex-1 bg-white overflow-hidden">
              <div className="space-y-2">
                <div>
                  {item.brand && (
                    <p className="text-[10px] uppercase tracking-widest text-[#786E65] font-semibold">
                      {item.brand}
                    </p>
                  )}
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="font-serif text-lg sm:text-xl font-medium text-[#111111] leading-snug line-clamp-2">
                      {item.name}
                    </h2>
                    <span className="hidden md:inline text-lg font-semibold text-[#111111]">
                      ${item.price}
                    </span>
                  </div>
                </div>

                {item.description && (
                  <p className="text-xs text-[#57504B] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Aesthetic Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {item.occasion?.slice(0, 2).map((occ) => (
                    <span
                      key={occ}
                      className="px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-[10px] font-medium text-[#2C2724]"
                    >
                      #{occ}
                    </span>
                  ))}
                  {item.palette?.slice(0, 1).map((pal) => (
                    <span
                      key={pal}
                      className="px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-[10px] font-medium text-[#2C2724]"
                    >
                      {pal}
                    </span>
                  ))}
                  {item.silhouette?.slice(0, 1).map((sil) => (
                    <span
                      key={sil}
                      className="px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-[10px] font-medium text-[#2C2724]"
                    >
                      {sil}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 mt-2 border-t border-[#F2ECE4] flex items-center gap-2">
                {/* Like Button */}
                <button
                  type="button"
                  onClick={() => onLike(item.id)}
                  className={`p-2.5 rounded-full border transition-all active:scale-95 flex items-center justify-center shrink-0 ${
                    isLiked
                      ? 'bg-[#FF2D55] text-white border-[#FF2D55] shadow-xs'
                      : 'bg-white text-[#57504B] border-[#E8E2D9] hover:bg-[#FAF8F5]'
                  }`}
                  aria-label={isLiked ? 'Liked look' : 'Like look'}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                </button>

                {/* Save to Wardrobe Button */}
                <button
                  type="button"
                  onClick={() => onToggleSave(item.id)}
                  className={`p-2.5 rounded-full border transition-all active:scale-95 flex items-center justify-center shrink-0 ${
                    isSaved
                      ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                      : 'bg-white text-[#57504B] border-[#E8E2D9] hover:bg-[#FAF8F5]'
                  }`}
                  aria-label={isSaved ? 'Remove from wardrobe' : 'Save to wardrobe'}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                </button>

                {/* Primary CTA Shop Link */}
                <a
                  href={googleShoppingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-all active:scale-95 shadow-xs"
                >
                  <span>Shop Look</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
