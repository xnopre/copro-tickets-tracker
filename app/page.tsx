import TicketListWithArchiveToggle from '@/presentation/components/TicketListWithArchiveToggle';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import Link from '@/presentation/components/ui/Link';
import Container from '@/presentation/components/ui/Container';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  const ticketService = ServiceFactory.getTicketService();
  const tickets = await ticketService.getAllTickets();
  return (
    <Container size="lg">
      <header className="mb-12 text-center">
        <h1 className="mb-2 text-5xl font-bold text-blue-600">CoTiTra</h1>
        <p className="text-xl text-gray-600">Copro Tickets Tracker</p>
        <p className="mt-1 text-sm text-gray-500">Gestion de tickets pour copropriété</p>
      </header>

      <section className="mb-6" aria-labelledby="tickets-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="tickets-heading" className="text-2xl font-semibold text-gray-800">
            Tickets
          </h2>
          <Link href="/tickets/new" variant="button" aria-label="Créer un nouveau ticket">
            + Créer un ticket
          </Link>
        </div>
        <TicketListWithArchiveToggle tickets={tickets} />
      </section>
    </Container>
  );
}
