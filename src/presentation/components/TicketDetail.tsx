import Link from 'next/link';
import { Ticket } from '@/domain/entities/Ticket';
import { statusColors, statusLabels } from '@/presentation/constants/ticketDisplay';
import { formatTicketDateTime } from '@/presentation/utils/ticketFormatters';

interface TicketDetailProps {
  ticket: Ticket;
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Retour à la liste
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{ticket.title}</h1>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[ticket.status]}`}
          >
            {statusLabels[ticket.status]}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Créé le :</span>
              <p className="text-gray-600">{formatTicketDateTime(ticket.createdAt)}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Modifié le :</span>
              <p className="text-gray-600">{formatTicketDateTime(ticket.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
