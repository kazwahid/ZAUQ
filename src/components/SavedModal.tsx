'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, ExternalLink, Trash2, Share2, Sparkles } from 'lucide-react';
import { CatalogItem } from '@/types/catalog';

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: CatalogItem[];
  onRemoveSaved: (id: string) => void;
  onClearSaved: () => void;
  onToast: (msg: string) => void;
}

export const SavedModal: React.FC<SavedModalProps> = ({
  isOpen,
  onClose,
  savedItems,
  onRemoveSaved,
  onClearSaved,
  onToast,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleShareWishlist = () => {
    if (savedItems.length === 0) return;
    const summary = savedItems
      .map((item, idx) => `${idx + 1}. ${item.brand ? `${item.brand} - ` : ''}${item.name} ($${item.price})`)
      .join('\n');
    const textToCopy = `✨ My Zauq (ذوق) Fashion Wishlist:\n\n${summary}\n\nDiscover your taste at Zauq.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      onToast('Wishlist copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="saved-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col z-10 border-l border-[#E8E2D9]"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#E8E2D9] flex items-center justify-between bg-white/90 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h2
                    id="saved-modal-title"
                    className="font-serif text-lg font-semibold text-[#111111]"
                  >
                    Saved Wardrobe
                  </h2>
                  <p className="text-xs text-[#786E65]">
                    {savedItems.length} {savedItems.length === 1 ? 'piece' : 'pieces'} curated
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {savedItems.length > 0 && (
                  <button
                    onClick={handleShareWishlist}
                    className="p-2 rounded-full text-[#786E65] hover:text-[#111111] hover:bg-[#F2ECE4] transition-colors"
                    title="Copy wishlist to clipboard"
                    aria-label="Share wishlist"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-[#786E65] hover:text-[#111111] hover:bg-[#F2ECE4] transition-colors"
                  aria-label="Close saved drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {savedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 py-16">
                  <div className="w-14 h-14 rounded-2xl bg-[#F2ECE4] flex items-center justify-center text-[#786E65] mb-3">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-base font-medium text-[#111111] mb-1">
                    Your collection is empty
                  </h3>
                  <p className="text-xs text-[#786E65] max-w-xs leading-relaxed">
                    Tap the bookmark icon on any card in the feed or explore page to save pieces for your occasion.
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {savedItems.map((item) => {
                    const googleShoppingUrl = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(
                      `${item.brand || ''} ${item.name}`
                    )}`;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group flex gap-3.5 p-3 rounded-2xl bg-white border border-[#E8E2D9] shadow-xs hover:shadow-md transition-all"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#F2ECE4] shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            {item.brand && (
                              <p className="text-[10px] uppercase tracking-wider text-[#786E65] font-semibold">
                                {item.brand}
                              </p>
                            )}
                            <h4 className="font-serif text-sm font-medium text-[#111111] truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs font-semibold text-[#111111] mt-0.5">
                              ${item.price}
                            </p>
                          </div>

                          {/* Action Links */}
                          <div className="flex items-center justify-between pt-2 border-t border-[#F2ECE4] mt-2">
                            <a
                              href={googleShoppingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#111111] hover:underline transition-colors"
                            >
                              <span>Find on Google</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                              onClick={() => onRemoveSaved(item.id)}
                              className="p-1 rounded-md text-[#786E65] hover:text-[#DC2626] hover:bg-red-50 transition-colors"
                              aria-label={`Remove ${item.name} from saved`}
                              title="Remove from saved"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer Summary */}
            {savedItems.length > 0 && (
              <div className="p-4 border-t border-[#E8E2D9] bg-white/90 backdrop-blur-md flex items-center justify-between">
                <button
                  onClick={onClearSaved}
                  className="text-xs text-[#DC2626] hover:underline font-medium"
                >
                  Clear all saved
                </button>

                <button
                  onClick={handleShareWishlist}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111111] text-white text-xs font-medium hover:bg-[#2C2724] transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Copy Wishlist</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
