import { Schema, model, models, Document } from 'mongoose';

export interface CommentDocument extends Document {
  ticketId: string;
  content: string;
  author: string;
  createdAt: Date;
}

const commentSchema = new Schema<CommentDocument>(
  {
    ticketId: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const CommentModel = models.Comment || model<CommentDocument>('Comment', commentSchema);
