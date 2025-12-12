import { ICommentRepository } from '../repositories/ICommentRepository';
import { CreateCommentData, Comment } from '../entities/Comment';
import { ValidationError } from '../errors/ValidationError';

export class AddComment {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(data: CreateCommentData): Promise<Comment> {
    this.validateData(data);

    const comment = await this.commentRepository.create({
      ticketId: data.ticketId,
      content: data.content.trim(),
      author: data.author.trim(),
    });

    return comment;
  }

  private validateData(data: CreateCommentData): void {
    if (!data.ticketId || typeof data.ticketId !== 'string') {
      throw new ValidationError("L'ID du ticket est requis");
    }

    if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
      throw new ValidationError('Le contenu du commentaire est requis');
    }

    if (data.content.trim().length > 2000) {
      throw new ValidationError('Le commentaire ne doit pas dépasser 2000 caractères');
    }

    if (!data.author || typeof data.author !== 'string' || data.author.trim().length === 0) {
      throw new ValidationError("L'auteur du commentaire est requis");
    }

    if (data.author.trim().length > 100) {
      throw new ValidationError("L'auteur ne doit pas dépasser 100 caractères");
    }
  }
}
