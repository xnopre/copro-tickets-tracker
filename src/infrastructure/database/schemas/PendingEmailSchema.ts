import { Schema, model, models, Document } from 'mongoose';
import { EmailRecipient } from '@/domain/services/IEmailService';

export type PendingEmailStatus = 'pending' | 'processing' | 'sent' | 'failed';

export interface PendingEmailDocument extends Document {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent: string;
  status: PendingEmailStatus;
  attempts: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const pendingEmailSchema = new Schema<PendingEmailDocument>(
  {
    to: [
      {
        email: { type: String, required: true },
        name: { type: String, required: true },
      },
    ],
    subject: { type: String, required: true },
    htmlContent: { type: String, required: true },
    textContent: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'sent', 'failed'],
      default: 'pending',
      required: true,
    },
    attempts: { type: Number, default: 0 },
    error: { type: String },
  },
  { timestamps: true }
);

pendingEmailSchema.index({ status: 1 });

export const PendingEmailModel =
  models.PendingEmail || model<PendingEmailDocument>('PendingEmail', pendingEmailSchema);
