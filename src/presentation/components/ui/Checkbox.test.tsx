import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('should render a checkbox without label', () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeInTheDocument();
  });

  it('should render with a label', () => {
    render(<Checkbox label="Accept terms" />);
    const label = screen.getByText('Accept terms');
    const checkbox = screen.getByLabelText('Accept terms');
    expect(label).toBeInTheDocument();
    expect(checkbox).toBeInTheDocument();
  });

  it('should display error message when error prop is provided', () => {
    render(<Checkbox label="Accept terms" error="You must accept the terms" />);
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('You must accept the terms');
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('should display helper text when helperText prop is provided', () => {
    render(<Checkbox label="Subscribe" helperText="Receive updates via email" />);
    const helperText = screen.getByText('Receive updates via email');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-gray-500');
  });

  it('should not display helper text when both error and helperText are provided', () => {
    render(<Checkbox label="Subscribe" error="Required" helperText="Receive updates" />);
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Required');
    expect(screen.queryByText('Receive updates')).not.toBeInTheDocument();
  });

  it('should have proper aria attributes', () => {
    render(<Checkbox label="Accept" error="Required" />);
    const checkbox = screen.getByLabelText('Accept');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAttribute('aria-describedby');
  });

  it('should have aria-invalid=false when no error', () => {
    render(<Checkbox label="Accept" />);
    const checkbox = screen.getByLabelText('Accept');
    expect(checkbox).toHaveAttribute('aria-invalid', 'false');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Checkbox label="Disabled" disabled />);
    const checkbox = screen.getByLabelText('Disabled');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass('disabled:bg-gray-100');
  });

  it('should apply custom className', () => {
    render(<Checkbox label="Custom" className="custom-class" />);
    const checkbox = screen.getByLabelText('Custom');
    expect(checkbox).toHaveClass('custom-class');
  });

  it('should apply error styles when error is present', () => {
    render(<Checkbox label="Accept" error="Invalid" />);
    const checkbox = screen.getByLabelText('Accept');
    expect(checkbox).toHaveClass('border-red-300');
  });

  it('should use provided id for checkbox', () => {
    render(<Checkbox label="Accept" id="accept-checkbox" />);
    const checkbox = screen.getByLabelText('Accept');
    expect(checkbox).toHaveAttribute('id', 'accept-checkbox');
  });

  it('should generate unique id when not provided', () => {
    const { container } = render(<Checkbox label="Accept" />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    const label = container.querySelector('label');

    expect(checkbox?.id).toBeTruthy();
    expect(checkbox?.id).not.toBe('');
    expect(label?.htmlFor).toBe(checkbox?.id);
  });

  it('should forward ref correctly', () => {
    const ref = { current: null };
    render(<Checkbox label="Accept" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should pass through other HTML input attributes', () => {
    render(<Checkbox label="Accept" name="terms" value="yes" />);
    const checkbox = screen.getByLabelText('Accept');
    expect(checkbox).toHaveAttribute('name', 'terms');
    expect(checkbox).toHaveAttribute('value', 'yes');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  it('should have proper base styles', () => {
    render(<Checkbox label="Accept" />);
    const checkbox = screen.getByLabelText('Accept');
    expect(checkbox).toHaveClass('h-4');
    expect(checkbox).toHaveClass('w-4');
    expect(checkbox).toHaveClass('rounded');
    expect(checkbox).toHaveClass('border-gray-300');
    expect(checkbox).toHaveClass('text-blue-600');
    expect(checkbox).toHaveClass('focus:ring-2');
    expect(checkbox).toHaveClass('focus:ring-blue-500');
  });
});
