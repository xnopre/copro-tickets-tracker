import { Schema, model, models, Document } from 'mongoose';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';

export interface TicketDocument extends Document {
  title: string;
  description: string;
  status: TicketStatus;
  assignedTo: string | null;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<TicketDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.NEW,
      required: true,
    },
    assignedTo: {
      type: String,
      default: null,
    },
    archived: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TicketModel = models.Ticket || model<TicketDocument>('Ticket', ticketSchema);
