import { MongoTicketRepository } from '@/infrastructure/repositories/MongoTicketRepository';
import { TicketService } from './TicketService';

export class ServiceFactory {
  private static ticketService: TicketService | null = null;

  static getTicketService(): TicketService {
    if (!this.ticketService) {
      this.ticketService = new TicketService(new MongoTicketRepository());
    }
    return this.ticketService;
  }
}
