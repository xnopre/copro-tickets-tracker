'use client';

import { useState } from 'react';
import { Ticket } from '@/domain/entities/Ticket';
import TicketDetail from './TicketDetail';
import EditTicketForm from './EditTicketForm';

type ViewMode = 'view' | 'edit';

interface TicketDetailsWithUpdateProps {
  initialTicket: Ticket;
}

export default function TicketDetailsWithUpdate({ initialTicket }: TicketDetailsWithUpdateProps) {
  const [ticket, setTicket] = useState<Ticket>(initialTicket);
  const [mode, setMode] = useState<ViewMode>('view');

  const handleEditClick = () => {
    setMode('edit');
  };

  const handleCancelEdit = () => {
    setMode('view');
  };

  const handleTicketContentUpdated = (updatedTicket: Ticket) => {
    setTicket(updatedTicket);
    setMode('view');
  };

  return (
    <>
      {mode === 'view' ? (
        <TicketDetail ticket={ticket} onEditClick={handleEditClick} />
      ) : (
        <EditTicketForm
          ticketId={ticket.id}
          currentTitle={ticket.title}
          currentDescription={ticket.description}
          currentStatus={ticket.status}
          currentAssignedTo={ticket.assignedTo}
          onTicketUpdated={handleTicketContentUpdated}
          onCancel={handleCancelEdit}
        />
      )}
    </>
  );
}
