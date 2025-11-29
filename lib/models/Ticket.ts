import mongoose, { Schema, model, models } from 'mongoose';
import { TicketStatus } from '@/types/ticket';

const ticketSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

export const TicketModel = models.Ticket || model('Ticket', ticketSchema);
