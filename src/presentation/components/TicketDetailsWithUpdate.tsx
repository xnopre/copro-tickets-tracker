'use client';

import { useState } from 'react';
import { Ticket } from '@/domain/entities/Ticket';
import TicketDetail from './TicketDetail';
import UpdateTicketStatusForm from './UpdateTicketStatusForm';

interface TicketDetailsWithUpdateProps {
  initialTicket: Ticket;
}

export default function TicketDetailsWithUpdate({ initialTicket }: TicketDetailsWithUpdateProps) {
  const [ticket, setTicket] = useState<Ticket>(initialTicket);

  const handleTicketUpdated = (updatedTicket: Ticket) => {
    setTicket(updatedTicket);
  };

  return (
    <>
      <TicketDetail ticket={ticket} />
      <UpdateTicketStatusForm
        ticketId={ticket.id}
        currentStatus={ticket.status}
        currentAssignedTo={ticket.assignedTo}
        onTicketUpdated={handleTicketUpdated}
      />
    </>
  );
}
