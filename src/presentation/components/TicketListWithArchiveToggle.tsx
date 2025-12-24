'use client';

import { Ticket } from '@/domain/entities/Ticket';
import { useState } from 'react';
import TicketList from './TicketList';
import Checkbox from '@/presentation/components/ui/Checkbox';

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
        <Checkbox
          id="show-archived"
          checked={showArchived}
          onChange={e => setShowArchived(e.target.checked)}
          label="Voir les archives"
          aria-label="Afficher les tickets archivés"
        />
      </div>
      <TicketList tickets={sortedTickets} />
    </div>
  );
}
