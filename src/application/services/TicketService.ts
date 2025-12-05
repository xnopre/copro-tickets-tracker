import { ITicketRepository } from '@/domain/repositories/ITicketRepository';
import { CreateTicket } from '@/domain/use-cases/CreateTicket';
import { GetTickets } from '@/domain/use-cases/GetTickets';
import { GetTicketById } from '@/domain/use-cases/GetTicketById';
import { CreateTicketData, Ticket } from '@/domain/entities/Ticket';

export class TicketService {
  private createTicketUseCase: CreateTicket;
  private getTicketsUseCase: GetTickets;
  private getTicketByIdUseCase: GetTicketById;

  constructor(ticketRepository: ITicketRepository) {
    this.createTicketUseCase = new CreateTicket(ticketRepository);
    this.getTicketsUseCase = new GetTickets(ticketRepository);
    this.getTicketByIdUseCase = new GetTicketById(ticketRepository);
  }

  async getAllTickets(): Promise<Ticket[]> {
    return await this.getTicketsUseCase.execute();
  }

  async getTicketById(id: string): Promise<Ticket | null> {
    return await this.getTicketByIdUseCase.execute(id);
  }

  async createTicket(data: CreateTicketData): Promise<Ticket> {
    return await this.createTicketUseCase.execute(data);
  }
}
