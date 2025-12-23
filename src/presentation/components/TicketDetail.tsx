import Link from 'next/link';
import { Ticket } from '@/domain/entities/Ticket';
import { statusColors, statusLabels } from '@/presentation/constants/ticketDisplay';
import { formatTicketDateTime } from '@/presentation/utils/ticketFormatters';
import ArchiveTicketButton from './ArchiveTicketButton';

interface TicketDetailProps {
  ticket: Ticket;
  onEditClick?: () => void;
}

export default function TicketDetail({ ticket, onEditClick }: TicketDetailProps) {
  const formattedCreatedAt = formatTicketDateTime(ticket.createdAt);
  const formattedUpdatedAt = formatTicketDateTime(ticket.updatedAt);

  return (
    <article className="rounded-lg bg-white p-8 shadow-lg">
      <nav className="mb-6" aria-label="Navigation de retour">
        <Link
          href="/"
          className="inline-flex items-center rounded text-sm font-medium text-blue-600 hover:text-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
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
              <span
                className="mt-2 inline-block rounded bg-gray-600 px-3 py-1 text-sm font-medium text-white"
                aria-label="Ce ticket est archivé"
              >
                ARCHIVÉ
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!ticket.archived && onEditClick && (
              <button
                onClick={onEditClick}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                aria-label="Modifier le titre et la description du ticket"
              >
                Modifier
              </button>
            )}
            {!ticket.archived && <ArchiveTicketButton ticketId={ticket.id} />}
            <span
              className={`rounded-full px-4 py-2 text-sm font-medium ${statusColors[ticket.status]}`}
              aria-label={`Statut du ticket : ${statusLabels[ticket.status]}`}
            >
              {statusLabels[ticket.status]}
            </span>
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
    </article>
  );
}
