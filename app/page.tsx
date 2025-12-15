import TicketListWithArchiveToggle from '@/presentation/components/TicketListWithArchiveToggle';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const ticketService = ServiceFactory.getTicketService();
  const tickets = await ticketService.getAllTickets();
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-600 mb-2">CoTiTra</h1>
          <p className="text-xl text-gray-600">Copro Tickets Tracker</p>
          <p className="text-sm text-gray-500 mt-1">Gestion de tickets pour copropriété</p>
        </header>

        <section className="mb-6" aria-labelledby="tickets-heading">
          <div className="flex justify-between items-center mb-4">
            <h2 id="tickets-heading" className="text-2xl font-semibold text-gray-800">
              Tickets
            </h2>
            <Link
              href="/tickets/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Créer un nouveau ticket"
            >
              + Créer un ticket
            </Link>
          </div>
          <TicketListWithArchiveToggle tickets={tickets} />
        </section>
      </div>
    </main>
  );
}
