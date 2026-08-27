'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Trash2 } from 'lucide-react';
import { ActiveFilter } from '@/types/catalog';

interface BreadcrumbChipsProps {
  activeFilters: ActiveFilter[];
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
}

export const BreadcrumbChips: React.FC<BreadcrumbChipsProps> = ({
  activeFilters,
  onRemoveFilter,
  onClearAll,
}) => {
  if (!activeFilters || activeFilters.length === 0) {
    return null;
  }

  // Extract a summary of tags inside each filter for informative tooltips
  const getFilterSummary = (filter: ActiveFilter): string => {
    const parts: string[] = [];
    if (filter.tags) {
      for (const [field, values] of Object.entries(filter.tags)) {
        if (Array.isArray(values) && values.length > 0) {
          parts.push(`${field}: ${values.join(', ')}`);
        }
      }
    }
    return parts.length > 0 ? parts.join(' | ') : 'Taxonomy filter';
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-2 pt-2 pb-1"
      aria-label="Active taste narrowing filters"
    >
      <div className="flex items-center gap-1.5 text-xs text-[#6B615C] font-medium mr-1">
        <Sparkles className="w-3.5 h-3.5 text-[#C98C2C]" />
        <span>Taste stack:</span>
      </div>

      <AnimatePresence mode="popLayout">
        {activeFilters.map((filter) => (
          <motion.div
            key={filter.id}
            layout
            initial={{ opacity: 0, scale: 0.8, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="group relative flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-[#1F1B19] text-white text-xs font-medium shadow-chip hover:bg-[#2E2825] border border-white/10 transition-colors"
            title={getFilterSummary(filter)}
          >
            <span className="max-w-[180px] truncate">{filter.label}</span>
            <button
              type="button"
              onClick={() => onRemoveFilter(filter.id)}
              className="p-0.5 rounded-full text-stone-400 hover:text-white hover:bg-white/20 transition-colors"
              aria-label={`Remove filter ${filter.label}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {activeFilters.length >= 2 && (
        <motion.button
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClearAll}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-[#A6462E] hover:text-[#7A2C18] hover:bg-[#F2ECE4] border border-[#E07A60]/30 transition-colors ml-1"
          aria-label="Clear all active filters"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear all</span>
        </motion.button>
      )}
    </div>
  );
};
