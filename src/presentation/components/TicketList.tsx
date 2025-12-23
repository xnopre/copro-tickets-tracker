import { Ticket } from '@/domain/entities/Ticket';
import TicketCard from './TicketCard';

interface TicketListProps {
  tickets: Ticket[];
}

export default function TicketList({ tickets }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="py-12 text-center" role="status" aria-live="polite">
        <p className="text-lg text-gray-500">Aucun ticket à afficher</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      role="list"
      aria-label={`Liste de ${tickets.length} ticket${tickets.length > 1 ? 's' : ''}`}
    >
      {tickets.map(ticket => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
