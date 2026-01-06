import { ITicketRepository } from '@/domain/repositories/ITicketRepository';
import { Ticket, CreateTicketData, UpdateTicketData } from '@/domain/entities/Ticket';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { TicketModel, TicketDocument } from '../database/schemas/TicketSchema';
import connectDB from '../database/mongodb';
import { Types } from 'mongoose';
import { UserPublic } from '@/domain/entities/User';

export class MongoTicketRepository implements ITicketRepository {
  async findAll(): Promise<Ticket[]> {
    await connectDB();
    const documents = await TicketModel.find({}).populate('assignedTo').sort({ createdAt: -1 });

    return documents.map(doc => this.mapToEntity(doc));
  }

  async findById(id: string): Promise<Ticket | null> {
    await connectDB();

    // Valider le format MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new InvalidIdError(id);
    }

    const document = await TicketModel.findById(id).populate('assignedTo');

    if (!document) {
      return null;
    }

    return this.mapToEntity(document);
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

  async update(id: string, data: UpdateTicketData): Promise<Ticket | null> {
    await connectDB();

    // Valider le format MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new InvalidIdError(id);
    }

    // Convertir assignedTo en ObjectId si présent
    const updateData = { ...data };
    if (updateData.assignedTo !== undefined) {
      if (updateData.assignedTo === null) {
        (updateData as any).assignedTo = null;
      } else if (Types.ObjectId.isValid(updateData.assignedTo)) {
        (updateData as any).assignedTo = new Types.ObjectId(updateData.assignedTo);
      } else {
        throw new InvalidIdError(updateData.assignedTo);
      }
    }

    const document = await TicketModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('assignedTo');

    if (!document) {
      return null;
    }

    return this.mapToEntity(document);
  }

  async archive(id: string): Promise<Ticket | null> {
    await connectDB();

    // Valider le format MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new InvalidIdError(id);
    }

    const document = await TicketModel.findByIdAndUpdate(
      id,
      { archived: true },
      { new: true, runValidators: true }
    ).populate('assignedTo');

    if (!document) {
      return null;
    }

    return this.mapToEntity(document);
  }

  private mapToEntity(document: TicketDocument): Ticket {
    let assignedTo: UserPublic | null = null;
    if (document.assignedTo) {
      const assignedToPopulated = document.assignedTo as unknown as {
        firstName: string;
        lastName: string;
      };
      assignedTo = {
        id: document.assignedTo._id.toString(),
        firstName: assignedToPopulated.firstName,
        lastName: assignedToPopulated.lastName,
      };
    }

    return {
      id: document._id.toString(),
      title: document.title,
      description: document.description,
      status: document.status,
      assignedTo,
      archived: document.archived,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
