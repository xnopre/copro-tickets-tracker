import { MongoTicketRepository } from '@/infrastructure/repositories/MongoTicketRepository';
import { TicketService } from './TicketService';

export class ServiceFactory {
  private static ticketService = new TicketService(new MongoTicketRepository());

  static getTicketService(): TicketService {
    return this.ticketService;
  }
}
