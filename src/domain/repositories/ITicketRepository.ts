import { Ticket, CreateTicketData, UpdateTicketData } from '../entities/Ticket';

export interface ITicketRepository {
  findAll(): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket | null>;
  create(data: CreateTicketData): Promise<Ticket>;
  update(id: string, data: UpdateTicketData): Promise<Ticket | null>;
  archive(id: string): Promise<Ticket | null>;
}
