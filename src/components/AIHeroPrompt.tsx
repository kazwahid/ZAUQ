'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';

interface AIHeroPromptProps {
  onRefine: (query: string) => Promise<void>;
  isLoading: boolean;
}

const STARTER_PROMPTS = [
  { label: 'Summer Wedding Guest', query: 'summer wedding guest elegant dress under $250' },
  { label: 'Quiet Luxury Dinner', query: 'quiet luxury linen neutral dinner' },
  { label: 'Black Tie Silk Gala', query: 'black tie silk gown gala' },
  { label: 'Tailored Workwear', query: 'tailored minimalist trousers office' },
];

export const AIHeroPrompt: React.FC<AIHeroPromptProps> = ({ onRefine, isLoading }) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed || isLoading) return;
    triggerHaptic('medium');
    await onRefine(trimmed);
    setInputVal('');
  };

  const handlePromptClick = async (query: string) => {
    if (isLoading) return;
    triggerHaptic('light');
    await onRefine(query);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-sm sm:max-w-md mx-auto my-3 p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-xl border border-[#E8E2D9] shadow-lg text-center shrink-0 z-10"
    >
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] text-white text-[10px] font-semibold tracking-wider uppercase mb-2 shadow-xs">
        <Sparkles className="w-3 h-3 text-white" />
        <span>AI Stylist Discovery</span>
      </div>

      <h2 className="font-serif text-lg sm:text-xl font-medium text-[#111111] tracking-tight leading-snug">
        What are you in the mood to wear?
      </h2>
      <p className="text-[11px] text-[#786E65] mt-0.5 mb-3 leading-relaxed">
        Describe an occasion, aesthetic, fabric, or budget.
      </p>

      {/* Hero Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center mb-2.5">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="e.g., 'Summer wedding guest under $250'..."
          disabled={isLoading}
          className="w-full pl-4 pr-11 py-2.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-xs text-[#111111] placeholder-[#8C827A] focus:outline-none focus:border-[#111111] shadow-inner"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isLoading}
          className="absolute right-1.5 p-2 rounded-full bg-[#111111] text-white hover:bg-black disabled:opacity-40 transition-all active:scale-95 shadow-xs"
          aria-label="Find my look"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5" />
          )}
        </button>
      </form>

      {/* Starter Inspiration Chips */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {STARTER_PROMPTS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => handlePromptClick(p.query)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-full bg-white border border-[#E8E2D9] text-[10px] text-[#57504B] font-medium hover:border-[#111111] hover:text-[#111111] transition-all active:scale-95 shadow-xs"
          >
            {p.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
