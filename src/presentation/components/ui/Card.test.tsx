import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from './Card';

describe('Card', () => {
  it('should render children', () => {
    render(<Card>Card content</Card>);
    const card = screen.getByText('Card content');
    expect(card).toBeInTheDocument();
  });

  it('should have default variant and shadow', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('shadow-md');
    expect(card).not.toHaveClass('border');
  });

  it('should render with bordered variant', () => {
    const { container } = render(<Card variant="bordered">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('border-gray-200');
  });

  it('should render with sm shadow', () => {
    const { container } = render(<Card shadow="sm">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-sm');
    expect(card).not.toHaveClass('shadow-md');
  });

  it('should render with md shadow by default', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-md');
  });

  it('should render with lg shadow', () => {
    const { container } = render(<Card shadow="lg">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-lg');
  });

  it('should render with sm padding', () => {
    const { container } = render(<Card padding="sm">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('p-4');
    expect(card).not.toHaveClass('p-6');
  });

  it('should render with md padding by default', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('p-6');
  });

  it('should render with lg padding', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('p-8');
    expect(card).not.toHaveClass('p-6');
  });

  it('should render as clickable with hover effects', () => {
    const { container } = render(<Card clickable>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('cursor-pointer');
    expect(card).toHaveClass('transition-shadow');
    expect(card).toHaveClass('hover:shadow-lg');
  });

  it('should not have clickable styles by default', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).not.toHaveClass('cursor-pointer');
    expect(card).not.toHaveClass('transition-shadow');
  });

  it('should apply custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });

  it('should combine multiple props correctly', () => {
    const { container } = render(
      <Card variant="bordered" shadow="sm" padding="sm">
        Content
      </Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('border-gray-200');
    expect(card).toHaveClass('shadow-sm');
    expect(card).toHaveClass('p-4');
  });

  it('should pass through other HTML div attributes', () => {
    const { container } = render(
      <Card id="test-card" data-testid="card">
        Content
      </Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute('id', 'test-card');
    expect(card).toHaveAttribute('data-testid', 'card');
  });
});
