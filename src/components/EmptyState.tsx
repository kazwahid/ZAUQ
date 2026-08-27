'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';

interface EmptyStateProps {
  onRemoveLastFilter: () => void;
  onClearAll: () => void;
  hasFilters: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onRemoveLastFilter,
  onClearAll,
  hasFilters,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm sm:max-w-md mx-auto my-8 p-6 text-center rounded-3xl bg-white border border-[#E8E2D9] shadow-lg"
    >
      <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] flex items-center justify-center text-[#111111] mx-auto mb-3.5">
        <Sparkles className="w-6 h-6" />
      </div>

      <h3 className="font-serif text-lg font-medium text-[#111111] mb-1.5">
        Nothing quite matches that combination
      </h3>
      <p className="text-xs text-[#786E65] leading-relaxed mb-5">
        {hasFilters
          ? 'Your active AI refinements narrowed the catalog too tightly. Try relaxing your latest filter or broadening your aesthetic request.'
          : 'Try describing a specific vibe, fabric, silhouette, or occasion in the search dock.'}
      </p>

      {/* Quick Recovery Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onRemoveLastFilter();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-all active:scale-95 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo last filter</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            triggerHaptic('medium');
            onClearAll();
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#57504B] hover:text-[#111111] hover:bg-[#FAF8F5] border border-[#E8E2D9] text-xs font-medium transition-all active:scale-95"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Reset discovery</span>
        </button>
      </div>
    </motion.div>
  );
};
