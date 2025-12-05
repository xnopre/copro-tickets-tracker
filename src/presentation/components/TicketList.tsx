import { Ticket } from '@/domain/entities/Ticket';
import TicketCard from './TicketCard';

interface TicketListProps {
  tickets: Ticket[];
}

export default function TicketList({ tickets }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <p className="text-gray-500 text-lg">Aucun ticket à afficher</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="list"
      aria-label={`Liste de ${tickets.length} ticket${tickets.length > 1 ? 's' : ''}`}
    >
      {tickets.map(ticket => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
