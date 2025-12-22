import { User } from '../entities/User';

/**
 * Interface du repository User (Port)
 * Définit les opérations de persistance pour les utilisateurs
 */
export interface IUserRepository {
  /**
   * Récupère tous les utilisateurs
   */
  findAll(): Promise<User[]>;

  /**
   * Récupère un utilisateur par son ID
   */
  findById(id: string): Promise<User | null>;
}
