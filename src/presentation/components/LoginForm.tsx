'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/presentation/components/ui/Button';
import Input from '@/presentation/components/ui/Input';
import Alert from '@/presentation/components/ui/Alert';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Client-side validation
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse e-mail');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError('Veuillez saisir votre mot de passe');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Adresse e-mail ou mot de passe invalide');
      } else if (result?.ok) {
        router.refresh();
        // TODO : voir pour supprimer ce any (pb lié à "typedRoutes: true")
        router.push((callbackUrl || '/') as any);
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue. Veuillez réessayer.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Formulaire de connexion">
      <div className="mb-4">
        <Input
          id="email"
          type="email"
          label="Adresse e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={isLoading}
          placeholder="votre.email@example.com"
          autoComplete="email"
        />
      </div>

      <div className="mb-4">
        <Input
          id="password"
          type="password"
          label="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={isLoading}
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <Button type="submit" disabled={isLoading} aria-busy={isLoading} className="w-full">
        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
      </Button>
    </form>
  );
}
