import { Ticket, CreateTicketData } from '../entities/Ticket';

export interface ITicketRepository {
  findAll(): Promise<Ticket[]>;
  create(data: CreateTicketData): Promise<Ticket>;
}
