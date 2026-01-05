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
      expect(mockSignOut).toHaveBeenCalledWith({ redirectTo: '/' });
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
});
