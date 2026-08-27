'use client';

import React from 'react';
import { Bookmark, SlidersHorizontal, Sparkles, RotateCcw, Compass, Flame } from 'lucide-react';
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
  const [isVisible, setIsVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 40) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 8) {
        // Scrolling down -> hide on mobile
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 8) {
        // Scrolling up -> reveal
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-[#E8E2D9]/80 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: Preferences Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[#2C2724] bg-white/90 hover:bg-white border border-[#E8E2D9] shadow-xs transition-all active:scale-95"
            aria-label="Tune taste preferences"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#111111]" />
            <span className="hidden xs:inline sm:inline">Preferences</span>
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={onResetSession}
              className="p-1.5 rounded-full text-[#786E65] hover:text-[#111111] hover:bg-white/80 transition-colors"
              title="Reset all filters"
              aria-label="Reset taste filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Center: Brand & Main Navigation Tabs */}
        <div className="flex items-center gap-3 sm:gap-6 justify-center">
          <button
            onClick={() => onSelectTab('feed')}
            className="font-serif text-lg sm:text-2xl tracking-[0.2em] uppercase text-[#111111] font-medium hidden lg:block mr-2 hover:opacity-80 transition-opacity"
            aria-label="Zauq Home"
          >
            ZAUQ
          </button>

          {/* Primary View Switcher Tabs (For You vs Explore) */}
          <nav className="flex items-center p-1 rounded-full bg-white/90 border border-[#E8E2D9] shadow-xs" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => onSelectTab('feed')}
              className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                currentTab === 'feed'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#786E65] hover:text-[#111111]'
              }`}
              aria-current={currentTab === 'feed' ? 'page' : undefined}
            >
              <Sparkles className="w-3 h-3" />
              <span>{activeFilterCount > 0 ? 'Your Edit' : 'Ask Zauq'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('explore')}
              className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                currentTab === 'explore'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#786E65] hover:text-[#111111]'
              }`}
              aria-current={currentTab === 'explore' ? 'page' : undefined}
            >
              <Compass className="w-3 h-3" />
              <span>Explore</span>
            </button>
          </nav>
        </div>

        {/* Right: Saved Collection */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#111111] text-white hover:bg-[#2C2724] shadow-xs transition-all active:scale-95"
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
    </header>
  );
};
