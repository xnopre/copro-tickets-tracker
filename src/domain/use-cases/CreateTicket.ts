import { ITicketRepository } from '../repositories/ITicketRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { IEmailService } from '../services/IEmailService';
import { IEmailTemplateService } from '../services/IEmailTemplateService';
import { ILogger } from '../services/ILogger';
import { CreateTicketData, Ticket } from '../entities/Ticket';
import { ValidationError } from '../errors/ValidationError';

export class CreateTicket {
  constructor(
    private ticketRepository: ITicketRepository,
    private userRepository: IUserRepository,
    private emailService: IEmailService,
    private emailTemplateService: IEmailTemplateService,
    private logger: ILogger
  ) {}

  async execute(data: CreateTicketData): Promise<Ticket> {
    this.validateData(data);

    // Validate that createdBy user exists
    const user = await this.userRepository.findById(data.createdBy);
    if (!user) {
      throw new ValidationError('Utilisateur invalide');
    }

    const ticket = await this.ticketRepository.create({
      title: data.title.trim(),
      description: data.description.trim(),
      createdBy: data.createdBy,
    });

    await this.notifyTicketCreated(ticket);

    return ticket;
  }

  private async notifyTicketCreated(ticket: Ticket): Promise<void> {
    try {
      const users = await this.userRepository.findAll();

      if (users.length === 0) {
        return;
      }

      const { subject, htmlContent, textContent } = this.emailTemplateService.ticketCreated(ticket);

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
      this.logger.error("[CreateTicket] Erreur lors de l'envoi des emails", error);
    }
  }

  private validateData(data: CreateTicketData): void {
    if (!data.title || data.title.trim().length === 0) {
      throw new ValidationError('Le titre est requis');
    }

    if (data.title.trim().length > 200) {
      throw new ValidationError('Le titre ne doit pas dépasser 200 caractères');
    }

    if (!data.description || data.description.trim().length === 0) {
      throw new ValidationError('La description est requise');
    }

    if (data.description.trim().length > 5000) {
      throw new ValidationError('La description ne doit pas dépasser 5000 caractères');
    }
  }
}
