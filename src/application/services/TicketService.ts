import { ITicketRepository } from '@/domain/repositories/ITicketRepository';
import { CreateTicket } from '@/domain/use-cases/CreateTicket';
import { GetTickets } from '@/domain/use-cases/GetTickets';
import { CreateTicketData, Ticket } from '@/domain/entities/Ticket';

export class TicketService {
  private createTicketUseCase: CreateTicket;
  private getTicketsUseCase: GetTickets;

  constructor(ticketRepository: ITicketRepository) {
    this.createTicketUseCase = new CreateTicket(ticketRepository);
    this.getTicketsUseCase = new GetTickets(ticketRepository);
  }

  async getAllTickets(): Promise<Ticket[]> {
    return await this.getTicketsUseCase.execute();
  }

  async createTicket(data: CreateTicketData): Promise<Ticket> {
    return await this.createTicketUseCase.execute(data);
  }
}
