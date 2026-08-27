import { z } from 'zod';

export type OccasionTag =
  | 'vacation'
  | 'casual'
  | 'work'
  | 'formal'
  | 'cocktail'
  | 'date-night'
  | 'brunch'
  | 'gala'
  | 'lounge'
  | 'festival'
  | 'wedding-guest'
  | 'party'
  | 'travel';

export type SettingTag =
  | 'beach'
  | 'city'
  | 'outdoor'
  | 'rooftop'
  | 'office'
  | 'resort'
  | 'dinner'
  | 'cafe'
  | 'club'
  | 'cozy-indoor'
  | 'garden';

export type PaletteTag =
  | 'white'
  | 'cream'
  | 'black'
  | 'earthy'
  | 'olive'
  | 'terracotta'
  | 'navy'
  | 'pastel'
  | 'monochrome'
  | 'jewel-tone'
  | 'vibrant'
  | 'neutral'
  | 'brown'
  | 'burgundy'
  | 'gold';

export type PatternTag =
  | 'solid'
  | 'floral'
  | 'striped'
  | 'linen-texture'
  | 'silk-sheen'
  | 'abstract'
  | 'plaid'
  | 'geometric'
  | 'ribbed'
  | 'knit'
  | 'crochet';

export type SilhouetteTag =
  | 'relaxed'
  | 'tailored'
  | 'oversized'
  | 'wrap'
  | 'flowy'
  | 'structured'
  | 'minimalist'
  | 'layered'
  | 'bodycon'
  | 'cropped'
  | 'wide-leg'
  | 'draped';

export type SeasonTag =
  | 'summer'
  | 'fall'
  | 'winter'
  | 'spring'
  | 'transitional'
  | 'all-season';

export type CategoryTag =
  | 'top'
  | 'bottom'
  | 'dress'
  | 'outerwear'
  | 'set'
  | 'footwear'
  | 'accessory';

export type PriceTierTag = 'budget' | 'mid' | 'premium' | 'luxury';

export type ShopForTag = 'womenswear' | 'menswear' | 'unisex';

export type TaxonomyField =
  | 'occasion'
  | 'setting'
  | 'palette'
  | 'pattern'
  | 'silhouette'
  | 'season'
  | 'category'
  | 'priceTier'
  | 'shopFor';

export interface CatalogItem {
  id: string;
  name: string;
  brand?: string;
  image: string;
  price: number;
  priceTier: PriceTierTag;
  category: CategoryTag;
  occasion: string[];
  setting: string[];
  palette: string[];
  pattern: string[];
  silhouette: string[];
  season: string[];
  shopFor: string[];
  description?: string;
}

export interface ActiveFilterTags {
  occasion?: string[];
  setting?: string[];
  palette?: string[];
  pattern?: string[];
  silhouette?: string[];
  season?: string[];
  category?: string[];
  priceTier?: string[];
  shopFor?: string[];
}

export interface ActiveFilter {
  id: string;
  label: string;
  tags: ActiveFilterTags;
  createdAt?: number;
}

export interface UserProfile {
  shopFor: ShopForTag | 'all';
  heightCm?: number | null;
  ageRange?: string | null;
  undertone?: string | null;
  aestheticPreference?: string | null;
  preferredPalettes?: string[];
  preferredFabrics?: string[];
}

export interface SessionState {
  profile: UserProfile;
  activeFilters: ActiveFilter[];
  liked: string[];
  skipped: string[];
  saved: string[];
}

export interface RankedCatalogItem extends CatalogItem {
  score: number;
  matchedTags: {
    field: string;
    value: string;
  }[];
}

// Zod validation schemas for Gemini API communication
export const InterpretResponseSchema = z.object({
  label: z.string().min(1).max(60),
  tags: z.object({
    occasion: z.array(z.string()).optional().default([]),
    setting: z.array(z.string()).optional().default([]),
    palette: z.array(z.string()).optional().default([]),
    pattern: z.array(z.string()).optional().default([]),
    silhouette: z.array(z.string()).optional().default([]),
    season: z.array(z.string()).optional().default([]),
    category: z.array(z.string()).optional().default([]),
    priceTier: z.array(z.string()).optional().default([]),
    shopFor: z.array(z.string()).optional().default([]),
  }),
});

export type InterpretResponse = z.infer<typeof InterpretResponseSchema>;
