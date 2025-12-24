import { notFound } from 'next/navigation';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import TicketDetailsWithUpdate from '@/presentation/components/TicketDetailsWithUpdate';
import TicketComments from '@/presentation/components/TicketComments';
import Container from '@/presentation/components/ui/Container';

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
    <Container className="space-y-8">
      <TicketDetailsWithUpdate initialTicket={ticket} />
      <TicketComments ticketId={id} />
    </Container>
  );
}
