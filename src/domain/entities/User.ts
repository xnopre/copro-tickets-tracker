/**
 * User Entity
 * Représente un utilisateur du système
 */

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * User public (sans mot de passe ni email)
 * Utilisé pour les réponses API
 */
export interface UserPublic {
  id: string;
  firstName: string;
  lastName: string;
}
