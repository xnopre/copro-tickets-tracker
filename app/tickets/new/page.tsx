import CreateTicketForm from '@/components/CreateTicketForm';
import Link from 'next/link';

export default function NewTicketPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4">
            ← Retour à la liste
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Créer un nouveau ticket</h1>
        </div>

        <CreateTicketForm />
      </div>
    </main>
  );
}
