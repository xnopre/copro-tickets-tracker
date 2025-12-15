import { ITicketRepository } from '@/domain/repositories/ITicketRepository';
import { CreateTicket } from '@/domain/use-cases/CreateTicket';
import { GetTickets } from '@/domain/use-cases/GetTickets';
import { GetTicketById } from '@/domain/use-cases/GetTicketById';
import { UpdateTicket } from '@/domain/use-cases/UpdateTicket';
import { ArchiveTicket } from '@/domain/use-cases/ArchiveTicket';
import { CreateTicketData, Ticket, UpdateTicketData } from '@/domain/entities/Ticket';

export class TicketService {
  private createTicketUseCase: CreateTicket;
  private getTicketsUseCase: GetTickets;
  private getTicketByIdUseCase: GetTicketById;
  private updateTicketUseCase: UpdateTicket;
  private archiveTicketUseCase: ArchiveTicket;

  constructor(ticketRepository: ITicketRepository) {
    this.createTicketUseCase = new CreateTicket(ticketRepository);
    this.getTicketsUseCase = new GetTickets(ticketRepository);
    this.getTicketByIdUseCase = new GetTicketById(ticketRepository);
    this.updateTicketUseCase = new UpdateTicket(ticketRepository);
    this.archiveTicketUseCase = new ArchiveTicket(ticketRepository);
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

  async updateTicket(id: string, data: UpdateTicketData): Promise<Ticket | null> {
    return await this.updateTicketUseCase.execute(id, data);
  }

  async archiveTicket(id: string): Promise<Ticket | null> {
    return await this.archiveTicketUseCase.execute(id);
  }
}
