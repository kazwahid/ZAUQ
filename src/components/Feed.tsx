'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { RankedCatalogItem } from '@/types/catalog';
import { Card } from './Card';
import { EmptyState } from './EmptyState';

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
  onUndoLastAction?: () => void;
  hasHistoryToUndo?: boolean;
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
  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 pb-48 sm:pb-52">
      {/* Main Feed Content */}
      {items.length === 0 ? (
        <EmptyState
          onRemoveLastFilter={onRemoveLastFilter}
          onClearAll={onClearAllFilters}
          hasFilters={hasActiveFilters}
        />
      ) : (
        /* TikTok / Instagram Focused Vertical Stream */
        <div className="max-w-md sm:max-w-lg mx-auto flex flex-col gap-5 sm:gap-8">
          <AnimatePresence>
            {items.map((item) => (
              <div key={item.id} className="w-full">
                <Card
                  item={item}
                  isSaved={savedIds.includes(item.id)}
                  isLiked={likedIds.includes(item.id)}
                  isSkipped={skippedIds.includes(item.id)}
                  onLike={(id) => {
                    onLike(id);
                  }}
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
      )}
    </section>
  );
};
