import { TicketStatus } from '../value-objects/TicketStatus';
import { UserPublic } from './User';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdBy: UserPublic;
  assignedTo: UserPublic | null;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTicketData {
  title: string;
  description: string;
  createdBy: string;
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  status?: TicketStatus;
  assignedTo?: string | null;
}
