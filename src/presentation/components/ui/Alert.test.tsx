import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Alert from './Alert';

describe('Alert', () => {
  it('should render with info variant by default', () => {
    render(<Alert>Information message</Alert>);
    const alert = screen.getByText('Information message');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('border-blue-400');
    expect(alert).toHaveClass('bg-blue-100');
    expect(alert).toHaveClass('text-blue-700');
  });

  it('should render with error variant', () => {
    render(<Alert variant="error">Error message</Alert>);
    const alert = screen.getByText('Error message');
    expect(alert).toHaveClass('border-red-400');
    expect(alert).toHaveClass('bg-red-100');
    expect(alert).toHaveClass('text-red-700');
  });

  it('should render with success variant', () => {
    render(<Alert variant="success">Success message</Alert>);
    const alert = screen.getByText('Success message');
    expect(alert).toHaveClass('border-green-400');
    expect(alert).toHaveClass('bg-green-100');
    expect(alert).toHaveClass('text-green-700');
  });

  it('should render with warning variant', () => {
    render(<Alert variant="warning">Warning message</Alert>);
    const alert = screen.getByText('Warning message');
    expect(alert).toHaveClass('border-yellow-400');
    expect(alert).toHaveClass('bg-yellow-100');
    expect(alert).toHaveClass('text-yellow-700');
  });

  it('should have proper ARIA attributes for error variant', () => {
    render(<Alert variant="error">Error message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('should have proper ARIA attributes for success variant', () => {
    render(<Alert variant="success">Success message</Alert>);
    const alert = screen.getByRole('status');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });

  it('should have proper ARIA attributes for info variant', () => {
    render(<Alert variant="info">Info message</Alert>);
    const alert = screen.getByRole('status');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });

  it('should have proper ARIA attributes for warning variant', () => {
    render(<Alert variant="warning">Warning message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('should apply custom className', () => {
    render(<Alert className="custom-class">Message</Alert>);
    const alert = screen.getByText('Message');
    expect(alert).toHaveClass('custom-class');
  });

  it('should apply custom id', () => {
    render(<Alert id="custom-id">Message</Alert>);
    const alert = screen.getByText('Message');
    expect(alert).toHaveAttribute('id', 'custom-id');
  });

  it('should have common base classes', () => {
    render(<Alert>Message</Alert>);
    const alert = screen.getByText('Message');
    expect(alert).toHaveClass('mb-4');
    expect(alert).toHaveClass('rounded-md');
    expect(alert).toHaveClass('border');
    expect(alert).toHaveClass('p-3');
    expect(alert).toHaveClass('text-sm');
  });
});
