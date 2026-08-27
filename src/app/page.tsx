'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import rawCatalog from '@/data/catalog.json';
import { CatalogItem, ActiveFilter, UserProfile, SessionState, RankedCatalogItem } from '@/types/catalog';
import { rankCatalog } from '@/lib/scoring';
import { Navbar } from '@/components/Navbar';
import { Feed } from '@/components/Feed';
import { ExploreView } from '@/components/ExploreView';
import { BottomDock } from '@/components/BottomDock';
import { SavedModal } from '@/components/SavedModal';
import { ProfileDrawer } from '@/components/ProfileDrawer';
import { DetailModal } from '@/components/DetailModal';
import { Toast, ToastMessage } from '@/components/Toast';

const catalogItems = rawCatalog as CatalogItem[];
const LOCAL_STORAGE_KEY = 'zauq_session_state_v1';

const defaultProfile: UserProfile = {
  shopFor: 'all',
  heightCm: null,
  ageRange: null,
  undertone: null,
  aestheticPreference: null,
};

export default function Home() {
  const [currentTab, setCurrentTab] = useState<'feed' | 'explore'>('feed');
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [actionHistory, setActionHistory] = useState<{ type: 'like' | 'skip'; id: string }[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<RankedCatalogItem | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper to trigger accessible toast
  const addToast = useCallback((text: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, text, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: SessionState = JSON.parse(stored);
        if (Array.isArray(parsed.activeFilters)) setActiveFilters(parsed.activeFilters);
        if (Array.isArray(parsed.liked)) setLiked(parsed.liked);
        if (Array.isArray(parsed.skipped)) setSkipped(parsed.skipped);
        if (Array.isArray(parsed.saved)) setSaved(parsed.saved);
        if (parsed.profile) setProfile(parsed.profile);
      }
    } catch (e) {
      console.warn('Failed to restore localStorage session state:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave: SessionState = {
        profile,
        activeFilters,
        liked,
        skipped,
        saved,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed to persist session to localStorage:', e);
    }
  }, [activeFilters, liked, skipped, saved, profile, isLoaded]);

  // Deterministically rank catalog against all active filters & profile preferences
  const rankedItems = useMemo(() => {
    return rankCatalog(catalogItems, activeFilters, profile);
  }, [activeFilters, profile]);

  // List of saved CatalogItem objects for drawer
  const savedCatalogItems = useMemo(() => {
    return catalogItems.filter((item) => saved.includes(item.id));
  }, [saved]);

  // Active filter label array
  const activeFilterLabels = useMemo(() => {
    return activeFilters.map((f) => f.label);
  }, [activeFilters]);

  // Natural language refinement handler
  const handleRefine = async (query: string) => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freeText: query,
          existingFilterLabels: activeFilterLabels,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(
          data.error || 'Refining with smart heuristic filter.',
          'warning'
        );
        return;
      }

      const { label, tags } = data.data;

      const hasAnyTags = Object.values(tags).some(
        (arr) => Array.isArray(arr) && arr.length > 0
      );

      const newFilter: ActiveFilter = {
        id: `filter_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        label: label || query,
        tags: hasAnyTags ? tags : { occasion: [query.toLowerCase()] },
        createdAt: Date.now(),
      };

      setActiveFilters((prev) => [...prev, newFilter]);
      addToast(`Filtered by "${newFilter.label}".`, 'info');
      // Ensure user is taken to the stream feed when refining
      setCurrentTab('feed');
    } catch (err: any) {
      console.error('Fetch error calling /api/interpret:', err);
      addToast('Network hiccup: filters kept intact.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  // Vibe selection from Explore page
  const handleSelectVibe = (query: string) => {
    handleRefine(query);
    setCurrentTab('feed');
  };

  // Filter removal
  const handleRemoveFilter = (filterId: string) => {
    const removed = activeFilters.find((f) => f.id === filterId);
    setActiveFilters((prev) => prev.filter((f) => f.id !== filterId));
    if (removed) {
      addToast(`Removed "${removed.label}".`, 'info');
    }
  };

  // Undo last filter
  const handleRemoveLastFilter = () => {
    if (activeFilters.length === 0) return;
    const last = activeFilters[activeFilters.length - 1];
    setActiveFilters((prev) => prev.slice(0, -1));
    addToast(`Removed "${last.label}".`, 'info');
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setActiveFilters([]);
    addToast('Cleared active filters.', 'info');
  };

  // Like card action
  const handleLike = (id: string) => {
    setLiked((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setSkipped((prev) => prev.filter((item) => item !== id));
    setActionHistory((prev) => [...prev, { type: 'like', id }]);
  };

  // Skip card action
  const handleSkip = (id: string) => {
    setSkipped((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setLiked((prev) => prev.filter((item) => item !== id));
    setActionHistory((prev) => [...prev, { type: 'skip', id }]);
  };

  // Undo last like or skip action
  const handleUndoLastAction = () => {
    if (actionHistory.length === 0) return;
    const last = actionHistory[actionHistory.length - 1];
    setActionHistory((prev) => prev.slice(0, -1));

    if (last.type === 'like') {
      setLiked((prev) => prev.filter((item) => item !== last.id));
      addToast('Undid like.', 'info');
    } else if (last.type === 'skip') {
      setSkipped((prev) => prev.filter((item) => item !== last.id));
      addToast('Restored item.', 'info');
    }
  };

  // Toggle save action
  const handleToggleSave = (id: string) => {
    setSaved((prev) => {
      const isAlreadySaved = prev.includes(id);
      if (isAlreadySaved) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        try {
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.85 },
            colors: ['#111111', '#786E65', '#FAF8F5'],
          });
        } catch (_) {}
        return [...prev, id];
      }
    });
  };

  // Remove from saved list
  const handleRemoveSaved = (id: string) => {
    setSaved((prev) => prev.filter((itemId) => itemId !== id));
  };

  // Clear all saved
  const handleClearSaved = () => {
    setSaved([]);
    addToast('Cleared wardrobe.', 'info');
  };

  // Reset session
  const handleResetSession = () => {
    setActiveFilters([]);
    setLiked([]);
    setSkipped([]);
    setSaved([]);
    setProfile(defaultProfile);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (_) {}
    addToast('Reset session to baseline.', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#111111] antialiased selection:bg-[#E8E2D9]">
      {/* Top Editorial Header & Main Navigation Tabs */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        savedCount={saved.length}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onResetSession={handleResetSession}
        activeFilterCount={activeFilters.length}
        activeFilterLabels={activeFilterLabels}
        onRemoveFilter={handleRemoveFilter}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentTab === 'feed' ? (
          <Feed
            items={rankedItems}
            likedIds={liked}
            skippedIds={skipped}
            savedIds={saved}
            onLike={handleLike}
            onSkip={handleSkip}
            onToggleSave={handleToggleSave}
            onRemoveLastFilter={handleRemoveLastFilter}
            onClearAllFilters={handleClearAllFilters}
            hasActiveFilters={activeFilters.length > 0}
            onToast={addToast}
            onRefine={handleRefine}
            isLoading={isLoading}
            onUndoLastAction={handleUndoLastAction}
            hasHistoryToUndo={actionHistory.length > 0}
            onSelectDetail={(item) => setSelectedDetailItem(item)}
            onSwitchToExplore={() => setCurrentTab('explore')}
          />
        ) : (
          <ExploreView
            items={rankedItems}
            savedIds={saved}
            likedIds={liked}
            onSelectVibe={handleSelectVibe}
            onSelectDetail={(item) => setSelectedDetailItem(item)}
            onLike={handleLike}
            onToggleSave={handleToggleSave}
            onToast={addToast}
          />
        )}
      </main>

      {/* AI Refinement Dock on Curated Edit View */}
      {currentTab === 'feed' && activeFilters.length > 0 && (
        <BottomDock
          onRefine={handleRefine}
          isLoading={isLoading}
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={handleClearAllFilters}
          onOpenSaved={() => setIsSavedOpen(true)}
          savedCount={saved.length}
        />
      )}

      {/* Modals & Drawers */}
      <SavedModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedItems={savedCatalogItems}
        onRemoveSaved={handleRemoveSaved}
        onClearSaved={handleClearSaved}
        onToast={addToast}
      />

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onUpdateProfile={setProfile}
      />

      <DetailModal
        item={selectedDetailItem}
        isOpen={!!selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        isSaved={selectedDetailItem ? saved.includes(selectedDetailItem.id) : false}
        isLiked={selectedDetailItem ? liked.includes(selectedDetailItem.id) : false}
        onToggleSave={handleToggleSave}
        onLike={handleLike}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
