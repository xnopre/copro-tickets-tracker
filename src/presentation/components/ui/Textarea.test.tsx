import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Textarea from './Textarea';

describe('Textarea', () => {
  it('should render a textarea without label', () => {
    render(<Textarea placeholder="Enter text" />);
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toBeInTheDocument();
  });

  it('should render with a label', () => {
    render(<Textarea label="Description" />);
    const label = screen.getByText('Description');
    const textarea = screen.getByLabelText('Description');
    expect(label).toBeInTheDocument();
    expect(textarea).toBeInTheDocument();
  });

  it('should show required indicator when required prop is true', () => {
    render(<Textarea label="Description" required />);
    const requiredIndicator = screen.getByLabelText('requis');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveTextContent('*');
  });

  it('should display error message when error prop is provided', () => {
    render(<Textarea label="Description" error="Description is required" />);
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Description is required');
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('should display helper text when helperText prop is provided', () => {
    render(<Textarea label="Description" helperText="Enter a detailed description" />);
    const helperText = screen.getByText('Enter a detailed description');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-gray-500');
  });

  it('should not display helper text when both error and helperText are provided', () => {
    render(
      <Textarea
        label="Description"
        error="Invalid description"
        helperText="Enter a detailed description"
      />
    );
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Invalid description');
    expect(screen.queryByText('Enter a detailed description')).not.toBeInTheDocument();
  });

  it('should have proper aria attributes', () => {
    render(<Textarea label="Description" required error="Invalid description" />);
    const textarea = screen.getByLabelText(/Description/);
    expect(textarea).toHaveAttribute('aria-required', 'true');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby');
  });

  it('should have aria-invalid=false when no error', () => {
    render(<Textarea label="Description" />);
    const textarea = screen.getByLabelText('Description');
    expect(textarea).toHaveAttribute('aria-invalid', 'false');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Textarea label="Disabled Textarea" disabled />);
    const textarea = screen.getByLabelText('Disabled Textarea');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('disabled:bg-gray-100');
  });

  it('should apply custom className', () => {
    render(<Textarea label="Custom" className="custom-class" />);
    const textarea = screen.getByLabelText('Custom');
    expect(textarea).toHaveClass('custom-class');
  });

  it('should apply error styles when error is present', () => {
    render(<Textarea label="Description" error="Invalid" />);
    const textarea = screen.getByLabelText('Description');
    expect(textarea).toHaveClass('border-red-300');
    expect(textarea).toHaveClass('focus:ring-red-500');
  });

  it('should apply default styles when no error', () => {
    render(<Textarea label="Description" />);
    const textarea = screen.getByLabelText('Description');
    expect(textarea).toHaveClass('border-gray-300');
    expect(textarea).toHaveClass('focus:ring-blue-500');
  });

  it('should use provided id for textarea', () => {
    render(<Textarea label="Description" id="description-textarea" />);
    const textarea = screen.getByLabelText('Description');
    expect(textarea).toHaveAttribute('id', 'description-textarea');
  });

  it('should generate unique id when not provided', () => {
    const { container } = render(<Textarea label="Description" />);
    const textarea = container.querySelector('textarea');
    expect(textarea?.id).toMatch(/^textarea-/);
  });

  it('should forward ref correctly', () => {
    const ref = { current: null };
    render(<Textarea label="Description" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('should pass through other HTML textarea attributes', () => {
    render(
      <Textarea label="Description" placeholder="Enter description" name="description" rows={5} />
    );
    const textarea = screen.getByLabelText('Description');
    expect(textarea).toHaveAttribute('placeholder', 'Enter description');
    expect(textarea).toHaveAttribute('name', 'description');
    expect(textarea).toHaveAttribute('rows', '5');
  });
});
