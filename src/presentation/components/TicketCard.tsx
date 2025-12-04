import Link from 'next/link';
import { Ticket } from '@/domain/entities/Ticket';
import { statusColors, statusLabels } from '@/presentation/constants/ticketDisplay';
import { formatTicketDate } from '@/presentation/utils/ticketFormatters';

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Link href={`/tickets/${ticket.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}
          >
            {statusLabels[ticket.status]}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{ticket.description}</p>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Créé le {formatTicketDate(ticket.createdAt)}</span>
          <span>Modifié le {formatTicketDate(ticket.updatedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
