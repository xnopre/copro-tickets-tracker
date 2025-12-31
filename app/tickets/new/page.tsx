import CreateTicketForm from '@/presentation/components/CreateTicketForm';
import Link from '@/presentation/components/ui/Link';
import Container from '@/presentation/components/ui/Container';

export default function NewTicketPage() {
  return (
    <Container size="sm">
      <nav className="mb-6" aria-label="Navigation de retour">
        <Link
          href="/"
          variant="text"
          className="mb-4 flex items-center gap-2"
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
    </Container>
  );
}
