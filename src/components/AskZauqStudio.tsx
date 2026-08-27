'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, Compass } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';

interface AskZauqStudioProps {
  onRefine: (query: string) => Promise<void>;
  isLoading: boolean;
  onExploreCatalog?: () => void;
}

const SUGGESTED_BRIEFS = [
  { label: 'Summer Wedding', query: 'I need an elegant summer wedding guest outfit under $250' },
  { label: 'Quiet Luxury Dinner', query: 'Quiet luxury neutral linen outfit for dinner' },
  { label: 'Black Tie Gala', query: 'Black tie silk gown for a formal gala' },
  { label: 'Coastal Resort', query: 'Breezy coastal resort wear in linen' },
  { label: 'Tailored Workwear', query: 'Tailored minimalist trousers and blazer for work' },
];

export const AskZauqStudio: React.FC<AskZauqStudioProps> = ({
  onRefine,
  isLoading,
  onExploreCatalog,
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed || isLoading) return;
    triggerHaptic('medium');
    await onRefine(trimmed);
  };

  const handleBriefClick = async (query: string) => {
    if (isLoading) return;
    triggerHaptic('light');
    setInputVal(query);
    await onRefine(query);
  };

  return (
    <div className="relative w-full min-h-[calc(100dvh-4rem)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Ambient Breathing Background Glow */}
      <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-[#E8E2D9]/60 via-[#F2ECE4]/80 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg mx-auto bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-[#E8E2D9] shadow-2xl text-center"
      >
        {/* Stylist Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#111111] text-white text-[11px] font-semibold tracking-wider uppercase mb-3.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
          <span>Ask Zauq Stylist</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-medium tracking-tight leading-tight mb-2">
          What are you in the mood to wear?
        </h1>
        <p className="text-xs sm:text-sm text-[#786E65] leading-relaxed max-w-md mx-auto mb-6">
          Tell Zauq what you’re looking for. We’ll turn your intent into a considered edit.
        </p>

        {/* Main AI Input Command Surface */}
        <form onSubmit={handleSubmit} className="relative flex items-center mb-5">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Describe your look (e.g., 'summer wedding under $250')..."
            disabled={isLoading}
            autoFocus
            className="w-full pl-5 pr-14 py-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs sm:text-sm text-[#111111] placeholder-[#8C827A] focus:outline-none focus:border-[#111111] focus:bg-white transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="absolute right-2 p-3 rounded-xl bg-[#111111] text-white hover:bg-black disabled:opacity-40 transition-all active:scale-95 shadow-md flex items-center justify-center"
            aria-label="Find my look"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <ArrowRight className="w-4 h-4 text-white" />
            )}
          </button>
        </form>

        {/* Loading Analyzing State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 py-2 mb-3 text-xs text-[#111111] font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#111111]" />
              <span>Interpreting your style brief and ranking pieces...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Curated Suggested Briefs */}
        <div className="text-left mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#786E65] block mb-2 px-1">
            Suggested Style Briefs
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_BRIEFS.map((brief) => (
              <button
                key={brief.label}
                type="button"
                onClick={() => handleBriefClick(brief.query)}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#E8E2D9] text-[11px] text-[#2C2724] font-medium transition-all active:scale-95 shadow-2xs hover:border-[#111111]/30"
              >
                {brief.label}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Catalog Explore Alternate Link */}
        {onExploreCatalog && (
          <div className="pt-4 border-t border-[#F2ECE4] flex items-center justify-center">
            <button
              type="button"
              onClick={onExploreCatalog}
              className="flex items-center gap-1.5 text-xs text-[#786E65] hover:text-[#111111] font-medium transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Or browse the full catalog in Explore</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
