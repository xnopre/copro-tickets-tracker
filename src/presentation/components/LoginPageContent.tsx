'use client';

import { LoginForm } from './LoginForm';
import Card from '@/presentation/components/ui/Card';

export function LoginPageContent() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">CoTiTra</h1>
          <p className="mt-2 text-sm text-gray-600">Connectez-vous à votre compte pour continuer</p>
        </div>

        <Card padding="lg" shadow="md">
          <LoginForm />
        </Card>

        <div className="text-center text-sm text-gray-600">
          <p className="font-medium">Identifiants de démonstration :</p>
          <ul className="mt-2 space-y-1">
            <li>E-mail : jean.martin@example.com</li>
            <li>Mot de passe : K7$mP2nQr9@vL8</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
