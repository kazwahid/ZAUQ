import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BreadcrumbChips } from './BreadcrumbChips';
import { ActiveFilter } from '../types/catalog';

describe('BreadcrumbChips Component', () => {
  const mockFilters: ActiveFilter[] = [
    {
      id: 'f1',
      label: 'Beach Vacation',
      tags: { occasion: ['vacation'], setting: ['beach'] },
    },
    {
      id: 'f2',
      label: 'Floral Linen',
      tags: { pattern: ['floral', 'linen-texture'] },
    },
  ];

  it('renders nothing when activeFilters is empty', () => {
    const { container } = render(
      <BreadcrumbChips
        activeFilters={[]}
        onRemoveFilter={vi.fn()}
        onClearAll={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders active filter chips with their labels', () => {
    render(
      <BreadcrumbChips
        activeFilters={mockFilters}
        onRemoveFilter={vi.fn()}
        onClearAll={vi.fn()}
      />
    );

    expect(screen.getByText('Beach Vacation')).toBeInTheDocument();
    expect(screen.getByText('Floral Linen')).toBeInTheDocument();
  });

  it('calls onRemoveFilter when remove button is clicked', () => {
    const handleRemove = vi.fn();
    render(
      <BreadcrumbChips
        activeFilters={mockFilters}
        onRemoveFilter={handleRemove}
        onClearAll={vi.fn()}
      />
    );

    const removeBtn = screen.getByLabelText('Remove filter Beach Vacation');
    fireEvent.click(removeBtn);

    expect(handleRemove).toHaveBeenCalledWith('f1');
  });

  it('displays Clear All button when 2 or more filters are present', () => {
    const handleClearAll = vi.fn();
    render(
      <BreadcrumbChips
        activeFilters={mockFilters}
        onRemoveFilter={vi.fn()}
        onClearAll={handleClearAll}
      />
    );

    const clearAllBtn = screen.getByLabelText('Clear all active filters');
    expect(clearAllBtn).toBeInTheDocument();

    fireEvent.click(clearAllBtn);
    expect(handleClearAll).toHaveBeenCalledTimes(1);
  });
});
