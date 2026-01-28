import { ITicketRepository } from '@/domain/repositories/ITicketRepository';
import { CreateTicketData, Ticket, UpdateTicketData } from '@/domain/entities/Ticket';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { TicketDocument, TicketModel } from '../database/schemas/TicketSchema';
import connectDB from '../database/mongodb';
import { Types } from 'mongoose';
import { UserPublic } from '@/domain/entities/User';

export type PopulatedUser = {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
};

export function isPopulatedUser(
  user: string | Types.ObjectId | PopulatedUser
): user is PopulatedUser {
  return (
    user !== null &&
    typeof user === 'object' &&
    !(user instanceof Types.ObjectId) &&
    '_id' in user &&
    'firstName' in user &&
    'lastName' in user
  );
}

export class MongoTicketRepository implements ITicketRepository {
  async findAll(): Promise<Ticket[]> {
    await connectDB();
    const documents = await TicketModel.find({})
      .populate('createdBy')
      .populate('assignedTo')
      .sort({ createdAt: -1 });

    return documents.map(doc => this.mapToEntity(doc));
  }

  async findById(id: string): Promise<Ticket | null> {
    await connectDB();

    // Valider le format MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new InvalidIdError(id);
    }

    const document = await TicketModel.findById(id).populate('createdBy').populate('assignedTo');

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
      createdBy: new Types.ObjectId(data.createdBy),
      status: TicketStatus.NEW,
    });

    await document.populate('createdBy');
    await document.populate('assignedTo');

    return this.mapToEntity(document);
  }

  async update(id: string, data: UpdateTicketData): Promise<Ticket | null> {
    await connectDB();

    // Valider le format MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new InvalidIdError(id);
    }

    // Convertir assignedTo en ObjectId si présent
    // TODO XN passer par un autre type pour updateData ?
    const updateData = { ...data };
    if (updateData.assignedTo !== undefined && updateData.assignedTo !== null) {
      if (Types.ObjectId.isValid(updateData.assignedTo)) {
        (updateData as any).assignedTo = new Types.ObjectId(updateData.assignedTo);
      } else {
        throw new InvalidIdError(updateData.assignedTo);
      }
    }

    const document = await TicketModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy')
      .populate('assignedTo');

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
    )
      .populate('createdBy')
      .populate('assignedTo');

    if (!document) {
      return null;
    }

    return this.mapToEntity(document);
  }

  private mapToEntity(document: TicketDocument): Ticket {
    const createdBy = this.populatedUserToUserPublicRequired(
      document.createdBy as unknown as PopulatedUser
    );

    const assignedTo = this.populatedUserToUserPublic(
      document.assignedTo as unknown as PopulatedUser
    );

    return {
      id: document._id.toString(),
      title: document.title,
      description: document.description,
      status: document.status,
      createdBy,
      assignedTo,
      archived: document.archived,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  private populatedUserToUserPublic(
    populatedUser: PopulatedUser | Types.ObjectId | string | null
  ): UserPublic | null {
    if (populatedUser === null || populatedUser === undefined) {
      return null;
    }
    if (isPopulatedUser(populatedUser)) {
      return {
        id: populatedUser._id.toString(),
        firstName: populatedUser.firstName,
        lastName: populatedUser.lastName,
      };
    }
    return {
      id: typeof populatedUser === 'string' ? populatedUser : populatedUser._id.toString(),
      firstName: 'Utilisateur',
      lastName: 'introuvable',
    };
  }

  private populatedUserToUserPublicRequired(
    populatedUser: PopulatedUser | Types.ObjectId | string | null
  ): UserPublic {
    const userPublic = this.populatedUserToUserPublic(populatedUser);
    if (userPublic === null) {
      return {
        id: 'unknown',
        firstName: 'Utilisateur',
        lastName: 'introuvable',
      };
    }
    return userPublic;
  }
}
