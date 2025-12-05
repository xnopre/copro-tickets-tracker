import { ITicketRepository } from '../repositories/ITicketRepository';
import { Ticket } from '../entities/Ticket';

export class GetTicketById {
  constructor(private ticketRepository: ITicketRepository) {}

  async execute(id: string): Promise<Ticket | null> {
    return await this.ticketRepository.findById(id);
  }
}
