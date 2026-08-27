import { ALLOWED_TAXONOMY, QUICK_SUGGESTIONS } from '@/data/taxonomy';

export interface SuggestionItem {
  label: string;
  query: string;
  category?: string;
}

// Master pool of real-time trending aesthetic queries for initial inspiration
export const TRENDING_AESTHETICS: SuggestionItem[] = [
  { label: 'Quiet Luxury Linen', query: 'linen quiet luxury relaxed summer', category: 'trend' },
  { label: 'Old Money Tailored', query: 'old money monochrome tailored blazer', category: 'trend' },
  { label: 'Rooftop Cocktail Silk', query: 'rooftop cocktail silk dressy evening', category: 'occasion' },
  { label: 'Minimalist Workwear', query: 'minimalist tailored office structured', category: 'occasion' },
  { label: 'Coastal Resort Breezy', query: 'coastal resort vacation flowy beach', category: 'trend' },
  { label: 'Date Night Slip', query: 'date night silk slip evening', category: 'occasion' },
  { label: 'Monochrome Knitwear', query: 'monochrome knit relaxed earthy', category: 'style' },
  { label: 'Sunset Floral Sundress', query: 'summer floral breezy sundress garden', category: 'trend' },
  { label: 'Oversized Street Edge', query: 'oversized relaxed modern casual street', category: 'style' },
  { label: 'Earthy Safari Linen', query: 'earthy olive linen resort travel', category: 'palette' },
  { label: 'Gala Black Tie', query: 'gala formal luxury black structured', category: 'occasion' },
  { label: 'Casual Sunday Brunch', query: 'casual brunch relaxed pastel', category: 'occasion' },
  { label: 'Tailored Wide-Leg', query: 'tailored wide-leg trousers chic office', category: 'silhouette' },
  { label: 'Silk Sheen Luxe', query: 'silk-sheen jewel-tone luxury evening', category: 'fabric' },
];

// Rich taxonomy suggestions database for real-time substring matching
const CONTEXTUAL_DATABASE: SuggestionItem[] = [
  ...TRENDING_AESTHETICS,
  // Fabrics
  { label: 'Pure Linen Texture', query: 'linen-texture relaxed airy', category: 'fabric' },
  { label: 'Sandwashed Silk', query: 'silk-sheen elegant fluid', category: 'fabric' },
  { label: 'Ribbed Knit Comfort', query: 'ribbed knit cozy textured', category: 'fabric' },
  { label: 'Crochet Summer Vibe', query: 'crochet vacation resort', category: 'fabric' },
  // Occasions
  { label: 'Beach Vacation', query: 'beach vacation relaxed breezy', category: 'occasion' },
  { label: 'Cocktail & Evening', query: 'cocktail rooftop evening dressy', category: 'occasion' },
  { label: 'Wedding Guest Chic', query: 'wedding-guest formal elegant pastel', category: 'occasion' },
  { label: 'Desk to Dinner', query: 'work dinner tailored versatile', category: 'occasion' },
  { label: 'Summer Festival', query: 'festival boho flowy vibrant', category: 'occasion' },
  // Palettes
  { label: 'Warm Earthy Tones', query: 'earthy terracotta brown warm', category: 'palette' },
  { label: 'Monochrome Black & White', query: 'monochrome black white crisp', category: 'palette' },
  { label: 'Olive & Sage Neutrals', query: 'olive sage neutral muted', category: 'palette' },
  { label: 'Jewel-Tone Elegance', query: 'jewel-tone burgundy navy rich', category: 'palette' },
  { label: 'Soft Pastels', query: 'pastel cream lavender soft', category: 'palette' },
  // Silhouettes
  { label: 'Flowy Maxi Silhouettes', query: 'flowy wrap maxi dress', category: 'silhouette' },
  { label: 'Structured Tailoring', query: 'structured tailored sharp minimalist', category: 'silhouette' },
  { label: 'Relaxed Oversized', query: 'oversized relaxed draped comfort', category: 'silhouette' },
  { label: 'Draped Bodycon', query: 'bodycon draped evening', category: 'silhouette' },
];

/**
 * Returns `count` randomly picked distinct trending suggestions for startup / page refresh.
 */
export function getRandomTrendingSuggestions(count: number = 4): SuggestionItem[] {
  const shuffled = [...TRENDING_AESTHETICS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Dynamically computes contextual suggestions as the user types.
 * Matches keywords across label, query, taxonomy tags and categories.
 */
export function getContextualSuggestions(
  query: string,
  activeFilterLabels: string[] = [],
  maxResults: number = 4
): SuggestionItem[] {
  const trimmed = query.trim().toLowerCase();
  const lowerActive = activeFilterLabels.map((l) => l.toLowerCase());

  if (!trimmed) {
    // If empty, return fresh random trending suggestions that aren't already active
    return TRENDING_AESTHETICS.filter(
      (item) => !lowerActive.includes(item.label.toLowerCase())
    ).slice(0, maxResults);
  }

  // Filter items matching the search query by prefix or inclusion
  const matches = CONTEXTUAL_DATABASE.filter((item) => {
    if (lowerActive.includes(item.label.toLowerCase())) return false;
    const inLabel = item.label.toLowerCase().includes(trimmed);
    const inQuery = item.query.toLowerCase().includes(trimmed);
    const inCategory = item.category?.toLowerCase().includes(trimmed);
    return inLabel || inQuery || inCategory;
  });

  // If we found specific matches, rank prefix matches higher
  if (matches.length > 0) {
    const sorted = matches.sort((a, b) => {
      const aStarts = a.label.toLowerCase().startsWith(trimmed) ? 0 : 1;
      const bStarts = b.label.toLowerCase().startsWith(trimmed) ? 0 : 1;
      return aStarts - bStarts;
    });
    return sorted.slice(0, maxResults);
  }

  // If no direct database matches, synthesize intuitive contextual suggestions around the user's term
  return [
    { label: `${capitalize(trimmed)} Outfits`, query: `${trimmed} aesthetic modern`, category: 'search' },
    { label: `${capitalize(trimmed)} Tailored`, query: `${trimmed} tailored clean`, category: 'search' },
    { label: `${capitalize(trimmed)} Minimalist`, query: `${trimmed} minimalist relaxed`, category: 'search' },
    { label: `${capitalize(trimmed)} Casual`, query: `${trimmed} casual effortless`, category: 'search' },
  ].slice(0, maxResults);
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
