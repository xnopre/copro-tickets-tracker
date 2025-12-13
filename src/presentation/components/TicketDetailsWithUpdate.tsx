'use client';

import { useState } from 'react';
import { Ticket } from '@/domain/entities/Ticket';
import TicketDetail from './TicketDetail';
import UpdateTicketStatusForm from './UpdateTicketStatusForm';
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

  const handleTicketUpdated = (updatedTicket: Ticket) => {
    setTicket(updatedTicket);
  };

  const handleTicketContentUpdated = (updatedTicket: Ticket) => {
    setTicket(updatedTicket);
    setMode('view');
  };

  return (
    <>
      {mode === 'view' ? (
        <>
          <TicketDetail ticket={ticket} onEditClick={handleEditClick} />
          <UpdateTicketStatusForm
            ticketId={ticket.id}
            currentStatus={ticket.status}
            currentAssignedTo={ticket.assignedTo}
            onTicketUpdated={handleTicketUpdated}
          />
        </>
      ) : (
        <EditTicketForm
          ticketId={ticket.id}
          currentTitle={ticket.title}
          currentDescription={ticket.description}
          onTicketUpdated={handleTicketContentUpdated}
          onCancel={handleCancelEdit}
        />
      )}
    </>
  );
}
