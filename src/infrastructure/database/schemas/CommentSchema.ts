import { Schema, model, models, Document, Types } from 'mongoose';

export interface CommentDocument extends Document {
  ticketId: Types.ObjectId;
  content: string;
  authorId: Types.ObjectId;
  createdAt: Date;
}

const commentSchema = new Schema<CommentDocument>(
  {
    ticketId: {
      type: Types.ObjectId,
      ref: 'Ticket',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
      trim: true,
    },
    authorId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const CommentModel = models.Comment || model<CommentDocument>('Comment', commentSchema);
