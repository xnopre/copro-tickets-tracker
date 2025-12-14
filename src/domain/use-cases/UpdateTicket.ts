import { ITicketRepository } from '../repositories/ITicketRepository';
import { Ticket, UpdateTicketData } from '../entities/Ticket';
import { ValidationError } from '../errors/ValidationError';
import { TicketStatus } from '../value-objects/TicketStatus';

export class UpdateTicket {
  constructor(private ticketRepository: ITicketRepository) {}

  async execute(id: string, data: UpdateTicketData): Promise<Ticket | null> {
    this.validateData(data);

    // Prepare trimmed data
    const trimmedData: UpdateTicketData = {};
    if (data.title !== undefined) trimmedData.title = data.title.trim();
    if (data.description !== undefined) trimmedData.description = data.description.trim();
    if (data.status !== undefined) trimmedData.status = data.status;
    if (data.assignedTo !== undefined) trimmedData.assignedTo = data.assignedTo.trim();

    return await this.ticketRepository.update(id, trimmedData);
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

    // Valider assignedTo si présent
    if (data.assignedTo !== undefined) {
      if (typeof data.assignedTo !== 'string' || data.assignedTo.trim() === '') {
        throw new ValidationError('Le nom de la personne assignée est obligatoire');
      }
    }
  }
}
