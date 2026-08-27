'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Flame, Compass, Search, Tag } from 'lucide-react';
import { RankedCatalogItem } from '@/types/catalog';
import { Card } from './Card';

interface ExploreViewProps {
  items: RankedCatalogItem[];
  savedIds: string[];
  likedIds: string[];
  onSelectVibe: (query: string) => void;
  onSelectDetail: (item: RankedCatalogItem) => void;
  onLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onToast: (msg: string) => void;
}

interface VibeCollection {
  id: string;
  title: string;
  subtitle: string;
  query: string;
  coverImage: string;
  tagCount: number;
}

const FEATURED_VIBES: VibeCollection[] = [
  {
    id: 'vibe_1',
    title: 'Quiet Luxury Linen',
    subtitle: 'Relaxed tailoring, fluid silks & breathable weaves',
    query: 'linen quiet luxury relaxed summer',
    coverImage: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    tagCount: 14,
  },
  {
    id: 'vibe_2',
    title: 'Old Money Tailored',
    subtitle: 'Crisp blazers, monochrome trousers & timeless cuts',
    query: 'old money monochrome tailored blazer',
    coverImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    tagCount: 18,
  },
  {
    id: 'vibe_3',
    title: 'Rooftop Cocktail & Silk',
    subtitle: 'Lustrous satin, evening drapery & jewel tones',
    query: 'rooftop cocktail silk dressy evening',
    coverImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    tagCount: 12,
  },
  {
    id: 'vibe_4',
    title: 'Coastal Resort & Sun',
    subtitle: 'Breezy sundresses, crochet & seaside palettes',
    query: 'coastal resort vacation flowy beach',
    coverImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    tagCount: 16,
  },
  {
    id: 'vibe_5',
    title: 'Minimalist Studio Workwear',
    subtitle: 'Structured lines, muted earth tones & modern versatility',
    query: 'minimalist tailored office structured',
    coverImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    tagCount: 20,
  },
];

const CATEGORY_TABS = [
  { label: 'All Variety', value: 'all' },
  { label: 'Dresses', value: 'dress' },
  { label: 'Tops & Shirts', value: 'top' },
  { label: 'Outerwear', value: 'outerwear' },
  { label: 'Co-ord Sets', value: 'set' },
  { label: 'Bottoms', value: 'bottom' },
];

export const ExploreView: React.FC<ExploreViewProps> = ({
  items,
  savedIds,
  likedIds,
  onSelectVibe,
  onSelectDetail,
  onLike,
  onToggleSave,
  onToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    let result = items;
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(q) ||
        item.brand?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.occasion?.some((o) => o.toLowerCase().includes(q)) ||
        item.palette?.some((p) => p.toLowerCase().includes(q)) ||
        item.pattern?.some((pt) => pt.toLowerCase().includes(q)) ||
        item.silhouette?.some((s) => s.toLowerCase().includes(q)) ||
        item.setting?.some((st) => st.toLowerCase().includes(q))
      );
    }
    return result;
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 pb-36">
      {/* Category Pills & Integrated Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#E8E2D9]">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSelectedCategory(tab.value)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === tab.value
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-white text-[#57504B] border border-[#E8E2D9] hover:border-[#D3C9BE] hover:text-[#111111]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar Placed on the side */}
        <div className="relative w-full sm:w-56 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#786E65]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dresses, tops..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white border border-[#E8E2D9] text-xs text-[#111111] placeholder-[#8C827A] focus:outline-none focus:border-[#D3C9BE] shadow-xs"
          />
        </div>
      </div>

      {/* Featured Vibe Stories / Collections Carousel */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 mb-3">
          <Flame className="w-4 h-4 text-[#111111]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
            Trending Aesthetic Moodboards
          </h2>
        </div>

        <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
          {FEATURED_VIBES.map((vibe) => (
            <motion.div
              key={vibe.id}
              whileHover={{ y: -4 }}
              onClick={() => onSelectVibe(vibe.query)}
              className="relative shrink-0 w-[240px] sm:w-[280px] h-[320px] rounded-3xl overflow-hidden cursor-pointer group shadow-sm border border-[#E8E2D9] bg-stone-900"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={vibe.coverImage}
                alt={vibe.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-semibold tracking-wider uppercase border border-white/15">
                    {vibe.tagCount} Outfits
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-medium leading-tight">
                    {vibe.title}
                  </h3>
                  <p className="text-[11px] text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                    {vibe.subtitle}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase text-white/90 group-hover:underline">
                    <span>Tune Feed to Vibe</span>
                    <Sparkles className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Instagram Explore Staggered Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredItems.map((item, idx) => {
          const isFeatured = idx % 7 === 0; // Staggered Instagram Explore rhythm
          return (
            <div
              key={item.id}
              className={isFeatured ? 'col-span-2 row-span-2' : 'col-span-1'}
            >
              <Card
                item={item}
                isSaved={savedIds.includes(item.id)}
                isLiked={likedIds.includes(item.id)}
                isSkipped={false}
                onLike={(id) => {
                  onLike(id);
                  onToast(`Liked "${item.name}"`);
                }}
                onSkip={() => {}}
                onToggleSave={onToggleSave}
                onClickDetail={onSelectDetail}
                onToast={onToast}
                showMatchScore={false}
                isDeckMode={false}
                isStreamMode={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

