import { Ticket, TicketStatus } from '@/types/ticket';

interface TicketCardProps {
  ticket: Ticket;
}

const statusColors = {
  [TicketStatus.NEW]: 'bg-blue-100 text-blue-800',
  [TicketStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
  [TicketStatus.RESOLVED]: 'bg-green-100 text-green-800',
  [TicketStatus.CLOSED]: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  [TicketStatus.NEW]: 'Nouveau',
  [TicketStatus.IN_PROGRESS]: 'En cours',
  [TicketStatus.RESOLVED]: 'Résolu',
  [TicketStatus.CLOSED]: 'Fermé',
};

export default function TicketCard({ ticket }: TicketCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
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
        <span>Créé le {formatDate(ticket.createdAt)}</span>
        <span>Modifié le {formatDate(ticket.updatedAt)}</span>
      </div>
    </div>
  );
}
