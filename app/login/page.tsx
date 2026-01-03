import { Suspense } from 'react';
import { LoginPageContent } from '@/presentation/components/LoginPageContent';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
