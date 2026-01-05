import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signOut } from 'next-auth/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LogoutButton } from './LogoutButton';

vi.mock('next-auth/react');

const mockSignOut = vi.mocked(signOut);

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignOut.mockResolvedValue({ url: '/' });
  });

  it('should render logout button', () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button', { name: /Déconnexion/i });
    expect(button).toBeInTheDocument();
  });

  it('should display initial text', () => {
    render(<LogoutButton />);

    expect(screen.getByText('Déconnexion')).toBeInTheDocument();
  });

  it('should call signOut when button is clicked', async () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it('should show loading text while logging out', async () => {
    mockSignOut.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Déconnexion en cours...')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText('Déconnexion en cours...')).not.toBeInTheDocument();
      },
      { timeout: 200 }
    );
  });

  it('should disable button while logging out', async () => {
    mockSignOut.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('should have aria-busy attribute while loading', async () => {
    mockSignOut.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-busy', 'true');

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-busy', 'false');
    });
  });

  it('should be a button element with proper attributes', () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('should handle signOut errors gracefully', async () => {
    mockSignOut.mockImplementation(
      () => new Promise((_, reject) => setTimeout(() => reject(new Error('Logout failed')), 50))
    );

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('should display error message when signOut throws', async () => {
    mockSignOut.mockImplementation(
      () => new Promise((_, reject) => setTimeout(() => reject(new Error('Network error')), 50))
    );

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should display default error message when error is not an Error instance', async () => {
    mockSignOut.mockImplementation(
      () => new Promise((_, reject) => setTimeout(() => reject('Unknown error'), 50))
    );

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Erreur lors de la déconnexion')).toBeInTheDocument();
    });
  });

  it('should clear error message when retrying logout', async () => {
    mockSignOut.mockImplementation(
      () => new Promise((_, reject) => setTimeout(() => reject(new Error('First error')), 50))
    );

    const { rerender } = render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('First error')).toBeInTheDocument();
    });

    mockSignOut.mockResolvedValue({ url: '/' });
    rerender(<LogoutButton />);

    const newButton = screen.getByRole('button');
    fireEvent.click(newButton);

    // Error should be cleared when starting a new logout attempt
    expect(screen.queryByText('First error')).not.toBeInTheDocument();
  });

  it('should have proper accessibility attributes on error alert', async () => {
    mockSignOut.mockImplementation(
      () => new Promise((_, reject) => setTimeout(() => reject(new Error('Access denied')), 50))
    );

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });
  });
});
