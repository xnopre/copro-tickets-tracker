import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Input from './Input';

describe('Input', () => {
  it('should render an input without label', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('should render with a label', () => {
    render(<Input label="Username" />);
    const label = screen.getByText('Username');
    const input = screen.getByLabelText('Username');
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('should show required indicator when required prop is true', () => {
    render(<Input label="Email" required />);
    const requiredIndicator = screen.getByLabelText('requis');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveTextContent('*');
  });

  it('should display error message when error prop is provided', () => {
    render(<Input label="Password" error="Password is required" />);
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Password is required');
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('should display helper text when helperText prop is provided', () => {
    render(<Input label="Username" helperText="Enter your unique username" />);
    const helperText = screen.getByText('Enter your unique username');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-gray-500');
  });

  it('should not display helper text when both error and helperText are provided', () => {
    render(<Input label="Email" error="Invalid email" helperText="Enter a valid email" />);
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Invalid email');
    expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument();
  });

  it('should have proper aria attributes', () => {
    render(<Input label="Email" required error="Invalid email" />);
    const input = screen.getByLabelText(/Email/);
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('should have aria-invalid=false when no error', () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input label="Disabled Input" disabled />);
    const input = screen.getByLabelText('Disabled Input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:bg-gray-100');
  });

  it('should apply custom className', () => {
    render(<Input label="Custom" className="custom-class" />);
    const input = screen.getByLabelText('Custom');
    expect(input).toHaveClass('custom-class');
  });

  it('should apply error styles when error is present', () => {
    render(<Input label="Email" error="Invalid" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('border-red-300');
    expect(input).toHaveClass('focus:ring-red-500');
  });

  it('should apply default styles when no error', () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('border-gray-300');
    expect(input).toHaveClass('focus:ring-blue-500');
  });

  it('should use provided id for input', () => {
    render(<Input label="Email" id="email-input" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'email-input');
  });

  it('should generate unique id when not provided', () => {
    const { container } = render(<Input label="Email" />);
    const input = container.querySelector('input');
    const label = container.querySelector('label');

    expect(input?.id).toBeTruthy();
    expect(input?.id).not.toBe('');
    expect(label?.htmlFor).toBe(input?.id);
  });

  it('should forward ref correctly', () => {
    const ref = { current: null };
    render(<Input label="Email" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should pass through other HTML input attributes', () => {
    render(<Input label="Email" type="email" placeholder="email@example.com" name="email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'email@example.com');
    expect(input).toHaveAttribute('name', 'email');
  });
});
