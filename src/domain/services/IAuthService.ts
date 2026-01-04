import { User } from '../entities/User';

/**
 * Interface du service d'authentification (Port)
 * Définit les opérations d'authentification publiques
 */
export interface IAuthService {
  /**
   * Valide un email et un mot de passe
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe en clair
   * @returns L'utilisateur si les identifiants sont valides, null sinon
   */
  validateCredentials(email: string, password: string): Promise<User | null>;
}
