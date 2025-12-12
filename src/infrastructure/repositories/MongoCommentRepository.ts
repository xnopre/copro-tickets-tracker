import { ICommentRepository } from '@/domain/repositories/ICommentRepository';
import { Comment, CreateCommentData } from '@/domain/entities/Comment';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { CommentModel, CommentDocument } from '../database/schemas/CommentSchema';
import connectDB from '../database/mongodb';
import { Types } from 'mongoose';

export class MongoCommentRepository implements ICommentRepository {
  async findByTicketId(ticketId: string): Promise<Comment[]> {
    await connectDB();

    // Valider le format MongoDB ObjectId
    if (!Types.ObjectId.isValid(ticketId)) {
      throw new InvalidIdError(ticketId);
    }

    const documents = await CommentModel.find({ ticketId }).sort({
      createdAt: 1,
    });

    return documents.map(doc => this.mapToEntity(doc));
  }

  async create(data: CreateCommentData): Promise<Comment> {
    await connectDB();

    // Valider le format MongoDB ObjectId du ticketId
    if (!Types.ObjectId.isValid(data.ticketId)) {
      throw new InvalidIdError(data.ticketId);
    }

    const document = await CommentModel.create({
      ticketId: data.ticketId,
      content: data.content,
      author: data.author,
    });

    return this.mapToEntity(document);
  }

  private mapToEntity(document: CommentDocument): Comment {
    return {
      id: document._id.toString(),
      ticketId: document.ticketId,
      content: document.content,
      author: document.author,
      createdAt: document.createdAt,
    };
  }
}
