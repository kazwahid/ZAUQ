'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, X, ArrowRight, Loader2 } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';

import { ActiveFilter } from '@/types/catalog';

interface BottomDockProps {
  onRefine?: (query: string) => Promise<void>;
  onSearch?: (query: string) => Promise<void>;
  isLoading: boolean;
  activeFilters: ActiveFilter[];
  onRemoveFilter: (id: string) => void;
  onClearAllFilters: () => void;
  onOpenSaved?: () => void;
  savedCount?: number;
}

const DEFAULT_SUGGESTIONS = [
  { label: 'Under $200', query: 'Under $200' },
  { label: 'Natural Linen', query: 'Natural 100% linen fabric' },
  { label: 'Summer Wedding', query: 'Wedding guest outfit' },
  { label: 'Quiet Luxury', query: 'Quiet luxury neutral aesthetic' },
  { label: 'Minimalist Noir', query: 'Monochrome black evening wear' },
];

export const BottomDock: React.FC<BottomDockProps> = ({
  onRefine,
  onSearch,
  isLoading,
  activeFilters,
  onRemoveFilter,
  onClearAllFilters,
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputId = useId();

  const handleAction = onRefine || onSearch || (async () => {});

  // Focus input on expand
  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isExpanded]);

  // Escape key collapses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;

    triggerHaptic('medium');
    await handleAction(trimmed);
    setQuery('');
    setIsExpanded(false);
  };

  const handleSuggestionClick = async (suggestion: { label: string; query: string }) => {
    if (isLoading) return;
    triggerHaptic('light');
    await handleAction(suggestion.query);
    setIsExpanded(false);
  };

  const handleFilterRemove = (id: string) => {
    triggerHaptic('light');
    onRemoveFilter(id);
  };

  // Specificity Level Calculation
  const specificityLevel = (() => {
    const count = activeFilters.length;
    if (count === 0) return { label: 'Broad Taste', percent: 20, color: 'bg-stone-400' };
    if (count === 1) return { label: 'Refined Category', percent: 45, color: 'bg-stone-600' };
    if (count === 2) return { label: 'Targeted Aesthetic', percent: 70, color: 'bg-amber-600' };
    return { label: 'Bespoke Precision', percent: 95, color: 'bg-emerald-600' };
  })();

  const displayedSuggestions = DEFAULT_SUGGESTIONS.filter(
    (s) => !activeFilters.some((f) => f.label.toLowerCase().includes(s.label.toLowerCase()))
  );

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
            className="fixed inset-0 bg-black/20 backdrop-blur-xs z-30 pointer-events-auto"
          />
        )}
      </AnimatePresence>

      <div className="relative z-40 max-w-lg w-full flex flex-col items-center gap-2 pointer-events-auto">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* Always Small Compact Light-Transparent Search Dock Pill by Default */
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
              className="flex items-center gap-2.5 px-4 py-2 sm:py-2.5 rounded-full bg-[#FAF8F5]/85 backdrop-blur-2xl border border-white/90 text-[#111111] shadow-lg hover:shadow-xl hover:bg-white/95 transition-all active:scale-95 text-xs font-medium"
              aria-label="Open search and refinement bar"
            >
              <Search className="w-3.5 h-3.5 text-[#786E65]" />
              <span className="max-w-[200px] sm:max-w-[260px] truncate text-[#57504B]">
                {activeFilters.length > 0
                  ? activeFilters.map((f) => f.label).join(' • ')
                  : 'Refine style, fabric, vibe...'}
              </span>
              {activeFilters.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#111111] text-white text-[10px] font-semibold">
                  {activeFilters.length}
                </span>
              )}
            </motion.button>
          ) : (
            /* Prominent Expanded Light-Transparent Search Dock with Recommendations */
            <motion.div
              key="expanded-dock"
              layoutId="search-dock-pill"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col gap-2"
            >
              {/* Specificity Cascade & Structured AI Intent Trace - Light Aesthetic */}
              {activeFilters.length > 0 && (
                <div className="flex flex-col gap-2 w-full bg-white/90 backdrop-blur-2xl text-[#111111] p-3.5 rounded-2xl border border-[#E8E2D9] shadow-lg">
                  <div className="flex items-center justify-between px-0.5 text-[11px]">
                    <div className="flex items-center gap-1.5 font-medium text-[#2C2724]">
                      <Sparkles className="w-3.5 h-3.5 text-[#111111] animate-pulse" />
                      <span className="tracking-wide uppercase text-[10px] text-[#786E65]">Zauq Understood:</span>
                      <strong className="text-[#111111] font-semibold">{specificityLevel.label}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#786E65] font-mono">
                        {specificityLevel.percent}% narrowed
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('medium');
                          onClearAllFilters();
                        }}
                        className="text-[10px] text-[#786E65] hover:text-[#111111] underline transition-colors"
                      >
                        Reset All
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-1 bg-[#E8E2D9]/80 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${specificityLevel.percent}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="h-full bg-[#111111] rounded-full"
                    />
                  </div>

                  {/* Structured Extracted Tags Trace */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                    {activeFilters.map((filter) => (
                      <span
                        key={filter.id}
                        className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-[#FAF8F5] text-[#111111] text-[11px] font-medium shrink-0 border border-[#E8E2D9] shadow-2xs"
                      >
                        <span className="max-w-[140px] truncate">{filter.label}</span>
                        <button
                          type="button"
                          onClick={() => handleFilterRemove(filter.id)}
                          className="p-0.5 rounded-full hover:bg-[#E8E2D9] text-[#786E65] hover:text-[#111111] transition-colors"
                          aria-label={`Remove filter ${filter.label}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Guided Prompt Suggestions */}
              <div className="w-full flex flex-wrap items-center justify-center gap-1.5 py-0.5 overflow-hidden">
                {displayedSuggestions.slice(0, 3).map((sug) => (
                  <button
                    key={sug.label}
                    type="button"
                    onClick={() => handleSuggestionClick(sug)}
                    disabled={isLoading}
                    className="shrink-0 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium text-[#2C2724] bg-white/90 backdrop-blur-md hover:bg-white border border-[#E8E2D9] shadow-xs hover:border-[#D3C9BE] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-[#786E65] shrink-0" />
                    <span>{sug.label}</span>
                  </button>
                ))}
              </div>

              {/* Prominent Light-Transparent Search Form */}
              <form
                onSubmit={handleSubmit}
                className="w-full relative flex items-center p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-2xl border border-[#E8E2D9] shadow-xl outline-none focus-within:outline-none focus-within:ring-0 focus-within:border-[#111111]/30"
              >
                <div className="pl-3 sm:pl-3.5 pr-2 text-[#786E65] flex items-center justify-center shrink-0">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#111111]" />
                  ) : (
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#786E65]" />
                  )}
                </div>

                <label htmlFor={searchInputId} className="sr-only">
                  Refine your style
                </label>
                <input
                  id={searchInputId}
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your look or refine..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-[#111111] placeholder-[#8C827A] focus:outline-none focus:ring-0 focus:border-0 pr-2 py-1"
                />

                <div className="flex items-center gap-1 shrink-0 pr-1">
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="p-1 rounded-full text-[#786E65] hover:text-[#111111] hover:bg-[#FAF8F5] transition-colors"
                      aria-label="Clear query text"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    className="p-2 sm:px-3.5 sm:py-2 rounded-full bg-[#111111] text-white hover:bg-black disabled:opacity-40 transition-all active:scale-95 shadow-xs flex items-center gap-1"
                    aria-label="Submit refinement"
                  >
                    <span className="text-xs font-medium hidden sm:inline">Refine</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="p-2 rounded-full text-[#786E65] hover:text-[#111111] hover:bg-[#FAF8F5] transition-colors"
                    aria-label="Close search overlay"
                  >
                    <X className="w-4 h-4" />
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
