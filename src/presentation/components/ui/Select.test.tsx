import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Select from './Select';

describe('Select', () => {
  it('should render a select without label', () => {
    render(
      <Select>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('should render with a label', () => {
    render(
      <Select label="Status">
        <option value="1">Option 1</option>
      </Select>
    );
    const label = screen.getByText('Status');
    const select = screen.getByLabelText('Status');
    expect(label).toBeInTheDocument();
    expect(select).toBeInTheDocument();
  });

  it('should show required indicator when required prop is true', () => {
    render(
      <Select label="Status" required>
        <option value="1">Option 1</option>
      </Select>
    );
    const requiredIndicator = screen.getByLabelText('requis');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveTextContent('*');
  });

  it('should display error message when error prop is provided', () => {
    render(
      <Select label="Status" error="Status is required">
        <option value="1">Option 1</option>
      </Select>
    );
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Status is required');
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('should display helper text when helperText prop is provided', () => {
    render(
      <Select label="Status" helperText="Choose a status">
        <option value="1">Option 1</option>
      </Select>
    );
    const helperText = screen.getByText('Choose a status');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-gray-500');
  });

  it('should not display helper text when both error and helperText are provided', () => {
    render(
      <Select label="Status" error="Invalid status" helperText="Choose a status">
        <option value="1">Option 1</option>
      </Select>
    );
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Invalid status');
    expect(screen.queryByText('Choose a status')).not.toBeInTheDocument();
  });

  it('should have proper aria attributes', () => {
    render(
      <Select label="Status" required error="Invalid status">
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByLabelText(/Status/);
    expect(select).toHaveAttribute('aria-required', 'true');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAttribute('aria-describedby');
  });

  it('should have aria-invalid=false when no error', () => {
    render(
      <Select label="Status">
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByLabelText('Status');
    expect(select).toHaveAttribute('aria-invalid', 'false');
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <Select label="Disabled Select" disabled>
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByLabelText('Disabled Select');
    expect(select).toBeDisabled();
    expect(select).toHaveClass('disabled:bg-gray-100');
  });

  it('should apply custom className', () => {
    render(
      <Select label="Custom" className="custom-class">
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByLabelText('Custom');
    expect(select).toHaveClass('custom-class');
  });

  it('should apply error styles when error is present', () => {
    render(
      <Select label="Status" error="Invalid">
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByLabelText('Status');
    expect(select).toHaveClass('border-red-300');
    expect(select).toHaveClass('focus:ring-red-500');
  });

  it('should apply default styles when no error', () => {
    render(
      <Select label="Status">
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByLabelText('Status');
    expect(select).toHaveClass('border-gray-300');
    expect(select).toHaveClass('focus:ring-blue-500');
  });

  it('should use provided id for select', () => {
    render(
      <Select label="Status" id="status-select">
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByLabelText('Status');
    expect(select).toHaveAttribute('id', 'status-select');
  });

  it('should generate unique id when not provided', () => {
    const { container } = render(
      <Select label="Status">
        <option value="1">Option 1</option>
      </Select>
    );
    const select = container.querySelector('select');
    expect(select?.id).toMatch(/^select-/);
  });

  it('should forward ref correctly', () => {
    const ref = { current: null };
    render(
      <Select label="Status" ref={ref}>
        <option value="1">Option 1</option>
      </Select>
    );
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('should pass through other HTML select attributes', () => {
    render(
      <Select label="Status" name="status">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const select = screen.getByLabelText('Status');
    expect(select).toHaveAttribute('name', 'status');
  });

  it('should render all options correctly', () => {
    render(
      <Select label="Status">
        <option value="new">New</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
      </Select>
    );
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('New');
    expect(options[1]).toHaveTextContent('In Progress');
    expect(options[2]).toHaveTextContent('Resolved');
  });
});
