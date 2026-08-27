import { describe, it, expect } from 'vitest';
import { calculateItemScore, rankCatalog } from './scoring';
import { CatalogItem, ActiveFilter } from '../types/catalog';

const mockCatalog: CatalogItem[] = [
  {
    id: 'item_001',
    name: 'Linen Beach Maxi',
    price: 120,
    priceTier: 'mid',
    category: 'dress',
    image: '/images/1.jpg',
    occasion: ['vacation', 'casual'],
    setting: ['beach', 'resort'],
    palette: ['white', 'cream'],
    pattern: ['floral', 'linen-texture'],
    silhouette: ['flowy', 'wrap'],
    season: ['summer'],
    shopFor: ['womenswear'],
  },
  {
    id: 'item_002',
    name: 'Wool Office Blazer',
    price: 250,
    priceTier: 'premium',
    category: 'outerwear',
    image: '/images/2.jpg',
    occasion: ['work', 'formal'],
    setting: ['office', 'city'],
    palette: ['black', 'monochrome'],
    pattern: ['solid'],
    silhouette: ['tailored', 'structured'],
    season: ['fall', 'winter'],
    shopFor: ['womenswear', 'unisex'],
  },
  {
    id: 'item_003',
    name: 'Resort Silk Camp Shirt',
    price: 160,
    priceTier: 'mid',
    category: 'top',
    image: '/images/3.jpg',
    occasion: ['vacation', 'casual'],
    setting: ['beach', 'dinner'],
    palette: ['olive', 'earthy'],
    pattern: ['solid', 'silk-sheen'],
    silhouette: ['relaxed', 'oversized'],
    season: ['summer'],
    shopFor: ['unisex', 'menswear'],
  },
];

describe('Deterministic Scoring Engine', () => {
  it('returns 0 score when no active filters exist', () => {
    const result = calculateItemScore(mockCatalog[0], []);
    expect(result.score).toBe(0);
    expect(result.matchedTags).toEqual([]);
  });

  it('correctly scores and identifies matching tags for single filter', () => {
    const filter: ActiveFilter = {
      id: 'f1',
      label: 'Beach vacation',
      tags: {
        occasion: ['vacation'],
        setting: ['beach'],
      },
    };

    const scoreItem1 = calculateItemScore(mockCatalog[0], [filter]);
    const scoreItem2 = calculateItemScore(mockCatalog[1], [filter]);

    // Item 1 matches both occasion: vacation (3.2) and setting: beach (2.8) -> 6.0
    expect(scoreItem1.score).toBe(6.0);
    expect(scoreItem1.matchedTags).toHaveLength(2);
    expect(scoreItem1.matchedTags).toEqual(
      expect.arrayContaining([
        { field: 'occasion', value: 'vacation' },
        { field: 'setting', value: 'beach' },
      ])
    );

    // Item 2 has no matches
    expect(scoreItem2.score).toBe(0);
  });

  it('compounds scores across multiple stacked breadcrumb filters', () => {
    const filter1: ActiveFilter = {
      id: 'f1',
      label: 'Beach vacation',
      tags: {
        occasion: ['vacation'],
        setting: ['beach'],
      },
    };

    const filter2: ActiveFilter = {
      id: 'f2',
      label: 'Floral',
      tags: {
        pattern: ['floral'],
      },
    };

    const scoredSingle = calculateItemScore(mockCatalog[0], [filter1]);
    const scoredStacked = calculateItemScore(mockCatalog[0], [filter1, filter2]);

    // Pattern weight is 1.8; 6.0 + 1.8 = 7.8
    expect(scoredStacked.score).toBeGreaterThan(scoredSingle.score);
    expect(scoredStacked.score).toBe(7.8);
  });

  it('ranks catalog items descending by score with stable tie-breaking', () => {
    const filter: ActiveFilter = {
      id: 'f1',
      label: 'Beach vacation',
      tags: {
        occasion: ['vacation'],
        setting: ['beach'],
      },
    };

    const ranked = rankCatalog(mockCatalog, [filter]);

    // Item 1 and Item 3 both match vacation + beach (score 6.0), Item 2 score 0
    expect(ranked[0].score).toBe(6.0);
    expect(ranked[1].score).toBe(6.0);
    expect(ranked[2].score).toBe(0);

    // Tie between item_001 and item_003 is broken by id alphabetically
    expect(ranked[0].id).toBe('item_001');
    expect(ranked[1].id).toBe('item_003');
    expect(ranked[2].id).toBe('item_002');
  });

  it('removing a filter restores previous score exactly (deterministic & reversible)', () => {
    const filter1: ActiveFilter = {
      id: 'f1',
      label: 'Beach vacation',
      tags: { occasion: ['vacation'] },
    };
    const filter2: ActiveFilter = {
      id: 'f2',
      label: 'Formal work',
      tags: { occasion: ['work'] },
    };

    const stateWithBoth = rankCatalog(mockCatalog, [filter1, filter2]);
    const stateWithoutFilter2 = rankCatalog(mockCatalog, [filter1]);

    const item1StateBoth = stateWithBoth.find((i) => i.id === 'item_001');
    const item1StateWithout = stateWithoutFilter2.find((i) => i.id === 'item_001');

    expect(item1StateBoth?.score).toBe(item1StateWithout?.score);
  });

  it('handles empty or malformed filter tags without crashing', () => {
    const malformedFilter: ActiveFilter = {
      id: 'f_bad',
      label: 'Empty',
      tags: {},
    };

    expect(() => calculateItemScore(mockCatalog[0], [malformedFilter])).not.toThrow();
    const result = calculateItemScore(mockCatalog[0], [malformedFilter]);
    expect(result.score).toBe(0);
  });
});
