import { Ticket } from '@/domain/entities/Ticket';
import { statusLabels } from '@/presentation/constants/ticketDisplay';
import { formatTicketDate } from '@/presentation/utils/ticketFormatters';
import Badge from '@/presentation/components/ui/Badge';
import { getStatusBadgeVariant } from '@/presentation/utils/statusBadgeVariant';
import Card from '@/presentation/components/ui/Card';
import Link from '@/presentation/components/ui/Link';

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
      variant="unstyled"
      aria-label={`Voir le ticket : ${ticket.title} - Statut : ${statusLabels[ticket.status]}${archivedLabel}`}
      className="rounded-lg"
    >
      <Card
        clickable
        shadow="md"
        padding="md"
        className={ticket.archived ? 'border-2 border-gray-300 opacity-70' : ''}
        data-testid="ticket-card"
      >
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
          <div className="flex gap-2">
            {ticket.archived && (
              <Badge variant="gray-light" aria-label="Ticket archivé">
                Archivé
              </Badge>
            )}
            <Badge
              variant={getStatusBadgeVariant(ticket.status)}
              aria-label={`Statut : ${statusLabels[ticket.status]}`}
            >
              {statusLabels[ticket.status]}
            </Badge>
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
      </Card>
    </Link>
  );
}
