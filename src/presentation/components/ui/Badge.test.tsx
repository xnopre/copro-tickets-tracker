import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from './Badge';

describe('Badge', () => {
  it('should render with blue variant by default', () => {
    render(<Badge>Status</Badge>);
    const badge = screen.getByText('Status');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100');
    expect(badge).toHaveClass('text-blue-800');
  });

  it('should render with yellow variant', () => {
    render(<Badge variant="yellow">In Progress</Badge>);
    const badge = screen.getByText('In Progress');
    expect(badge).toHaveClass('bg-yellow-100');
    expect(badge).toHaveClass('text-yellow-800');
  });

  it('should render with green variant', () => {
    render(<Badge variant="green">Resolved</Badge>);
    const badge = screen.getByText('Resolved');
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-800');
  });

  it('should render with gray variant', () => {
    render(<Badge variant="gray">Closed</Badge>);
    const badge = screen.getByText('Closed');
    expect(badge).toHaveClass('bg-gray-100');
    expect(badge).toHaveClass('text-gray-800');
  });

  it('should render with red variant', () => {
    render(<Badge variant="red">Urgent</Badge>);
    const badge = screen.getByText('Urgent');
    expect(badge).toHaveClass('bg-red-100');
    expect(badge).toHaveClass('text-red-800');
  });

  it('should render with gray-light variant', () => {
    render(<Badge variant="gray-light">Archived</Badge>);
    const badge = screen.getByText('Archived');
    expect(badge).toHaveClass('bg-gray-200');
    expect(badge).toHaveClass('text-gray-700');
  });

  it('should render with gray-dark variant', () => {
    render(<Badge variant="gray-dark">ARCHIVED</Badge>);
    const badge = screen.getByText('ARCHIVED');
    expect(badge).toHaveClass('bg-gray-600');
    expect(badge).toHaveClass('text-white');
  });

  it('should render with xs size by default', () => {
    render(<Badge>Small Badge</Badge>);
    const badge = screen.getByText('Small Badge');
    expect(badge).toHaveClass('px-3');
    expect(badge).toHaveClass('py-1');
    expect(badge).toHaveClass('text-xs');
  });

  it('should render with sm size', () => {
    render(<Badge size="sm">Medium Badge</Badge>);
    const badge = screen.getByText('Medium Badge');
    expect(badge).toHaveClass('px-4');
    expect(badge).toHaveClass('py-2');
    expect(badge).toHaveClass('text-sm');
  });

  it('should be rounded-full by default', () => {
    render(<Badge>Rounded Full</Badge>);
    const badge = screen.getByText('Rounded Full');
    expect(badge).toHaveClass('rounded-full');
    expect(badge).not.toHaveClass('rounded');
  });

  it('should be rounded when rounded is false', () => {
    render(<Badge rounded={false}>Rounded</Badge>);
    const badge = screen.getByText('Rounded');
    expect(badge).toHaveClass('rounded');
    expect(badge).not.toHaveClass('rounded-full');
  });

  it('should apply custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-class');
  });

  it('should apply aria-label attribute', () => {
    render(<Badge aria-label="Status badge">New</Badge>);
    const badge = screen.getByText('New');
    expect(badge).toHaveAttribute('aria-label', 'Status badge');
  });

  it('should have font-medium class', () => {
    render(<Badge>Bold Text</Badge>);
    const badge = screen.getByText('Bold Text');
    expect(badge).toHaveClass('font-medium');
  });

  it('should combine variant, size and rounded props correctly', () => {
    render(
      <Badge variant="green" size="sm" rounded={false}>
        Complex Badge
      </Badge>
    );
    const badge = screen.getByText('Complex Badge');
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-800');
    expect(badge).toHaveClass('px-4');
    expect(badge).toHaveClass('py-2');
    expect(badge).toHaveClass('text-sm');
    expect(badge).toHaveClass('rounded');
    expect(badge).not.toHaveClass('rounded-full');
  });
});
