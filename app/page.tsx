import TicketList from '@/components/TicketList';
import connectDB from '@/lib/mongodb';
import { TicketModel } from '@/lib/models/Ticket';
import { Ticket, TicketDocument, TicketStatus } from '@/types/ticket';

export const dynamic = 'force-dynamic';

export async function getTickets(): Promise<Ticket[]> {
  console.log('[SERVER] 🔄 Fetching tickets from MongoDB...');
  await connectDB();

  const tickets = (await TicketModel.find({}).sort({ createdAt: -1 }).lean()) as TicketDocument[];
  console.log(`[SERVER] ✅ Found ${tickets.length} tickets`);

  return tickets.map(ticket => ({
    id: ticket._id.toString(),
    title: ticket.title,
    description: ticket.description,
    status: ticket.status as TicketStatus,
    createdAt: new Date(ticket.createdAt),
    updatedAt: new Date(ticket.updatedAt),
  }));
}

export default async function Home() {
  const tickets = await getTickets();
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-600 mb-2">CoTiTra</h1>
          <p className="text-xl text-gray-600">Copro Tickets Tracker</p>
          <p className="text-sm text-gray-500 mt-1">Gestion de tickets pour copropriété</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tickets</h2>
          <TicketList tickets={tickets} />
        </div>
      </div>
    </main>
  );
}
