import { Ticket } from '@/domain/entities/Ticket';
import { Comment } from '@/domain/entities/Comment';
import { User } from '@/domain/entities/User';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { IEmailTemplateService, EmailTemplate } from '@/domain/services/IEmailTemplateService';

export class EmailTemplates implements IEmailTemplateService {
  private readonly APP_NAME = 'CoTiTra';
  private readonly APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  /**
   * Email de création de ticket
   */
  ticketCreated(ticket: Ticket): EmailTemplate {
    const subject = `[${this.APP_NAME}] Nouveau ticket créé : ${ticket.title}`;
    const ticketUrl = `${this.APP_URL}/tickets/${ticket.id}`;

    const htmlContent = `
      <h2>Nouveau ticket créé</h2>
      <p><strong>Titre :</strong> ${this.escapeHtml(ticket.title)}</p>
      <p><strong>Description :</strong></p>
      <p>${this.escapeHtml(ticket.description)}</p>
      <p><strong>Statut :</strong> ${ticket.status}</p>
      <p><a href="${ticketUrl}">Voir le ticket</a></p>
    `;

    const textContent = `
Nouveau ticket créé

Titre : ${ticket.title}
Description : ${ticket.description}
Statut : ${ticket.status}

Voir le ticket : ${ticketUrl}
    `;

    return { subject, htmlContent, textContent };
  }

  /**
   * Email d'assignation de ticket
   */
  ticketAssigned(ticket: Ticket, assignee: User): EmailTemplate {
    const subject = `[${this.APP_NAME}] Ticket assigné : ${ticket.title}`;
    const ticketUrl = `${this.APP_URL}/tickets/${ticket.id}`;

    const htmlContent = `
      <h2>Un ticket vous a été assigné</h2>
      <p>Bonjour ${this.escapeHtml(assignee.firstName)},</p>
      <p>Le ticket suivant vous a été assigné :</p>
      <p><strong>Titre :</strong> ${this.escapeHtml(ticket.title)}</p>
      <p><strong>Description :</strong></p>
      <p>${this.escapeHtml(ticket.description)}</p>
      <p><a href="${ticketUrl}">Voir le ticket</a></p>
    `;

    const textContent = `
Un ticket vous a été assigné

Bonjour ${assignee.firstName},

Le ticket suivant vous a été assigné :

Titre : ${ticket.title}
Description : ${ticket.description}

Voir le ticket : ${ticketUrl}
    `;

    return { subject, htmlContent, textContent };
  }

  /**
   * Email de changement de statut
   */
  ticketStatusChanged(
    ticket: Ticket,
    oldStatus: TicketStatus,
    newStatus: TicketStatus
  ): EmailTemplate {
    const subject = `[${this.APP_NAME}] Changement de statut : ${ticket.title}`;
    const ticketUrl = `${this.APP_URL}/tickets/${ticket.id}`;

    const htmlContent = `
      <h2>Changement de statut du ticket</h2>
      <p><strong>Titre :</strong> ${this.escapeHtml(ticket.title)}</p>
      <p><strong>Ancien statut :</strong> ${oldStatus}</p>
      <p><strong>Nouveau statut :</strong> ${newStatus}</p>
      <p><a href="${ticketUrl}">Voir le ticket</a></p>
    `;

    const textContent = `
Changement de statut du ticket

Titre : ${ticket.title}
Ancien statut : ${oldStatus}
Nouveau statut : ${newStatus}

Voir le ticket : ${ticketUrl}
    `;

    return { subject, htmlContent, textContent };
  }

  /**
   * Email de nouveau commentaire
   */
  commentAdded(ticket: Ticket, comment: Comment): EmailTemplate {
    const subject = `[${this.APP_NAME}] Nouveau commentaire : ${ticket.title}`;
    const ticketUrl = `${this.APP_URL}/tickets/${ticket.id}`;

    const htmlContent = `
      <h2>Nouveau commentaire sur le ticket</h2>
      <p><strong>Ticket :</strong> ${this.escapeHtml(ticket.title)}</p>
      <p><strong>Auteur :</strong> ${this.escapeHtml(comment.author)}</p>
      <p><strong>Commentaire :</strong></p>
      <p>${this.escapeHtml(comment.content)}</p>
      <p><a href="${ticketUrl}">Voir le ticket</a></p>
    `;

    const textContent = `
Nouveau commentaire sur le ticket

Ticket : ${ticket.title}
Auteur : ${comment.author}
Commentaire : ${comment.content}

Voir le ticket : ${ticketUrl}
    `;

    return { subject, htmlContent, textContent };
  }

  /**
   * Échappe les caractères HTML pour éviter les injections XSS
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, char => map[char]);
  }
}
