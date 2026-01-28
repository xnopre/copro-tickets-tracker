import { Ticket } from '@/domain/entities/Ticket';
import { statusLabels } from '@/presentation/constants/ticketDisplay';
import { formatTicketDateTime } from '@/presentation/utils/ticketFormatters';
import ArchiveTicketButton from './ArchiveTicketButton';
import Button from '@/presentation/components/ui/Button';
import Badge from '@/presentation/components/ui/Badge';
import { getStatusBadgeVariant } from '@/presentation/utils/statusBadgeVariant';
import Card from '@/presentation/components/ui/Card';
import Link from '@/presentation/components/ui/Link';

interface TicketDetailProps {
  ticket: Ticket;
  onEditClick?: () => void;
}

export default function TicketDetail({ ticket, onEditClick }: TicketDetailProps) {
  const formattedCreatedAt = formatTicketDateTime(ticket.createdAt);
  const formattedUpdatedAt = formatTicketDateTime(ticket.updatedAt);

  return (
    <Card padding="lg" shadow="lg">
      <nav className="mb-6" aria-label="Navigation de retour">
        <Link
          href="/"
          variant="text"
          className="inline-flex items-center text-sm font-medium"
          aria-label="Retour à la liste des tickets"
        >
          ← Retour à la liste
        </Link>
      </nav>

      <header className="mb-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{ticket.title}</h1>
            {ticket.archived && (
              <Badge
                variant="gray-dark"
                size="sm"
                rounded={false}
                className="mt-2 inline-block"
                aria-label="Ce ticket est archivé"
              >
                ARCHIVÉ
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!ticket.archived && onEditClick && (
              <Button
                onClick={onEditClick}
                aria-label="Modifier le titre et la description du ticket"
              >
                Modifier
              </Button>
            )}
            {!ticket.archived && <ArchiveTicketButton ticketId={ticket.id} />}
            <Badge
              variant={getStatusBadgeVariant(ticket.status)}
              size="sm"
              aria-label={`Statut du ticket : ${statusLabels[ticket.status]}`}
            >
              {statusLabels[ticket.status]}
            </Badge>
          </div>
        </div>
      </header>

      <section className="mb-6" aria-labelledby="description-heading">
        <h2 id="description-heading" className="mb-2 text-lg font-semibold text-gray-700">
          Description
        </h2>
        <p className="leading-relaxed whitespace-pre-wrap text-gray-600">{ticket.description}</p>
      </section>

      <footer className="border-t pt-4" aria-label="Informations supplémentaires">
        <div className="mb-4 text-sm">
          <span className="font-semibold text-gray-700">Créé par :</span>
          <p className="text-gray-600">
            {ticket.createdBy.firstName} {ticket.createdBy.lastName}
          </p>
        </div>
        {ticket.assignedTo && (
          <div className="mb-4 text-sm">
            <span className="font-semibold text-gray-700">Assigné à :</span>
            <p className="text-gray-600">
              {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-gray-700">Créé le :</span>
            <p className="text-gray-600">
              <time dateTime={ticket.createdAt.toISOString()}>{formattedCreatedAt}</time>
            </p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Modifié le :</span>
            <p className="text-gray-600">
              <time dateTime={ticket.updatedAt.toISOString()}>{formattedUpdatedAt}</time>
            </p>
          </div>
        </div>
      </footer>
    </Card>
  );
}
