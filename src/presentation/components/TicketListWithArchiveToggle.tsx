'use client';

import { Ticket } from '@/domain/entities/Ticket';
import { useState } from 'react';
import TicketList from './TicketList';

interface TicketListWithArchiveToggleProps {
  tickets: Ticket[];
}

export default function TicketListWithArchiveToggle({ tickets }: TicketListWithArchiveToggleProps) {
  const [showArchived, setShowArchived] = useState(false);

  const filteredTickets = showArchived ? tickets : tickets.filter(ticket => !ticket.archived);

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (a.archived === b.archived) return 0;
    return a.archived ? 1 : -1;
  });

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <label
          htmlFor="show-archived"
          className="flex cursor-pointer items-center gap-2 text-gray-700"
        >
          <input
            type="checkbox"
            id="show-archived"
            checked={showArchived}
            onChange={e => setShowArchived(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
            aria-label="Afficher les tickets archivés"
          />
          <span>Voir les archives</span>
        </label>
      </div>
      <TicketList tickets={sortedTickets} />
    </div>
  );
}
