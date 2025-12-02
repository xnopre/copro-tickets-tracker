import { ITicketRepository } from '../repositories/ITicketRepository';
import { CreateTicketData, Ticket } from '../entities/Ticket';
import { ValidationError } from '../errors/ValidationError';

export class CreateTicket {
  constructor(private ticketRepository: ITicketRepository) {}

  async execute(data: CreateTicketData): Promise<Ticket> {
    this.validateData(data);

    const ticket = await this.ticketRepository.create({
      title: data.title.trim(),
      description: data.description.trim(),
    });

    return ticket;
  }

  private validateData(data: CreateTicketData): void {
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      throw new ValidationError('Le titre est requis');
    }

    if (data.title.trim().length > 200) {
      throw new ValidationError('Le titre ne doit pas dépasser 200 caractères');
    }

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
}
