'use client';

import React, { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Sparkles, Plus } from 'lucide-react';
import { RankedCatalogItem } from '@/types/catalog';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import { AskZauqStudio } from './AskZauqStudio';
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
  onRefine?: (query: string) => Promise<void>;
  isLoading?: boolean;
  onUndoLastAction?: () => void;
  hasHistoryToUndo?: boolean;
  onSelectDetail?: (item: RankedCatalogItem) => void;
  onSwitchToExplore?: () => void;
  onHeaderVisibilityChange?: (visible: boolean) => void;
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
  onRefine,
  isLoading = false,
  onSelectDetail,
  onSwitchToExplore,
  onHeaderVisibilityChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastFeedScrollY = useRef<number>(0);

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

  const handleFeedScroll = () => {
    if (!containerRef.current) return;
    const currentY = containerRef.current.scrollTop;
    if (currentY < 40) {
      onHeaderVisibilityChange?.(true);
    } else if (currentY > lastFeedScrollY.current + 12) {
      // Scrolling down reel stream -> hide header for full-screen immersive feel
      onHeaderVisibilityChange?.(false);
    } else if (currentY < lastFeedScrollY.current - 12) {
      // Scrolling up -> reveal header
      onHeaderVisibilityChange?.(true);
    }
    lastFeedScrollY.current = currentY;
  };

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

  // If no AI brief has been entered yet, require the user to Ask Zauq first!
  if (!hasActiveFilters && onRefine) {
    return (
      <AskZauqStudio
        onRefine={onRefine}
        isLoading={isLoading}
        onExploreCatalog={onSwitchToExplore}
      />
    );
  }

  return (
    <section className="relative w-full h-[calc(100dvh-3.75rem)] flex flex-col items-center justify-start overflow-hidden">
      {/* Screen Reader Live Region for filter changes */}
      <div className="sr-only" aria-live="polite">
        Feed curated by Ask Zauq. Showing {items.length} matched looks.
      </div>

      {/* Integrated Non-Overlapping Sub-Header Bar */}
      {items.length > 0 && (
        <div className="w-full max-w-sm sm:max-w-[420px] px-3.5 py-1.5 flex items-center justify-between z-10 shrink-0 border-b border-[#E8E2D9]/70 bg-[#FAF8F5]">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#111111] animate-pulse" />
            <span className="font-semibold uppercase tracking-wider text-[10px] text-[#111111]">YOUR EDIT</span>
            <span className="text-[10px] text-[#786E65] font-mono">({Math.min(items.length, 8)} curated)</span>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClearAllFilters();
            }}
            className="flex items-center gap-1 text-[11px] font-medium text-[#111111] hover:text-black transition-colors px-2.5 py-0.5 rounded-full bg-white border border-[#E8E2D9] shadow-2xs active:scale-95"
          >
            <Plus className="w-3 h-3" />
            <span>New Brief</span>
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="w-full max-w-lg mx-auto p-4 flex-1 flex items-center justify-center">
          <EmptyState
            onRemoveLastFilter={onRemoveLastFilter}
            onClearAll={onClearAllFilters}
            hasFilters={hasActiveFilters}
          />
        </div>
      ) : (
        <>
          {/* Scrollable Reel Snap Container with Instagram-Style Dynamic Header Hide on Scroll Down */}
          <div
            ref={containerRef}
            onScroll={handleFeedScroll}
            className="w-full flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar flex flex-col items-center"
          >
            <AnimatePresence>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="w-full max-w-sm sm:max-w-[420px] h-[calc(100dvh-6.5rem)] snap-start snap-always shrink-0 flex items-center justify-center p-2.5 sm:p-3 pb-20 sm:pb-24"
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
                    showMatchScore={true}
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
