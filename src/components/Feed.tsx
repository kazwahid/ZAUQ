'use client';

import React, { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { RankedCatalogItem } from '@/types/catalog';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import { triggerHaptic } from '@/lib/haptics';

interface FeedProps {
  items: RankedCatalogItem[];
  likedIds: string[];
  skippedIds: string[];
  savedIds: string[];
  onLike: (id: string) => void;
  onSkip: (id: string) => void;
  onToggleSave: (id: string) => void;
  onRemoveLastFilter: () => void;
  onClearAllFilters: () => void;
  hasActiveFilters: boolean;
  onToast: (msg: string) => void;
  onSelectDetail?: (item: RankedCatalogItem) => void;
}

export const Feed: React.FC<FeedProps> = ({
  items,
  likedIds,
  skippedIds,
  savedIds,
  onLike,
  onSkip,
  onToggleSave,
  onRemoveLastFilter,
  onClearAllFilters,
  hasActiveFilters,
  onToast,
  onSelectDetail,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Desktop Keyboard navigation (ArrowDown / ArrowUp / J / K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((document.activeElement?.tagName || '').toLowerCase())) {
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        scrollNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        scrollPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        top: containerRef.current.clientHeight * 0.9,
        behavior: 'smooth',
      });
      triggerHaptic('light');
    }
  };

  const scrollPrev = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        top: -containerRef.current.clientHeight * 0.9,
        behavior: 'smooth',
      });
      triggerHaptic('light');
    }
  };

  return (
    <section className="relative w-full h-[calc(100dvh-3.75rem)] flex items-center justify-center overflow-hidden">
      {items.length === 0 ? (
        <div className="w-full max-w-lg mx-auto p-4">
          <EmptyState
            onRemoveLastFilter={onRemoveLastFilter}
            onClearAll={onClearAllFilters}
            hasFilters={hasActiveFilters}
          />
        </div>
      ) : (
        <>
          {/* Scrollable Reel Snap Container - Single Product At A Time */}
          <div
            ref={containerRef}
            className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar flex flex-col items-center"
          >
            <AnimatePresence>
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="w-full max-w-sm sm:max-w-[420px] h-[calc(100dvh-4.25rem)] snap-start snap-always shrink-0 flex items-center justify-center p-2.5 sm:p-3"
                >
                  <Card
                    item={item}
                    isSaved={savedIds.includes(item.id)}
                    isLiked={likedIds.includes(item.id)}
                    isSkipped={skippedIds.includes(item.id)}
                    onLike={onLike}
                    onSkip={onSkip}
                    onToggleSave={onToggleSave}
                    onClickDetail={onSelectDetail}
                    onToast={onToast}
                    showMatchScore={hasActiveFilters}
                    isStreamMode={true}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation Floating Controls */}
          <div className="hidden lg:flex flex-col gap-2 absolute right-8 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
            <button
              type="button"
              onClick={scrollPrev}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#111111] shadow-md border border-[#E8E2D9] transition-all active:scale-90 hover:scale-105"
              aria-label="Previous look"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#111111] shadow-md border border-[#E8E2D9] transition-all active:scale-90 hover:scale-105"
              aria-label="Next look"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </section>
  );
};
