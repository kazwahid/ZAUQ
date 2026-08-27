'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowUp, Loader2, X, Search, Sparkles, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActiveFilter } from '@/types/catalog';
import { TRENDING_AESTHETICS, getContextualSuggestions, SuggestionItem } from '@/lib/suggestions';
import { triggerHaptic } from '@/lib/haptics';

interface BottomDockProps {
  onRefine: (query: string) => Promise<void>;
  isLoading: boolean;
  activeFilters: ActiveFilter[];
  onRemoveFilter: (id: string) => void;
  onClearAllFilters: () => void;
  onOpenSaved: () => void;
  savedCount: number;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  onRefine,
  isLoading,
  activeFilters,
  onRemoveFilter,
  onClearAllFilters,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically when expanded
  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isExpanded]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  const activeFilterLabels = useMemo(
    () => activeFilters.map((f) => f.label),
    [activeFilters]
  );

  // Specificity calculation based on active filter count & input depth
  const specificityLevel = useMemo(() => {
    const count = activeFilters.length;
    if (count === 0) return { label: 'Broad Discovery', percent: 20, tag: 'All Catalog' };
    if (count === 1) return { label: 'Specific Style', percent: 50, tag: '1 Filter Active' };
    if (count === 2) return { label: 'Highly Targeted', percent: 75, tag: '2 Filters Active' };
    return { label: 'Laser-Focused', percent: 100, tag: `${count} Filters Active` };
  }, [activeFilters]);

  // Dynamically compute suggestions: Refine Pivots if filters active, Inspiration Starters if empty
  const displayedSuggestions = useMemo(() => {
    if (inputVal.trim()) {
      return getContextualSuggestions(inputVal, activeFilterLabels, 3);
    }
    if (activeFilters.length > 0) {
      return [
        { label: '+ More Minimal', query: 'minimalist solid clean' },
        { label: '+ Pure Silk', query: 'mulberry silk sheen' },
        { label: '+ More Relaxed', query: 'relaxed oversized flowy' },
        { label: '+ Noir Palette', query: 'black monochrome noir' },
      ];
    }
    return [
      { label: 'Quiet Luxury Dinner', query: 'quiet luxury neutral dinner' },
      { label: 'Coastal Resort Linen', query: 'linen resort beach vacation' },
      { label: 'Black Tie Silk Gala', query: 'silk gown gala formal' },
      { label: 'Tailored Workwear', query: 'tailored structured office' },
    ];
  }, [inputVal, activeFilters.length, activeFilterLabels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed || isLoading) return;

    triggerHaptic('medium');
    await onRefine(trimmed);
    setInputVal('');
    setIsExpanded(false);
  };

  const handleSuggestionClick = async (sug: SuggestionItem) => {
    if (isLoading) return;
    triggerHaptic('light');
    await onRefine(sug.query || sug.label);
    setInputVal('');
    setIsExpanded(false);
  };

  const handleFilterRemove = (id: string) => {
    triggerHaptic('light');
    onRemoveFilter(id);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-4 sm:pb-6 px-3 sm:px-6 transition-all duration-300 flex justify-center">
      {/* Background Overlay when Expanded on Desktop/Mobile */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-30 pointer-events-auto"
          />
        )}
      </AnimatePresence>

      <div className="relative z-40 max-w-lg w-full flex flex-col items-center gap-2 pointer-events-auto">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* Always Small Compact Search Dock Pill by Default */
            <motion.button
              key="compact-dock"
              layoutId="search-dock-pill"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                triggerHaptic('light');
                setIsExpanded(true);
              }}
              className="flex items-center gap-2.5 px-4 py-2 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-xl border border-[#E8E2D9] text-[#111111] shadow-md hover:shadow-lg hover:border-[#D3C9BE] transition-all active:scale-95 text-xs font-medium"
              aria-label="Open search and refinement bar"
            >
              <Search className="w-3.5 h-3.5 text-[#786E65]" />
              <span className="max-w-[200px] sm:max-w-[260px] truncate text-[#57504B]">
                {activeFilters.length > 0
                  ? activeFilters.map((f) => f.label).join(' • ')
                  : 'Search style, fabric, vibe...'}
              </span>
              {activeFilters.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#111111] text-white text-[10px] font-semibold">
                  {activeFilters.length}
                </span>
              )}
            </motion.button>
          ) : (
            /* Prominent Expanded Search Dock with Recommendations */
            <motion.div
              key="expanded-dock"
              layoutId="search-dock-pill"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col gap-2"
            >
              {/* Specificity Cascade & Structured AI Intent Trace */}
              {activeFilters.length > 0 && (
                <div className="flex flex-col gap-2 w-full bg-[#111111]/95 backdrop-blur-xl text-white p-3 rounded-3xl border border-white/10 shadow-lg">
                  <div className="flex items-center justify-between px-1 text-[11px]">
                    <div className="flex items-center gap-1.5 font-medium text-stone-300">
                      <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                      <span className="tracking-wide uppercase text-[10px] text-stone-400">Zauq Understood:</span>
                      <strong className="text-white font-semibold">{specificityLevel.label}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-400 font-mono">
                        {specificityLevel.percent}% narrowed
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('medium');
                          onClearAllFilters();
                        }}
                        className="text-[10px] text-stone-300 hover:text-white underline transition-colors"
                      >
                        Reset All
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${specificityLevel.percent}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>

                  {/* Structured Extracted Tags Trace */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                    {activeFilters.map((filter) => (
                      <span
                        key={filter.id}
                        className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-medium shrink-0 border border-white/10 shadow-xs"
                      >
                        <span className="max-w-[140px] truncate">{filter.label}</span>
                        <button
                          type="button"
                          onClick={() => handleFilterRemove(filter.id)}
                          className="p-0.5 rounded-full hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
                          aria-label={`Remove filter ${filter.label}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Guided Prompt Suggestions - No Scrollbar */}
              <div className="w-full flex flex-wrap items-center justify-center gap-1.5 py-0.5 overflow-hidden">
                {displayedSuggestions.slice(0, 3).map((sug) => (
                  <button
                    key={sug.label}
                    type="button"
                    onClick={() => handleSuggestionClick(sug)}
                    disabled={isLoading}
                    className="shrink-0 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium text-[#2C2724] bg-white/95 hover:bg-white border border-[#E8E2D9] shadow-xs hover:border-[#D3C9BE] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-[#786E65] shrink-0" />
                    <span>{sug.label}</span>
                  </button>
                ))}
              </div>

              {/* Prominent Search Form */}
              <form
                onSubmit={handleSubmit}
                className="w-full relative flex items-center p-1.5 sm:p-2 rounded-full bg-white/95 backdrop-blur-xl border border-[#E8E2D9] shadow-lg outline-none focus-within:outline-none focus-within:ring-0 focus-within:border-[#D3C9BE]"
              >
                <div className="pl-3 sm:pl-3.5 pr-2 text-[#786E65] flex items-center justify-center shrink-0">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#111111]" />
                  ) : (
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#786E65]" />
                  )}
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={
                    activeFilters.length > 0
                      ? "Refine (e.g., 'under $200', 'more relaxed', 'in linen')..."
                      : "Describe look (e.g., 'quiet luxury silk dress for dinner')..."
                  }
                  disabled={isLoading}
                  aria-label="Refine discovery feed"
                  className="w-full bg-transparent text-[#111111] placeholder-[#8C827A] text-xs sm:text-sm font-normal border-0 border-none outline-none focus:outline-none focus:ring-0 focus:border-none ring-0 shadow-none focus:shadow-none pr-20 rounded-full"
                />

                <div className="absolute right-1.5 sm:right-2 flex items-center gap-1">
                  {inputVal && !isLoading && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setInputVal('');
                      }}
                      className="p-1.5 rounded-full text-[#8C827A] hover:text-[#111111] transition-colors"
                      aria-label="Clear input text"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="p-1.5 rounded-full text-[#8C827A] hover:text-[#111111] transition-colors sm:hidden"
                    aria-label="Close search dock"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <button
                    type="submit"
                    disabled={!inputVal.trim() || isLoading}
                    className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all active:scale-90 shadow-xs shrink-0 ${
                      inputVal.trim() && !isLoading
                        ? 'bg-[#111111] text-white hover:bg-black hover:scale-105'
                        : 'bg-[#EFEAE3] text-[#A89E95] cursor-not-allowed'
                    }`}
                    aria-label="Submit refinement"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
