import { Types } from 'mongoose';

export enum TicketStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

interface TicketBase {
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketDocument extends TicketBase {
  _id: Types.ObjectId;
}

export interface Ticket extends TicketBase {
  id: string;
}
