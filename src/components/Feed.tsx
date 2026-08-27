'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Smartphone, RotateCcw, Sparkles } from 'lucide-react';
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
  onUndoLastAction,
  hasHistoryToUndo = false,
  onSelectDetail,
}) => {
  const [viewMode, setViewMode] = useState<'stream' | 'grid'>('stream');

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-48 sm:pb-52">
      {/* Subheader & Instagram/TikTok Stream vs Grid Switcher */}
      <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#E8E2D9]">
        <div className="flex items-baseline gap-2">
          <span className="text-xs uppercase tracking-widest text-[#786E65] font-semibold">
            {hasActiveFilters ? 'Personalized Match' : 'For You Stream'}
          </span>
          <span className="text-xs text-[#786E65]">•</span>
          <span className="text-xs text-[#57504B] font-medium">
            {items.length} curated looks
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-white border border-[#E8E2D9] shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('stream')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              viewMode === 'stream'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'text-[#57504B] hover:text-[#111111]'
            }`}
            aria-label="Stream View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Stream</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'text-[#57504B] hover:text-[#111111]'
            }`}
            aria-label="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>
        </div>
      </div>

      {/* Main Feed Content */}
      {items.length === 0 ? (
        <EmptyState
          onRemoveLastFilter={onRemoveLastFilter}
          onClearAll={onClearAllFilters}
          hasFilters={hasActiveFilters}
        />
      ) : viewMode === 'stream' ? (
        /* TikTok / Instagram-Style Focused Vertical Stream */
        <div className="max-w-md sm:max-w-lg mx-auto flex flex-col gap-6 sm:gap-8">
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
                    onToast(`Liked "${item.name}"`);
                  }}
                  onSkip={onSkip}
                  onToggleSave={onToggleSave}
                  onClickDetail={onSelectDetail}
                  onToast={onToast}
                  showMatchScore={hasActiveFilters}
                  isDeckMode={false}
                  isStreamMode={true}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Instagram Masonry 2/3/4 Column Grid */
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
        >
          <AnimatePresence>
            {items.map((item) => (
              <Card
                key={item.id}
                item={item}
                isSaved={savedIds.includes(item.id)}
                isLiked={likedIds.includes(item.id)}
                isSkipped={skippedIds.includes(item.id)}
                onLike={(id) => {
                  onLike(id);
                  onToast(`Liked "${item.name}"`);
                }}
                onSkip={onSkip}
                onToggleSave={onToggleSave}
                onClickDetail={onSelectDetail}
                onToast={onToast}
                showMatchScore={hasActiveFilters}
                isDeckMode={false}
                isStreamMode={false}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};

