import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ElectionTimeline from '../components/ElectionTimeline';

describe('ElectionTimeline Component', () => {
  it('renders all timeline steps', () => {
    render(<ElectionTimeline />);
    
    // Check if the main heading is present
    expect(screen.getByText('The Election Process')).toBeInTheDocument();
    
    // Check if all steps are rendered
    expect(screen.getByText('Voter Registration')).toBeInTheDocument();
    expect(screen.getByText('Campaigning')).toBeInTheDocument();
    expect(screen.getByText('Election Day')).toBeInTheDocument();
    expect(screen.getByText('Results & Declaration')).toBeInTheDocument();
  });

  it('toggles details on click', () => {
    render(<ElectionTimeline />);
    
    const firstStep = screen.getByText('Voter Registration').closest('.timeline-step');
    expect(firstStep).toHaveAttribute('aria-expanded', 'false');
    
    // Click the step
    fireEvent.click(firstStep);
    expect(firstStep).toHaveAttribute('aria-expanded', 'true');
    
    // Click again to close
    fireEvent.click(firstStep);
    expect(firstStep).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports keyboard navigation', () => {
    render(<ElectionTimeline />);
    
    const firstStep = screen.getByText('Voter Registration').closest('.timeline-step');
    
    // Press Enter to open
    fireEvent.keyDown(firstStep, { key: 'Enter', code: 'Enter' });
    expect(firstStep).toHaveAttribute('aria-expanded', 'true');
  });
});
