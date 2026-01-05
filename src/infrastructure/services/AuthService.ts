import { comparePassword } from '../crypto/passwordUtils';
import { IAuthService } from '../../domain/services/IAuthService';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

/**
 * Implémentation du service d'authentification (Adapter)
 * Utilise Web Crypto API pour la validation des mots de passe
 */
export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await this.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * Méthode privée : Compare un mot de passe en clair avec un hash
   */
  private async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return comparePassword(plainPassword, hashedPassword);
  }
}
