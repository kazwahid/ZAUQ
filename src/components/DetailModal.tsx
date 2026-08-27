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

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 border border-[#E8E2D9] max-h-[90vh] flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image Side */}
            <div className="relative w-full md:w-1/2 aspect-[3/4] md:aspect-auto bg-[#F4EFEA] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover object-center"
              />
              {item.score > 0 && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111]/85 backdrop-blur-md text-white text-xs font-semibold border border-white/15">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>{Math.round(item.score * 10)}% Vibe Match</span>
                </div>
              )}
            </div>

            {/* Content Side */}
            <div className="p-6 md:p-8 flex flex-col justify-between flex-1 overflow-y-auto bg-white">
              <div className="space-y-4">
                <div>
                  {item.brand && (
                    <p className="text-[11px] uppercase tracking-widest text-[#786E65] font-semibold mb-1">
                      {item.brand}
                    </p>
                  )}
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#111111] leading-snug">
                    {item.name}
                  </h2>
                  <p className="text-lg font-semibold text-[#111111] mt-1.5">
                    ${item.price}
                  </p>
                </div>

                {item.description && (
                  <p className="text-xs sm:text-sm text-[#57504B] leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Tags Breakdown */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#786E65] font-semibold">
                    Aesthetic Profile
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.occasion.map((occ) => (
                      <span
                        key={occ}
                        className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E8E2D9] text-[#2C2724] text-xs"
                      >
                        {occ}
                      </span>
                    ))}
                    {item.palette.map((pal) => (
                      <span
                        key={pal}
                        className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E8E2D9] text-[#786E65] text-xs"
                      >
                        {pal}
                      </span>
                    ))}
                    {item.silhouette.map((sil) => (
                      <span
                        key={sil}
                        className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E8E2D9] text-[#786E65] text-xs"
                      >
                        {sil}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-[#E8E2D9] flex flex-col gap-3">
                <a
                  href={googleShoppingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#111111] text-white hover:bg-[#2C2724] text-xs font-semibold tracking-wide transition-all shadow-sm"
                >
                  <span>Find & Shop on Google</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onLike(item.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-xs font-medium transition-all ${
                      isLiked
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-white text-[#2C2724] border-[#E8E2D9] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleSave(item.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-xs font-medium transition-all ${
                      isSaved
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-[#2C2724] border-[#E8E2D9] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`}
                    />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
