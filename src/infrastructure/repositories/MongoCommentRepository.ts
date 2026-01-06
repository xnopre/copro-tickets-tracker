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

    const documents = await CommentModel.find({ ticketId })
      .populate('authorId', 'firstName lastName')
      .sort({
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

    // Valider que authorId est un ObjectId valide
    if (!Types.ObjectId.isValid(data.authorId)) {
      throw new InvalidIdError(data.authorId);
    }

    const document = await CommentModel.create({
      ticketId: data.ticketId,
      content: data.content,
      authorId: data.authorId,
    });

    await document.populate('authorId', 'firstName lastName');

    return this.mapToEntity(document);
  }

  private mapToEntity(document: CommentDocument): Comment {
    const authorPopulated = document.authorId as unknown as { firstName: string; lastName: string };

    return {
      id: document._id.toString(),
      ticketId: String(document.ticketId),
      content: document.content,
      author: {
        id: document.authorId._id.toString(),
        firstName: String(authorPopulated.firstName),
        lastName: String(authorPopulated.lastName),
        email: '',
      },
      createdAt: document.createdAt,
    };
  }
}
