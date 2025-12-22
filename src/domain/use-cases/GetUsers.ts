import { IUserRepository } from '../repositories/IUserRepository';
import { User } from '../entities/User';

/**
 * Use Case : Récupérer tous les utilisateurs
 */
export class GetUsers {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
