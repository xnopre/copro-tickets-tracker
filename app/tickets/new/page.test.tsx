import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewTicketPage from './page';
import { mockUser1 } from '@tests/helpers/mockUsers';

// Mock next/navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Mock next-auth/react
const mockSession = {
  user: mockUser1,
};

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: mockSession,
  })),
}));

describe('NewTicketPage', () => {
  it('should render the page title', () => {
    render(<NewTicketPage />);

    expect(screen.getByText('Créer un nouveau ticket')).toBeInTheDocument();
  });

  it('should render back link to home page', () => {
    render(<NewTicketPage />);

    const backLink = screen.getByText('← Retour à la liste');
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
    expect(backLink).toHaveAttribute('aria-label', 'Retour à la liste des tickets');
  });

  it('should render the CreateTicketForm component', () => {
    render(<NewTicketPage />);

    // Check that form fields from CreateTicketForm are present
    expect(screen.getByLabelText(/Titre/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Créer le ticket' })).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    const { container } = render(<NewTicketPage />);

    // Check navigation has aria-label
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'Navigation de retour');

    // Check section has aria-label
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('aria-label', 'Formulaire de création');
  });

  it('should have proper semantic HTML structure', () => {
    const { container } = render(<NewTicketPage />);

    // Check semantic elements
    expect(container.querySelector('nav')).toBeInTheDocument();
    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('section')).toBeInTheDocument();
    expect(container.querySelector('h1')).toBeInTheDocument();
  });
});
