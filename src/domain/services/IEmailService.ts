/**
 * Interface du service Email (Port)
 * Définit les opérations d'envoi d'emails selon l'architecture hexagonale
 */

export interface EmailRecipient {
  email: string;
  name: string;
}

export interface EmailData {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface IEmailService {
  /**
   * Envoie un email
   * @throws EmailServiceError si l'envoi échoue
   */
  send(data: EmailData): Promise<void>;

  /**
   * Envoie un email de manière non-bloquante (catch les erreurs)
   * @returns true si l'envoi a réussi, false sinon
   */
  sendSafe(data: EmailData): Promise<boolean>;
}
