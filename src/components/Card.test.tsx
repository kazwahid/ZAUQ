import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Card } from './Card';
import { RankedCatalogItem } from '@/types/catalog';

const mockItem: RankedCatalogItem = {
  id: 'item_test_001',
  name: 'Silk Slip Midi Dress',
  brand: 'Atelier Nöir',
  category: 'dress',
  price: 185,
  image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
  description: 'Pure sandwashed mulberry silk slip dress with delicate cowl neckline.',
  occasion: ['cocktail', 'date-night'],
  setting: ['dinner', 'rooftop'],
  palette: ['black'],
  pattern: ['silk-sheen'],
  silhouette: ['bodycon', 'minimalist'],
  season: ['all-season'],
  priceTier: ['premium'],
  shopFor: ['womenswear'],
  score: 8.5,
  matchedTags: [
    { field: 'occasion', value: 'cocktail' },
    { field: 'palette', value: 'black' },
  ],
};

describe('Card Component (Reels Mode & Interactions)', () => {
  it('renders item details, brand, price and match percentage correctly', () => {
    render(
      <Card
        item={mockItem}
        isSaved={false}
        isLiked={false}
        onLike={vi.fn()}
        onToggleSave={vi.fn()}
        showMatchScore={true}
        isStreamMode={true}
      />
    );

    expect(screen.getByText('Silk Slip Midi Dress')).toBeDefined();
    expect(screen.getByText('Atelier Nöir')).toBeDefined();
    expect(screen.getByText('$185')).toBeDefined();
    expect(screen.getByText('Strong Match')).toBeDefined();
  });

  it('triggers like and save callbacks when interaction buttons are clicked', () => {
    const handleLike = vi.fn();
    const handleToggleSave = vi.fn();

    render(
      <Card
        item={mockItem}
        isSaved={false}
        isLiked={false}
        onLike={handleLike}
        onToggleSave={handleToggleSave}
        showMatchScore={true}
        isStreamMode={true}
      />
    );

    const likeButton = screen.getByLabelText('Like outfit');
    fireEvent.click(likeButton);
    expect(handleLike).toHaveBeenCalledWith('item_test_001');

    const saveButton = screen.getByLabelText('Save to wardrobe');
    fireEvent.click(saveButton);
    expect(handleToggleSave).toHaveBeenCalledWith('item_test_001');
  });

  it('calls onSelectDetail when the card is clicked', () => {
    const handleSelectDetail = vi.fn();

    render(
      <Card
        item={mockItem}
        isSaved={false}
        isLiked={false}
        onLike={vi.fn()}
        onToggleSave={vi.fn()}
        onClickDetail={handleSelectDetail}
        showMatchScore={true}
        isStreamMode={true}
      />
    );

    const imageContainer = screen.getByAltText('Silk Slip Midi Dress');
    fireEvent.click(imageContainer);
    expect(handleSelectDetail).toHaveBeenCalledWith(mockItem);
  });
});
