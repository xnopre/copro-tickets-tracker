import CreateTicketForm from '@/presentation/components/CreateTicketForm';
import Link from 'next/link';

export default function NewTicketPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <nav className="mb-6" aria-label="Navigation de retour">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded inline-block"
            aria-label="Retour à la liste des tickets"
          >
            ← Retour à la liste
          </Link>
        </nav>

        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Créer un nouveau ticket</h1>
        </header>

        <section aria-label="Formulaire de création">
          <CreateTicketForm />
        </section>
      </div>
    </main>
  );
}
