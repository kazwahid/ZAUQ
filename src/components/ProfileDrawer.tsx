'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check } from 'lucide-react';
import { UserProfile, ShopForTag } from '@/types/catalog';
import { triggerHaptic } from '@/lib/haptics';

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
    'Old Money',
    'Resort & Coastal',
    'Editorial Chic',
  ];

  const palettes = ['Neutrals', 'Noir / Black', 'Cream & White', 'Earth Tones', 'Vibrant'];
  const fabrics = ['Linen', 'Mulberry Silk', 'Tencel & Cotton', 'Knit & Wool'];

  const selectedPalettes = profile.preferredPalettes || ['Neutrals', 'Noir / Black'];
  const selectedFabrics = profile.preferredFabrics || ['Linen', 'Mulberry Silk'];

  const togglePalette = (pal: string) => {
    triggerHaptic('light');
    const updated = selectedPalettes.includes(pal)
      ? selectedPalettes.filter((p) => p !== pal)
      : [...selectedPalettes, pal];
    onUpdateProfile({ ...profile, preferredPalettes: updated });
  };

  const toggleFabric = (fab: string) => {
    triggerHaptic('light');
    const updated = selectedFabrics.includes(fab)
      ? selectedFabrics.filter((f) => f !== fab)
      : [...selectedFabrics, fab];
    onUpdateProfile({ ...profile, preferredFabrics: updated });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-start"
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
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col z-10 border-r border-[#E8E2D9]"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#E8E2D9] flex items-center justify-between bg-white/90 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2
                    id="profile-drawer-title"
                    className="font-serif text-lg sm:text-xl font-semibold text-[#111111]"
                  >
                    My Style
                  </h2>
                  <p className="text-[10px] text-[#786E65]">What Zauq knows about your taste</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-[#786E65] hover:text-[#111111] hover:bg-[#F2ECE4] transition-colors"
                aria-label="Close style drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form controls */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Active Baseline Chips */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#E8E2D9] shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#786E65] block mb-2">
                  Your Taste Baseline
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-[11px] font-medium text-[#111111]">
                    {profile.aestheticPreference || 'Quiet Luxury'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-[11px] font-medium text-[#111111]">
                    {profile.shopFor === 'all' ? 'All Pieces' : profile.shopFor}
                  </span>
                  {selectedPalettes.slice(0, 2).map((p) => (
                    <span
                      key={p}
                      className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-[11px] font-medium text-[#111111]"
                    >
                      {p}
                    </span>
                  ))}
                  {selectedFabrics.slice(0, 2).map((f) => (
                    <span
                      key={f}
                      className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-[11px] font-medium text-[#111111]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-2.5">
                  Collection Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {shopForOptions.map((opt) => {
                    const isSelected = profile.shopFor === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          onUpdateProfile({ ...profile, shopFor: opt.value });
                        }}
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

              {/* Aesthetic Preference */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-2.5">
                  Primary Aesthetic
                </label>
                <div className="space-y-1.5">
                  {aesthetics.map((aes) => {
                    const isSelected = profile.aestheticPreference === aes;
                    return (
                      <button
                        key={aes}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          onUpdateProfile({
                            ...profile,
                            aestheticPreference: isSelected ? null : aes,
                          });
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                            : 'bg-white text-[#57504B] hover:bg-[#FAF8F5] border-[#E8E2D9]'
                        }`}
                      >
                        <span>{aes}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gravitates Toward (Palettes) - Fully Selectable Toggle Buttons */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-2">
                  Gravitates Toward (Palettes)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {palettes.map((pal) => {
                    const isSelected = selectedPalettes.includes(pal);
                    return (
                      <button
                        key={pal}
                        type="button"
                        onClick={() => togglePalette(pal)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-[#111111] text-white border-[#111111] shadow-2xs'
                            : 'bg-white text-[#57504B] hover:bg-[#FAF8F5] border-[#E8E2D9]'
                        }`}
                      >
                        <span>{pal}</span>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Fabrics - Fully Selectable Toggle Buttons */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-2">
                  Preferred Fabrics
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {fabrics.map((fab) => {
                    const isSelected = selectedFabrics.includes(fab);
                    return (
                      <button
                        key={fab}
                        type="button"
                        onClick={() => toggleFabric(fab)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-[#111111] text-white border-[#111111] shadow-2xs'
                            : 'bg-white text-[#57504B] hover:bg-[#FAF8F5] border-[#E8E2D9]'
                        }`}
                      >
                        <span>{fab}</span>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 sm:p-5 border-t border-[#E8E2D9] bg-white">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onClose();
                }}
                className="w-full py-3 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-all active:scale-95 shadow-xs"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
