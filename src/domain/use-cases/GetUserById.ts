import { IUserRepository } from '../repositories/IUserRepository';
import { User } from '../entities/User';

/**
 * Use Case : Récupérer un utilisateur par son ID
 */
export class GetUserById {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}
