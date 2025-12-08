import Link from 'next/link';
import { Ticket } from '@/domain/entities/Ticket';
import { statusColors, statusLabels } from '@/presentation/constants/ticketDisplay';
import { formatTicketDate } from '@/presentation/utils/ticketFormatters';

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const formattedCreatedAt = formatTicketDate(ticket.createdAt);
  const formattedUpdatedAt = formatTicketDate(ticket.updatedAt);

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      aria-label={`Voir le ticket : ${ticket.title} - Statut : ${statusLabels[ticket.status]}`}
      className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
    >
      <article className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}
            aria-label={`Statut : ${statusLabels[ticket.status]}`}
          >
            {statusLabels[ticket.status]}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{ticket.description}</p>
        {ticket.assignedTo && (
          <div className="mb-3 text-sm text-gray-700">
            <span className="font-medium">Assigné à :</span> {ticket.assignedTo}
          </div>
        )}
        <div className="flex justify-between text-xs text-gray-500">
          <time dateTime={ticket.createdAt.toISOString()}>Créé le {formattedCreatedAt}</time>
          <time dateTime={ticket.updatedAt.toISOString()}>Modifié le {formattedUpdatedAt}</time>
        </div>
      </article>
    </Link>
  );
}
