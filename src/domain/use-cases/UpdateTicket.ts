import { ITicketRepository } from '../repositories/ITicketRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { IEmailService } from '../services/IEmailService';
import { Ticket, UpdateTicketData } from '../entities/Ticket';
import { ValidationError } from '../errors/ValidationError';
import { TicketStatus } from '../value-objects/TicketStatus';
import { EmailTemplates } from '@/infrastructure/services/EmailTemplates';

export class UpdateTicket {
  constructor(
    private ticketRepository: ITicketRepository,
    private userRepository: IUserRepository,
    private emailService: IEmailService
  ) {}

  async execute(id: string, data: UpdateTicketData): Promise<Ticket | null> {
    this.validateData(data);

    // Vérifier que le ticket existe et n'est pas archivé
    const existingTicket = await this.ticketRepository.findById(id);
    if (!existingTicket) {
      return null;
    }

    if (existingTicket.archived) {
      throw new ValidationError('Un ticket archivé ne peut pas être modifié');
    }

    // Prepare trimmed data
    const trimmedData: UpdateTicketData = {};
    if (data.title !== undefined) trimmedData.title = data.title.trim();
    if (data.description !== undefined) trimmedData.description = data.description.trim();
    if (data.status !== undefined) trimmedData.status = data.status;
    if (data.assignedTo !== undefined) {
      trimmedData.assignedTo =
        typeof data.assignedTo === 'string' && data.assignedTo.trim()
          ? data.assignedTo.trim()
          : null;
    }

    const updatedTicket = await this.ticketRepository.update(id, trimmedData);

    if (!updatedTicket) {
      return null;
    }

    await this.notifyTicketUpdated(existingTicket, updatedTicket, trimmedData);

    return updatedTicket;
  }

  private async notifyTicketUpdated(
    oldTicket: Ticket,
    newTicket: Ticket,
    updateData: UpdateTicketData
  ): Promise<void> {
    try {
      if (updateData.assignedTo !== undefined && updateData.assignedTo !== null) {
        const oldAssignedId = oldTicket.assignedTo?.id;
        const newAssignedId = newTicket.assignedTo?.id;

        if (oldAssignedId !== newAssignedId && newAssignedId) {
          await this.notifyAssignment(newTicket, newAssignedId);
        }
      }

      if (updateData.status !== undefined && oldTicket.status !== newTicket.status) {
        await this.notifyStatusChange(newTicket, oldTicket.status, newTicket.status);
      }
    } catch (error) {
      console.error("[UpdateTicket] Erreur lors de l'envoi des emails:", error);
    }
  }

  private async notifyAssignment(ticket: Ticket, assigneeId: string): Promise<void> {
    const assignee = await this.userRepository.findById(assigneeId);
    if (!assignee) {
      return;
    }

    const { subject, htmlContent, textContent } = EmailTemplates.ticketAssigned(ticket, assignee);

    await this.emailService.sendSafe({
      to: [
        {
          email: assignee.email,
          name: `${assignee.firstName} ${assignee.lastName}`,
        },
      ],
      subject,
      htmlContent,
      textContent,
    });
  }

  private async notifyStatusChange(
    ticket: Ticket,
    oldStatus: TicketStatus,
    newStatus: TicketStatus
  ): Promise<void> {
    const users = await this.userRepository.findAll();

    if (users.length === 0) {
      return;
    }

    const { subject, htmlContent, textContent } = EmailTemplates.ticketStatusChanged(
      ticket,
      oldStatus,
      newStatus
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
  }

  private validateData(data: UpdateTicketData): void {
    // Vérifier qu'au moins un champ est fourni
    if (
      data.title === undefined &&
      data.description === undefined &&
      data.status === undefined &&
      data.assignedTo === undefined
    ) {
      throw new ValidationError('Au moins un champ doit être fourni pour la mise à jour');
    }

    // Valider title si présent
    if (data.title !== undefined) {
      if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
        throw new ValidationError('Le titre est requis');
      }
      if (data.title.trim().length > 200) {
        throw new ValidationError('Le titre ne doit pas dépasser 200 caractères');
      }
    }

    // Valider description si présente
    if (data.description !== undefined) {
      if (
        !data.description ||
        typeof data.description !== 'string' ||
        data.description.trim().length === 0
      ) {
        throw new ValidationError('La description est requise');
      }
      if (data.description.trim().length > 5000) {
        throw new ValidationError('La description ne doit pas dépasser 5000 caractères');
      }
    }

    // Valider status si présent
    if (data.status !== undefined) {
      if (!Object.values(TicketStatus).includes(data.status)) {
        throw new ValidationError('Statut invalide');
      }
    }
  }
}
