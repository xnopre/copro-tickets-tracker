import TicketList from '@/presentation/components/TicketList';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const ticketService = ServiceFactory.getTicketService();
  const tickets = await ticketService.getAllTickets();
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-600 mb-2">CoTiTra</h1>
          <p className="text-xl text-gray-600">Copro Tickets Tracker</p>
          <p className="text-sm text-gray-500 mt-1">Gestion de tickets pour copropriété</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Tickets</h2>
            <Link
              href="/tickets/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              + Créer un ticket
            </Link>
          </div>
          <TicketList tickets={tickets} />
        </div>
      </div>
    </main>
  );
}
