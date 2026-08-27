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
  { label: 'Resort Wear', query: 'Breezy coastal resort wear in linen' },
  { label: 'Workwear', query: 'Tailored minimalist trousers and blazer for work' },
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
    <div className="relative w-full h-[calc(100dvh-7.5rem)] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      {/* Ambient Breathing Background Glow */}
      <div className="absolute w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-gradient-to-tr from-[#E8E2D9]/60 via-[#F2ECE4]/80 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl mx-auto bg-white/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-[#E8E2D9] shadow-2xl text-center"
      >
        {/* Stylist Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.8 rounded-full bg-[#111111] text-white text-[10.5px] font-semibold tracking-wider uppercase mb-3 shadow-xs">
          <Sparkles className="w-3 h-3 text-white animate-pulse" />
          <span>Ask Zauq Stylist</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#111111] font-medium tracking-tight leading-tight mb-2">
          What are you in the mood to wear?
        </h1>
        <p className="text-xs sm:text-sm text-[#786E65] leading-relaxed max-w-md mx-auto mb-5">
          Describe an occasion, aesthetic, fabric, color, or budget. Tell Zauq what you want. Get a focused edit around it.
        </p>

        {/* Seamless Unified Spotlight Command Bar - Complete Full Placeholder */}
        <form onSubmit={handleSubmit} className="relative flex items-center mb-4">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Something elegant for a summer wedding under $250..."
            disabled={isLoading}
            autoFocus
            className="w-full pl-3.5 sm:pl-5 pr-14 sm:pr-28 py-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] text-[11px] sm:text-xs md:text-sm text-[#111111] placeholder-[#8C827A] focus:outline-none focus:border-[#111111] focus:bg-white transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="absolute right-1.5 flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#111111] text-white hover:bg-black disabled:opacity-40 transition-all active:scale-95 shadow-sm font-medium text-xs shrink-0"
            aria-label="Ask Zauq to find look"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span className="hidden sm:inline">Curating</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Ask Zauq</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </>
            )}
          </button>
        </form>

        {/* Restrained Loading Analyzing Transition State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-1.5 py-1 mb-2 text-xs text-[#111111] font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#111111]" />
              <span>Zauq is shaping your edit…</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* One-Click Suggested Briefs */}
        <div className="text-left mb-3.5">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#786E65] block mb-1.5 px-1">
            Suggested Briefs
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_BRIEFS.map((brief) => (
              <button
                key={brief.label}
                type="button"
                onClick={() => handleBriefClick(brief.query)}
                disabled={isLoading}
                className="px-3 py-1.2 rounded-full bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#E8E2D9] text-[10.5px] text-[#2C2724] font-medium transition-all active:scale-95 shadow-2xs hover:border-[#111111]/30"
              >
                {brief.label}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Catalog Explore Alternate & Story Links */}
        <div className="pt-3 border-t border-[#F2ECE4] flex flex-col sm:flex-row items-center justify-between gap-1.5 text-xs text-[#786E65]">
          {onExploreCatalog ? (
            <button
              type="button"
              onClick={onExploreCatalog}
              className="flex items-center gap-1.5 hover:text-[#111111] font-medium transition-colors text-[11px]"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Or browse the full catalogue in Explore</span>
            </button>
          ) : (
            <span />
          )}

          <a
            href="/story"
            className="text-[11px] text-[#8C827A] hover:text-[#111111] underline decoration-[#E8E2D9] transition-colors"
          >
            The Meaning of Zauq &rarr;
          </a>
        </div>
      </motion.div>
    </div>
  );
};
