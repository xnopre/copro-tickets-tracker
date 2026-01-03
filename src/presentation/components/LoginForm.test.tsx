import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';
import * as nextAuth from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe('LoginForm', () => {
  let mockRouter: any;
  let mockSearchParams: any;

  beforeEach(() => {
    mockRouter = {
      push: vi.fn(),
      refresh: vi.fn(),
    };

    mockSearchParams = {
      get: vi.fn(key => {
        if (key === 'callbackUrl') return '/tickets';
        return null;
      }),
    };

    vi.mocked(useRouter).mockReturnValue(mockRouter);
    vi.mocked(useSearchParams).mockReturnValue(mockSearchParams);
    vi.clearAllMocks();
  });

  it('should render email and password fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/adresse e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  });

  it('should render sign in button', () => {
    render(<LoginForm />);

    const button = screen.getByRole('button', { name: /se connecter/i });
    expect(button).toBeInTheDocument();
  });

  it('should validate email field is required', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    await user.click(submitButton);

    expect(screen.getByText('Veuillez saisir votre adresse e-mail')).toBeInTheDocument();
  });

  it('should validate password field is required', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/adresse e-mail/i);
    await user.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    await user.click(submitButton);

    expect(screen.getByText('Veuillez saisir votre mot de passe')).toBeInTheDocument();
  });

  it('should call signIn with credentials when form is submitted', async () => {
    const user = userEvent.setup();
    vi.mocked(nextAuth.signIn).mockResolvedValueOnce({
      ok: true,
      error: null,
    } as any);

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/adresse e-mail/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    await user.type(emailInput, 'jean@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(nextAuth.signIn).toHaveBeenCalledWith('credentials', {
        email: 'jean@example.com',
        password: 'password123',
        redirect: false,
      });
    });
  });

  it('should display error message when credentials are invalid', async () => {
    const user = userEvent.setup();
    vi.mocked(nextAuth.signIn).mockResolvedValueOnce({
      ok: false,
      error: 'Invalid credentials',
    } as any);

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/adresse e-mail/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    await user.type(emailInput, 'jean@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Adresse e-mail ou mot de passe invalide')).toBeInTheDocument();
    });
  });

  it('should redirect to callbackUrl on successful login', async () => {
    const user = userEvent.setup();
    vi.mocked(nextAuth.signIn).mockResolvedValueOnce({
      ok: true,
      error: null,
    } as any);

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/adresse e-mail/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    await user.type(emailInput, 'jean@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRouter.refresh).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/tickets');
    });
  });

  it('should redirect to home when no callbackUrl provided', async () => {
    const user = userEvent.setup();
    mockSearchParams.get = vi.fn(() => null);
    vi.mocked(useSearchParams).mockReturnValue(mockSearchParams);
    vi.mocked(nextAuth.signIn).mockResolvedValueOnce({
      ok: true,
      error: null,
    } as any);

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/adresse e-mail/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    await user.type(emailInput, 'jean@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRouter.refresh).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('should disable button while loading', async () => {
    const user = userEvent.setup();
    vi.mocked(nextAuth.signIn).mockImplementationOnce(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({ ok: true, error: null } as any);
          }, 100);
        })
    );

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/adresse e-mail/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    await user.type(emailInput, 'jean@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should have proper accessibility attributes', () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/adresse e-mail/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const form = screen.getByRole('form', { hidden: true });

    expect(form).toHaveAttribute('aria-label', 'Formulaire de connexion');
    expect(emailInput).toHaveAttribute('aria-required', 'true');
    expect(passwordInput).toHaveAttribute('aria-required', 'true');
  });

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup();
    vi.mocked(nextAuth.signIn).mockRejectedValueOnce(new Error('Network error'));

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/adresse e-mail/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    await user.type(emailInput, 'jean@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Une erreur inattendue est survenue. Veuillez réessayer.')
      ).toBeInTheDocument();
    });
  });
});
