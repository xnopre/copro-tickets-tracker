import { ITicketRepository } from '@/domain/repositories/ITicketRepository';
import { Ticket, CreateTicketData } from '@/domain/entities/Ticket';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { TicketModel, TicketDocument } from '../database/schemas/TicketSchema';
import connectDB from '../database/mongodb';

export class MongoTicketRepository implements ITicketRepository {
  async findAll(): Promise<Ticket[]> {
    await connectDB();
    const documents = await TicketModel.find().sort({ createdAt: -1 });

    return documents.map(doc => this.mapToEntity(doc));
  }

  async create(data: CreateTicketData): Promise<Ticket> {
    await connectDB();
    const document = await TicketModel.create({
      title: data.title,
      description: data.description,
      status: TicketStatus.NEW,
    });

    return this.mapToEntity(document);
  }

  private mapToEntity(document: TicketDocument): Ticket {
    return {
      id: document._id.toString(),
      title: document.title,
      description: document.description,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
