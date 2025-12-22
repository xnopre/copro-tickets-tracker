import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import UserModel from '../database/schemas/UserSchema';

/**
 * Implémentation MongoDB du repository User (Adapter)
 */
export class MongoUserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    const users = await UserModel.find().sort({ lastName: 1, firstName: 1 }).lean();

    return users.map(user => ({
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }));
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id).lean();

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
