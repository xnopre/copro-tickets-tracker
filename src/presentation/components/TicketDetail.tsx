import Link from 'next/link';
import { Ticket } from '@/domain/entities/Ticket';
import { statusColors, statusLabels } from '@/presentation/constants/ticketDisplay';
import { formatTicketDateTime } from '@/presentation/utils/ticketFormatters';

interface TicketDetailProps {
  ticket: Ticket;
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  const formattedCreatedAt = formatTicketDateTime(ticket.createdAt);
  const formattedUpdatedAt = formatTicketDateTime(ticket.updatedAt);

  return (
    <article className="bg-white rounded-lg shadow-lg p-8">
      <nav className="mb-6" aria-label="Navigation de retour">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          aria-label="Retour à la liste des tickets"
        >
          ← Retour à la liste
        </Link>
      </nav>

      <header className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{ticket.title}</h1>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[ticket.status]}`}
            aria-label={`Statut du ticket : ${statusLabels[ticket.status]}`}
          >
            {statusLabels[ticket.status]}
          </span>
        </div>
      </header>

      <section className="mb-6" aria-labelledby="description-heading">
        <h2 id="description-heading" className="text-lg font-semibold text-gray-700 mb-2">
          Description
        </h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
      </section>

      <footer className="border-t pt-4" aria-label="Informations supplémentaires">
        {ticket.assignedTo && (
          <div className="mb-4 text-sm">
            <span className="font-semibold text-gray-700">Assigné à :</span>
            <p className="text-gray-600">{ticket.assignedTo}</p>
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
