import { Ticket, CreateTicketData } from '../entities/Ticket';

export interface ITicketRepository {
  findAll(): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket | null>;
  create(data: CreateTicketData): Promise<Ticket>;
}
