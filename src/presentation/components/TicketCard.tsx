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

  const archivedLabel = ticket.archived ? ' - Archivé' : '';

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      aria-label={`Voir le ticket : ${ticket.title} - Statut : ${statusLabels[ticket.status]}${archivedLabel}`}
      className="rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
    >
      <article
        className={`cursor-pointer rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg ${
          ticket.archived ? 'border-2 border-gray-300 opacity-70' : ''
        }`}
      >
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
          <div className="flex gap-2">
            {ticket.archived && (
              <span
                className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700"
                aria-label="Ticket archivé"
              >
                Archivé
              </span>
            )}
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[ticket.status]}`}
              aria-label={`Statut : ${statusLabels[ticket.status]}`}
            >
              {statusLabels[ticket.status]}
            </span>
          </div>
        </div>
        <p className="mb-4 text-sm text-gray-600">{ticket.description}</p>
        {ticket.assignedTo && (
          <div className="mb-3 text-sm text-gray-700">
            <span className="font-medium">Assigné à :</span> {ticket.assignedTo.firstName}{' '}
            {ticket.assignedTo.lastName}
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
