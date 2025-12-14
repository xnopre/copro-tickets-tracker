import { TicketStatus } from '../value-objects/TicketStatus';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTicketData {
  title: string;
  description: string;
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  status?: TicketStatus;
  assignedTo?: string | null;
}
