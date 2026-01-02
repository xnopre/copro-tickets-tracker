import { ICommentRepository } from '../repositories/ICommentRepository';
import { ITicketRepository } from '../repositories/ITicketRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { IEmailService } from '../services/IEmailService';
import { IEmailTemplateService } from '../services/IEmailTemplateService';
import { ILogger } from '../services/ILogger';
import { CreateCommentData, Comment } from '../entities/Comment';
import { ValidationError } from '../errors/ValidationError';

export class AddComment {
  constructor(
    private commentRepository: ICommentRepository,
    private ticketRepository: ITicketRepository,
    private userRepository: IUserRepository,
    private emailService: IEmailService,
    private emailTemplateService: IEmailTemplateService,
    private logger: ILogger
  ) {}

  async execute(data: CreateCommentData): Promise<Comment> {
    this.validateData(data);

    const comment = await this.commentRepository.create({
      ticketId: data.ticketId,
      content: data.content.trim(),
      author: data.author.trim(),
    });

    await this.notifyCommentAdded(comment);

    return comment;
  }

  private async notifyCommentAdded(comment: Comment): Promise<void> {
    try {
      const ticket = await this.ticketRepository.findById(comment.ticketId);
      if (!ticket) {
        return;
      }

      const users = await this.userRepository.findAll();

      if (users.length === 0) {
        return;
      }

      const { subject, htmlContent, textContent } = this.emailTemplateService.commentAdded(
        ticket,
        comment
      );

      await this.emailService.sendSafe({
        to: users.map(user => ({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        })),
        subject,
        htmlContent,
        textContent,
      });
    } catch (error) {
      this.logger.error("[AddComment] Erreur lors de l'envoi des emails", error);
    }
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
