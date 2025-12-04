import { notFound } from 'next/navigation';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import TicketDetail from '@/presentation/components/TicketDetail';

export const dynamic = 'force-dynamic';

interface TicketPageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { id } = await params;
  const ticketService = ServiceFactory.getTicketService();
  const ticket = await ticketService.getTicketById(id);

  if (!ticket) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <TicketDetail ticket={ticket} />
      </div>
    </main>
  );
}
