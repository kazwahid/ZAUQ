import { CatalogItem, ActiveFilter, RankedCatalogItem, UserProfile, TaxonomyField } from '../types/catalog';
import { FIELD_WEIGHTS } from '../data/taxonomy';

/**
 * Calculates a deterministic matching score for a single catalog item against active filters.
 *
 * Scoring algorithm:
 * Sums matching tag values across all active breadcrumb filters weighted by the taxonomy field.
 * High-intent fields (occasion, setting) carry higher weights than auxiliary fields (season, palette).
 */
export function calculateItemScore(
  item: CatalogItem,
  activeFilters: ActiveFilter[]
): { score: number; matchedTags: { field: string; value: string }[] } {
  if (!activeFilters || activeFilters.length === 0) {
    return { score: 0, matchedTags: [] };
  }

  let totalScore = 0;
  const matchedTags: { field: string; value: string }[] = [];
  const matchedTagKeys = new Set<string>();

  for (const filter of activeFilters) {
    let hasTagMatch = false;

    // 1. Structured taxonomy matching
    if (filter.tags && Object.keys(filter.tags).length > 0) {
      for (const [fieldKey, filterValues] of Object.entries(filter.tags)) {
        const field = fieldKey as TaxonomyField;
        if (!Array.isArray(filterValues) || filterValues.length === 0) continue;

        const itemValues = (item[field] as string[] | undefined) || [];
        if (!Array.isArray(itemValues)) continue;

        const weight = FIELD_WEIGHTS[field] || 1.0;

        for (const val of filterValues) {
          const normalizedFilterVal = val.toLowerCase().trim();
          const isMatch = itemValues.some(
            (itemVal) => itemVal.toLowerCase().trim() === normalizedFilterVal
          );

          if (isMatch) {
            hasTagMatch = true;
            totalScore += weight;
            const tagKey = `${field}:${normalizedFilterVal}`;
            if (!matchedTagKeys.has(tagKey)) {
              matchedTagKeys.add(tagKey);
              matchedTags.push({ field, value: normalizedFilterVal });
            }
          }
        }
      }
    }

    // 2. Keyword fallback matching when structured tags are absent
    const hasAnyTags = filter.tags && Object.values(filter.tags).some(arr => Array.isArray(arr) && arr.length > 0);
    if (!hasAnyTags && filter.label) {
      const itemText = `${item.name} ${item.brand || ''} ${item.description || ''} ${item.category}`.toLowerCase();
      const filterWords = filter.label.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      for (const word of filterWords) {
        if (itemText.includes(word)) {
          totalScore += 1.5;
          const tagKey = `keyword:${word}`;
          if (!matchedTagKeys.has(tagKey)) {
            matchedTagKeys.add(tagKey);
            matchedTags.push({ field: 'keyword', value: word });
          }
        }
      }
    }
  }

  // Round score to 2 decimal places for clean display and consistency
  return {
    score: Math.round(totalScore * 100) / 100,
    matchedTags,
  };
}

/**
 * Ranks an array of catalog items deterministically.
 *
 * - When filters are present, sorts descending by score.
 * - Stable tie-breaker: sorts alphabetically by `item.id` so ranking is 100% deterministic and jitter-free.
 * - Respects profile shopFor preference (womenswear / menswear / unisex) if set.
 */
export function rankCatalog(
  items: CatalogItem[],
  activeFilters: ActiveFilter[],
  profile?: UserProfile
): RankedCatalogItem[] {
  if (!items || items.length === 0) return [];

  // Filter by shopFor if explicitly chosen in profile and not 'all'
  let filteredItems = items;
  if (profile && profile.shopFor && profile.shopFor !== 'all') {
    filteredItems = items.filter(
      (item) =>
        item.shopFor.includes(profile.shopFor) ||
        item.shopFor.includes('unisex')
    );
  }

  const scoredItems: RankedCatalogItem[] = filteredItems.map((item) => {
    const { score, matchedTags } = calculateItemScore(item, activeFilters);
    return {
      ...item,
      score,
      matchedTags,
    };
  });

  // If no filters are active, return catalog in its stable curated order
  if (!activeFilters || activeFilters.length === 0) {
    return scoredItems;
  }

  // Sort descending by score; ties broken by stable secondary key 'id'
  return scoredItems.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.id.localeCompare(b.id);
  });
}
