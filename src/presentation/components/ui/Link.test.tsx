import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Link from './Link';

describe('Link', () => {
  it('should render children', () => {
    render(<Link href="/test">Link text</Link>);
    const link = screen.getByText('Link text');
    expect(link).toBeInTheDocument();
  });

  it('should have correct href attribute', () => {
    render(<Link href="/test">Link text</Link>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('should have default text variant styles', () => {
    render(<Link href="/test">Link text</Link>);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('text-blue-600');
    expect(link).toHaveClass('hover:text-blue-800');
    expect(link).toHaveClass('rounded');
    expect(link).toHaveClass('focus:ring-2');
    expect(link).toHaveClass('focus:ring-blue-500');
    expect(link).toHaveClass('focus:ring-offset-2');
    expect(link).toHaveClass('focus:outline-none');
  });

  it('should render with button variant and default size', () => {
    render(
      <Link href="/test" variant="button">
        Button link
      </Link>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('bg-blue-600');
    expect(link).toHaveClass('px-4');
    expect(link).toHaveClass('py-2');
    expect(link).toHaveClass('text-white');
    expect(link).toHaveClass('hover:bg-blue-700');
    expect(link).not.toHaveClass('text-blue-600');
  });

  it('should render with button variant and sm size', () => {
    render(
      <Link href="/test" variant="button" size="sm">
        Small button
      </Link>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('bg-blue-600');
    expect(link).toHaveClass('px-4');
    expect(link).toHaveClass('py-2');
  });

  it('should render with button variant and lg size', () => {
    render(
      <Link href="/test" variant="button" size="lg">
        Large button
      </Link>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('bg-blue-600');
    expect(link).toHaveClass('px-6');
    expect(link).toHaveClass('py-3');
  });

  it('should render with unstyled variant', () => {
    render(
      <Link href="/test" variant="unstyled">
        Unstyled link
      </Link>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('rounded');
    expect(link).toHaveClass('focus:ring-2');
    expect(link).not.toHaveClass('text-blue-600');
    expect(link).not.toHaveClass('bg-blue-600');
  });

  it('should apply custom className', () => {
    render(
      <Link href="/test" className="custom-class">
        Link text
      </Link>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-class');
  });

  it('should pass through aria-label attribute', () => {
    render(
      <Link href="/test" aria-label="Test link">
        Link
      </Link>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-label', 'Test link');
  });

  it('should combine button variant with custom className', () => {
    render(
      <Link href="/test" variant="button" className="extra-class">
        Button
      </Link>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('bg-blue-600');
    expect(link).toHaveClass('extra-class');
  });
});
