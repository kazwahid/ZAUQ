'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, X } from 'lucide-react';
import { QUICK_SUGGESTIONS } from '@/data/taxonomy';

interface RefinementBarProps {
  onRefine: (query: string) => Promise<void>;
  isLoading: boolean;
  activeFilterLabels: string[];
}

export const RefinementBar: React.FC<RefinementBarProps> = ({
  onRefine,
  isLoading,
  activeFilterLabels,
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed || isLoading) return;

    await onRefine(trimmed);
    setInputVal('');
  };

  const handleSuggestionClick = async (query: string) => {
    if (isLoading) return;
    await onRefine(query);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-3">
      {/* Input container */}
      <form
        onSubmit={handleSubmit}
        className="w-full relative flex items-center group"
      >
        <div className="absolute left-4 sm:left-5 text-[#C98C2C] pointer-events-none flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#C98C2C]" />
          ) : (
            <Sparkles className="w-5 h-5 text-[#C98C2C] transition-transform group-focus-within:scale-110" />
          )}
        </div>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Describe your occasion or vibe ('beach vacation', 'quiet luxury linen')..."
          disabled={isLoading}
          aria-label="Refine fashion feed with natural language"
          className="w-full pl-12 sm:pl-14 pr-24 sm:pr-28 py-3.5 sm:py-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E5DAD0] text-[#1A1615] placeholder-[#948882] text-sm sm:text-base font-normal shadow-card-soft hover:border-[#D3C3B5] focus:border-[#C98C2C] focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        />

        {/* Clear & Submit Actions */}
        <div className="absolute right-2.5 sm:right-3 flex items-center gap-1">
          {inputVal && !isLoading && (
            <button
              type="button"
              onClick={() => setInputVal('')}
              className="p-1.5 rounded-full text-[#948882] hover:text-[#1A1615] hover:bg-[#F2ECE4] transition-colors"
              aria-label="Clear input text"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#1F1B19] text-white text-xs sm:text-sm font-medium hover:bg-[#2E2825] disabled:opacity-40 disabled:hover:bg-[#1F1B19] transition-all shadow-sm active:scale-95"
            aria-label="Refine feed"
          >
            <span className="hidden sm:inline">Refine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Quick-tap suggestion chips */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#948882] shrink-0 mr-1 hidden sm:inline">
          Try:
        </span>
        {QUICK_SUGGESTIONS.map((sug) => {
          const isAlreadyActive = activeFilterLabels.some(
            (label) => label.toLowerCase() === sug.label.toLowerCase()
          );

          if (isAlreadyActive) return null;

          return (
            <button
              key={sug.label}
              type="button"
              onClick={() => handleSuggestionClick(sug.query)}
              disabled={isLoading}
              className="shrink-0 px-2.5 py-1 rounded-full text-xs font-normal text-[#6B615C] bg-white/70 hover:bg-white hover:text-[#1A1615] hover:border-[#C98C2C]/50 border border-[#E5DAD0]/80 shadow-chip transition-all active:scale-95 disabled:opacity-50"
            >
              {sug.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
