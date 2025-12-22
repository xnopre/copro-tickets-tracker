import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { GetUsers } from '../../domain/use-cases/GetUsers';
import { GetUserById } from '../../domain/use-cases/GetUserById';
import { User, UserPublic } from '../../domain/entities/User';

/**
 * Service applicatif pour les utilisateurs
 * Orchestre les use cases et expose les opérations métier
 */
export class UserService {
  private getUsersUseCase: GetUsers;
  private getUserByIdUseCase: GetUserById;

  constructor(userRepository: IUserRepository) {
    this.getUsersUseCase = new GetUsers(userRepository);
    this.getUserByIdUseCase = new GetUserById(userRepository);
  }

  /**
   * Récupère tous les utilisateurs (sans mot de passe)
   */
  async getUsers(): Promise<UserPublic[]> {
    const users = await this.getUsersUseCase.execute();
    return users.map(this.toPublicUser);
  }

  /**
   * Récupère un utilisateur par son ID (sans mot de passe)
   */
  async getUserById(id: string): Promise<UserPublic | null> {
    const user = await this.getUserByIdUseCase.execute(id);
    return user ? this.toPublicUser(user) : null;
  }

  /**
   * Convertit un User en UserPublic (sans mot de passe ni email)
   */
  private toPublicUser(user: User): UserPublic {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
