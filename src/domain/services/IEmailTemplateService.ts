import { Ticket } from '../entities/Ticket';
import { Comment } from '../entities/Comment';
import { User } from '../entities/User';
import { TicketStatus } from '../value-objects/TicketStatus';

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface IEmailTemplateService {
  ticketCreated(ticket: Ticket): EmailTemplate;
  ticketAssigned(ticket: Ticket, assignee: User): EmailTemplate;
  ticketStatusChanged(
    ticket: Ticket,
    oldStatus: TicketStatus,
    newStatus: TicketStatus
  ): EmailTemplate;
  commentAdded(ticket: Ticket, comment: Comment): EmailTemplate;
}
