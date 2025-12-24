import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Container from './Container';

describe('Container', () => {
  it('should render children correctly', () => {
    render(
      <Container>
        <p>Test content</p>
      </Container>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should apply default medium size (max-w-4xl)', () => {
    const { container } = render(
      <Container>
        <p>Test</p>
      </Container>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('max-w-4xl');
    expect(wrapper).toHaveClass('mx-auto');
  });

  it('should apply small size when specified', () => {
    const { container } = render(
      <Container size="sm">
        <p>Test</p>
      </Container>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('max-w-3xl');
    expect(wrapper).toHaveClass('mx-auto');
  });

  it('should apply large size when specified', () => {
    const { container } = render(
      <Container size="lg">
        <p>Test</p>
      </Container>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('max-w-7xl');
    expect(wrapper).toHaveClass('mx-auto');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Container className="custom-class">
        <p>Test</p>
      </Container>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('mx-auto');
    expect(wrapper).toHaveClass('max-w-4xl');
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should render as a div element', () => {
    const { container } = render(
      <Container>
        <p>Test</p>
      </Container>
    );

    expect(container.firstChild?.nodeName).toBe('DIV');
  });
});
