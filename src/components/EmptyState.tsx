'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Sparkles, SlidersHorizontal } from 'lucide-react';

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto my-12 p-8 text-center rounded-3xl glass-panel border border-[#E5DAD0] shadow-card-soft"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#F2ECE4] border border-[#E5DAD0] flex items-center justify-center text-[#C98C2C] mx-auto mb-4">
        <Sparkles className="w-8 h-8" />
      </div>

      <h3 className="font-serif text-xl font-medium text-[#1A1615] mb-2">
        No exact matches found
      </h3>
      <p className="text-xs text-[#6B615C] leading-relaxed mb-6">
        Your active taste stack narrowed the catalog too tightly. Loosen your refinements or undo the latest addition.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
        {hasFilters && (
          <button
            type="button"
            onClick={onRemoveLastFilter}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1F1B19] text-white text-xs font-medium hover:bg-[#2E2825] transition-all shadow-sm active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Remove last filter</span>
          </button>
        )}

        <button
          type="button"
          onClick={onClearAll}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#6B615C] hover:text-[#1A1615] hover:bg-[#F2ECE4] border border-[#E5DAD0] text-xs font-medium transition-all"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Reset all filters</span>
        </button>
      </div>
    </motion.div>
  );
};
