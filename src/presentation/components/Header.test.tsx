import { render, screen } from '@testing-library/react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from './Header';
import { mockUser1, mockUser2 } from '@tests/helpers/mockUsers';

vi.mock('next-auth/react');
vi.mock('./LogoutButton', () => ({
  LogoutButton: () => <div data-testid="logout-button">Logout Button</div>,
}));

const mockUseSession = vi.mocked(useSession);

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing when not authenticated', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    const { container } = render(<Header />);
    expect(container.firstChild).toBeNull();
  });

  it('should render header with user info when authenticated', () => {
    const session: Session = {
      user: {
        ...mockUser1,
        name: `${mockUser1.firstName} ${mockUser1.lastName}`,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    mockUseSession.mockReturnValue({
      data: session,
      status: 'authenticated',
      update: vi.fn(),
    });

    render(<Header />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('CoTiTra');
    expect(screen.getByText(/Connecté en tant que/)).toBeInTheDocument();
    expect(screen.getByText(`${mockUser1.firstName} ${mockUser1.lastName}`)).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });

  it('should display first and last name in the header', () => {
    const session: Session = {
      user: {
        ...mockUser2,
        name: `${mockUser2.firstName} ${mockUser2.lastName}`,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    mockUseSession.mockReturnValue({
      data: session,
      status: 'authenticated',
      update: vi.fn(),
    });

    render(<Header />);

    expect(screen.getByText(`${mockUser2.firstName} ${mockUser2.lastName}`)).toBeInTheDocument();
  });

  it('should have proper semantic structure', () => {
    const session: Session = {
      user: {
        id: 'user-789',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        name: 'Test User',
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    mockUseSession.mockReturnValue({
      data: session,
      status: 'authenticated',
      update: vi.fn(),
    });

    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('bg-white', 'shadow-sm', 'border-b');
    expect(header).toHaveAttribute('aria-label', 'En-tête de navigation');
  });

  it('should call LogoutButton component', () => {
    const session: Session = {
      user: {
        ...mockUser1,
        name: `${mockUser1.firstName} ${mockUser1.lastName}`,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    mockUseSession.mockReturnValue({
      data: session,
      status: 'authenticated',
      update: vi.fn(),
    });

    render(<Header />);

    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });
});
