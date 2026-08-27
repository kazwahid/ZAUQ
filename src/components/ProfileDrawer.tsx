'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, Check, Sparkles } from 'lucide-react';
import { UserProfile, ShopForTag } from '@/types/catalog';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const shopForOptions: { label: string; value: ShopForTag | 'all' }[] = [
    { label: 'All Discovery', value: 'all' },
    { label: 'Womenswear', value: 'womenswear' },
    { label: 'Menswear', value: 'menswear' },
    { label: 'Unisex', value: 'unisex' },
  ];

  const aesthetics = [
    'Quiet Luxury',
    'Minimalist Tailored',
    'Resort & Beach',
    'Old Money',
    'Bohemian Artisan',
    'Editorial Avant-Garde',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-drawer-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col z-10 border-l border-[#E8E2D9]"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#E8E2D9] flex items-center justify-between bg-white/90 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h2
                    id="profile-drawer-title"
                    className="font-serif text-lg font-semibold text-[#111111]"
                  >
                    Taste Preferences
                  </h2>
                  <p className="text-xs text-[#786E65]">
                    Tune your single-session curation parameters
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-[#786E65] hover:text-[#111111] hover:bg-[#F2ECE4] transition-colors"
                aria-label="Close taste drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form controls */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Category Preference */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-2.5">
                  Shopping For
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {shopForOptions.map((opt) => {
                    const isSelected = profile.shopFor === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          onUpdateProfile({ ...profile, shopFor: opt.value })
                        }
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                            : 'bg-white text-[#57504B] hover:bg-[#FAF8F5] border-[#E8E2D9]'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Aesthetic Vibe Preset */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-2.5">
                  Preferred Aesthetic Mood
                </label>
                <div className="flex flex-wrap gap-2">
                  {aesthetics.map((aest) => {
                    const isSelected = profile.aestheticPreference === aest;
                    return (
                      <button
                        key={aest}
                        type="button"
                        onClick={() =>
                          onUpdateProfile({
                            ...profile,
                            aestheticPreference: isSelected ? null : aest,
                          })
                        }
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-white text-[#57504B] hover:text-[#111111] hover:bg-[#FAF8F5] border-[#E8E2D9]'
                        }`}
                      >
                        {aest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Session Information Callout */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8E2D9] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#111111]">
                  <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
                  <span>Session Guarantee</span>
                </div>
                <p className="text-xs text-[#786E65] leading-relaxed">
                  Zauq is completely gate-free. All preferences and likes exist strictly in your temporary browser session and never require an account.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E8E2D9] bg-white/90 backdrop-blur-md flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#111111] text-white text-xs font-medium hover:bg-[#2C2724] transition-all"
              >
                Apply & Return to Feed
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
