'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowUp, Loader2, X, Search, Sparkles } from 'lucide-react';
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
  const [isFocused, setIsFocused] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lastScrollY = useRef(0);

  // Dynamic scroll listener: shrink search dock when scrolling down on mobile, expand on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 60) {
        setIsCollapsed(false);
      } else if (currentScrollY > lastScrollY.current + 10 && !isFocused) {
        setIsCollapsed(true);
      } else if (currentScrollY < lastScrollY.current - 10) {
        setIsCollapsed(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFocused]);

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

  // Dynamically compute suggestions: 3 compact suggestions that fit without horizontal scrollbars
  const displayedSuggestions = useMemo(() => {
    if (!inputVal.trim()) {
      return TRENDING_AESTHETICS.filter(
        (item) => !activeFilterLabels.some((l) => l.toLowerCase() === item.label.toLowerCase())
      ).slice(0, 3);
    }
    return getContextualSuggestions(inputVal, activeFilterLabels, 3);
  }, [inputVal, activeFilterLabels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed || isLoading) return;

    triggerHaptic('medium');
    await onRefine(trimmed);
    setInputVal('');
  };

  const handleSuggestionClick = async (sug: SuggestionItem) => {
    if (isLoading) return;
    triggerHaptic('light');
    await onRefine(sug.query || sug.label);
    setInputVal('');
  };

  const handleFilterRemove = (id: string) => {
    triggerHaptic('light');
    onRemoveFilter(id);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-3 sm:pb-6 px-3 sm:px-6 transition-all duration-300">
      <div className="max-w-xl mx-auto flex flex-col items-center gap-2 pointer-events-auto">
        {/* Specificity Cascade & Active Breadcrumbs Tray */}
        <AnimatePresence>
          {activeFilters.length > 0 && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-1.5 w-full bg-[#111111]/95 backdrop-blur-xl text-white p-2.5 rounded-3xl border border-white/10 shadow-md"
            >
              {/* Specificity Meter Indicator */}
              <div className="flex items-center justify-between px-2 text-[11px]">
                <div className="flex items-center gap-1.5 font-medium text-stone-300">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span>Specificity: <strong className="text-white font-semibold">{specificityLevel.label}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-stone-400 font-mono">{specificityLevel.percent}% narrowed</span>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('medium');
                      onClearAllFilters();
                    }}
                    className="text-[10px] text-stone-300 hover:text-white underline transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${specificityLevel.percent}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="h-full bg-white rounded-full"
                />
              </div>

              {/* Active Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                {activeFilters.map((filter) => (
                  <span
                    key={filter.id}
                    className="flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-medium shrink-0 border border-white/10"
                  >
                    <span className="max-w-[130px] truncate">{filter.label}</span>
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Context-Aware Suggestion Pills (Hidden when scrolling down on mobile) */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full flex items-center justify-center gap-1.5 py-0.5 flex-nowrap overflow-hidden"
          >
            <AnimatePresence mode="popLayout">
              {displayedSuggestions.map((sug) => (
                <motion.button
                  key={sug.label}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  type="button"
                  onClick={() => handleSuggestionClick(sug)}
                  disabled={isLoading}
                  className="shrink px-3 sm:px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-medium text-[#2C2724] bg-white/95 hover:bg-white border border-[#E8E2D9] shadow-xs hover:border-[#D3C9BE] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1 truncate"
                >
                  {inputVal ? (
                    <Sparkles className="w-2.5 h-2.5 text-[#786E65] shrink-0" />
                  ) : null}
                  <span className="truncate">{sug.label}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Main Floating Pill-Shaped Natural Language Search Dock */}
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.button
              key="collapsed-pill"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                triggerHaptic('light');
                setIsCollapsed(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-xl border border-[#E8E2D9] text-[#111111] shadow-md hover:shadow-lg transition-all active:scale-95 text-xs font-medium"
              aria-label="Expand search dock"
            >
              <Search className="w-3.5 h-3.5 text-[#111111]" />
              <span>Search & Refine</span>
              {activeFilters.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
              )}
            </motion.button>
          ) : (
            <motion.form
              key="expanded-form"
              onSubmit={handleSubmit}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full relative flex items-center p-1.5 sm:p-2 rounded-full bg-white/95 backdrop-blur-xl border border-[#E8E2D9] transition-all duration-300 shadow-sm outline-none focus-within:outline-none focus-within:ring-0 focus-within:border-[#D3C9BE]"
            >
              <div className="pl-3 sm:pl-3.5 pr-2 text-[#786E65] flex items-center justify-center shrink-0">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#111111]" />
                ) : (
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#786E65]" />
                )}
              </div>

              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={
                  activeFilters.length > 0
                    ? 'Add another filter (e.g. linen, silk, black)...'
                    : 'Search style, fabric, vibe, or occasion...'
                }
                disabled={isLoading}
                aria-label="Refine discovery feed"
                className="w-full bg-transparent text-[#111111] placeholder-[#8C827A] text-xs sm:text-sm font-normal border-0 border-none outline-none focus:outline-none focus:ring-0 focus:border-none ring-0 shadow-none focus:shadow-none pr-16 rounded-full"
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
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


