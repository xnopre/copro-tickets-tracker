import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('should render with primary variant by default', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600');
  });

  it('should render with danger variant', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('bg-red-600');
  });

  it('should render with secondary variant', () => {
    render(<Button variant="secondary">Cancel</Button>);
    const button = screen.getByRole('button', { name: 'Cancel' });
    expect(button).toHaveClass('bg-gray-200');
  });

  it('should render with small size', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button', { name: 'Small' });
    expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('py-1.5');
  });

  it('should render with medium size by default', () => {
    render(<Button>Medium</Button>);
    const button = screen.getByRole('button', { name: 'Medium' });
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
  });

  it('should render with large size', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button', { name: 'Large' });
    expect(button).toHaveClass('px-6');
    expect(button).toHaveClass('py-3');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
    expect(button).toHaveClass('disabled:cursor-not-allowed');
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button', { name: 'Custom' });
    expect(button).toHaveClass('custom-class');
  });

  it('should pass through additional props', () => {
    render(
      <Button type="submit" aria-label="Submit form">
        Submit
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Submit form' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should have proper accessibility attributes', () => {
    render(<Button>Accessible</Button>);
    const button = screen.getByRole('button', { name: 'Accessible' });
    expect(button).toHaveClass('focus:outline-none');
    expect(button).toHaveClass('focus:ring-2');
    expect(button).toHaveClass('focus:ring-offset-2');
  });
});
