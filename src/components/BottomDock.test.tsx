import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BottomDock } from './BottomDock';
import { ActiveFilter } from '@/types/catalog';

const mockFilters: ActiveFilter[] = [
  {
    id: 'f1',
    label: 'Quiet Luxury Linen',
    tags: {
      pattern: ['linen-texture'],
      palette: ['earthy'],
    },
  },
];

describe('BottomDock Component (Search & Cascade)', () => {
  it('renders the compact dock pill by default', () => {
    render(
      <BottomDock
        onRefine={vi.fn()}
        isLoading={false}
        activeFilters={[]}
        onRemoveFilter={vi.fn()}
        onClearAllFilters={vi.fn()}
        onOpenSaved={vi.fn()}
        savedCount={0}
      />
    );

    expect(screen.getByText('Search style, fabric, vibe...')).toBeDefined();
  });

  it('expands into the full prominent search form upon click', async () => {
    render(
      <BottomDock
        onRefine={vi.fn()}
        isLoading={false}
        activeFilters={[]}
        onRemoveFilter={vi.fn()}
        onClearAllFilters={vi.fn()}
        onOpenSaved={vi.fn()}
        savedCount={0}
      />
    );

    const compactPill = screen.getByLabelText('Open search and refinement bar');
    fireEvent.click(compactPill);

    const input = await screen.findByPlaceholderText(/Search style, fabric/i);
    expect(input).toBeDefined();
  });

  it('displays active filter count badge and specificity progress when filters exist', () => {
    render(
      <BottomDock
        onRefine={vi.fn()}
        isLoading={false}
        activeFilters={mockFilters}
        onRemoveFilter={vi.fn()}
        onClearAllFilters={vi.fn()}
        onOpenSaved={vi.fn()}
        savedCount={0}
      />
    );

    expect(screen.getByText('Quiet Luxury Linen')).toBeDefined();
    expect(screen.getByText('1')).toBeDefined();
  });
});
