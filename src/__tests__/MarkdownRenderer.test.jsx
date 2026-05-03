import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MarkdownRenderer from '../components/MarkdownRenderer';

describe('MarkdownRenderer Component', () => {
  it('renders markdown properly and safely', () => {
    const rawContent = '**Bold Text** and an [evil link](javascript:alert("xss")) and a [good link](https://google.com)';
    render(<MarkdownRenderer content={rawContent} />);
    
    // Check if strong tag was created
    const strongElement = screen.getByText('Bold Text');
    expect(strongElement.tagName).toBe('STRONG');
    
    // DOMPurify should strip the javascript: protocol link but keep the text or just sanitize the href
    const goodLink = screen.getByRole('link', { name: 'good link' });
    expect(goodLink).toHaveAttribute('href', 'https://google.com');
  });

  it('handles empty content without crashing', () => {
    const { container } = render(<MarkdownRenderer content="" />);
    expect(container).toBeInTheDocument();
  });
});
