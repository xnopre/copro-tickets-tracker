import { MongoTicketRepository } from '@/infrastructure/repositories/MongoTicketRepository';
import { TicketService } from './TicketService';

export class ServiceFactory {
  private static ticketService: TicketService | null = null;

  static getTicketService(): TicketService {
    if (!this.ticketService) {
      const ticketRepository = new MongoTicketRepository();
      this.ticketService = new TicketService(ticketRepository);
    }
    return this.ticketService;
  }
}
