'use client';

import React from 'react';
import { Bookmark, SlidersHorizontal, Sparkles, RotateCcw, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  currentTab: 'feed' | 'explore';
  onSelectTab: (tab: 'feed' | 'explore') => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenProfile: () => void;
  onResetSession: () => void;
  activeFilterCount: number;
  activeFilterLabels?: string[];
  onRemoveFilter?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
  onOpenSaved,
  onOpenProfile,
  onResetSession,
  activeFilterCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-[#E8E2D9]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between relative">
        {/* Left: My Style Profile Button & Reset */}
        <div className="flex items-center gap-1.5 shrink-0 z-10">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#2C2724] bg-white/90 hover:bg-white border border-[#E8E2D9] shadow-xs transition-all active:scale-95"
            aria-label="Open My Style profile"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#111111]" />
            <span className="hidden sm:inline">My Style</span>
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={onResetSession}
              className="p-1.5 rounded-full text-[#786E65] hover:text-[#111111] hover:bg-white/80 transition-colors"
              title="Reset to Ask Zauq"
              aria-label="Reset taste brief"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Center: Absolute Centered English ZAUQ Brand */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
          <a
            href="/story"
            className="group hover:opacity-85 transition-opacity"
            title="The Meaning of Zauq"
            aria-label="Zauq Story"
          >
            <span className="font-serif text-lg sm:text-2xl tracking-[0.2em] uppercase text-[#111111] font-medium">
              ZAUQ
            </span>
          </a>
        </div>

        {/* Right: Saved Collection */}
        <div className="flex items-center gap-1.5 shrink-0 z-10">
          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#111111] text-white hover:bg-[#2C2724] shadow-xs transition-all active:scale-95"
            aria-label={`Saved collection (${savedCount})`}
          >
            <Bookmark className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-medium hidden xs:inline">Saved</span>
            {savedCount > 0 && (
              <motion.span
                key={savedCount}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                className="px-1.5 py-0.2 rounded-full bg-white text-[#111111] text-[10px] font-bold leading-tight"
              >
                {savedCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>

      {/* Transparent Frosted Glass Floating Dock for [ Your Edit / Ask | Explore ] */}
      <div className="flex justify-center pb-2 px-3">
        <nav
          className="flex items-center p-1 rounded-full bg-white/80 backdrop-blur-2xl border border-[#E8E2D9] shadow-md transition-all"
          aria-label="Main Navigation Dock"
        >
          <button
            type="button"
            onClick={() => onSelectTab('feed')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentTab === 'feed'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'text-[#786E65] hover:text-[#111111]'
            }`}
            aria-current={currentTab === 'feed' ? 'page' : undefined}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="truncate">{activeFilterCount > 0 ? 'Your Edit' : 'Ask'}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('explore')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentTab === 'explore'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'text-[#786E65] hover:text-[#111111]'
            }`}
            aria-current={currentTab === 'explore' ? 'page' : undefined}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
