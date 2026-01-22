import { beforeEach, describe, expect, it } from 'vitest';
import { EmailTemplates } from './EmailTemplates';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { Ticket } from '@/domain/entities/Ticket';
import { Comment } from '@/domain/entities/Comment';
import { User } from '@/domain/entities/User';
import { mockUser1, mockUser3 } from '@tests/helpers/mockUsers';
import { mockComment1 } from '@tests/helpers/mockComments';
import { mockTicketNew } from '@tests/helpers/mockTickets';

describe('EmailTemplates', () => {
  let emailTemplates: EmailTemplates;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
    emailTemplates = new EmailTemplates();
  });

  describe('ticketCreated', () => {
    it('should generate correct email content', () => {
      const result = emailTemplates.ticketCreated(mockTicketNew);

      expect(result.subject).toBe('[CoTiTra] Nouveau ticket créé : Test Ticket New');
      expect(result.htmlContent).toContain('Nouveau ticket créé');
      expect(result.htmlContent).toContain('Test Ticket New');
      expect(result.htmlContent).toContain('Test Description');
      expect(result.htmlContent).toContain('http://localhost:3000/tickets/1');
      expect(result.textContent).toContain('Test Ticket');
    });

    it('should escape HTML characters to prevent XSS', () => {
      const ticket: Ticket = {
        ...mockTicketNew,
        title: '<script>alert("XSS")</script>',
        description: 'Test & Description with "quotes" and \'apostrophes\'',
      };

      const result = emailTemplates.ticketCreated(ticket);

      expect(result.htmlContent).toContain('&lt;script&gt;');
      expect(result.htmlContent).toContain('&amp;');
      expect(result.htmlContent).toContain('&quot;');
      expect(result.htmlContent).toContain('&#039;');
      expect(result.htmlContent).not.toContain('<script>');
    });
  });

  describe('ticketAssigned', () => {
    it('should generate correct email content', () => {
      const result = emailTemplates.ticketAssigned(mockTicketNew, mockUser3);

      expect(result.subject).toBe('[CoTiTra] Ticket assigné : Test Ticket New');
      expect(result.htmlContent).toContain('Un ticket vous a été assigné');
      expect(result.htmlContent).toContain('Bonjour Pierre');
      expect(result.htmlContent).toContain('Test Ticket New');
      expect(result.htmlContent).toContain('http://localhost:3000/tickets/1');
      expect(result.textContent).toContain('Pierre');
    });

    it('should escape HTML in assignee name', () => {
      const assignee: User = {
        ...mockUser1,
        firstName: '<script>alert("XSS")</script>',
      };

      const result = emailTemplates.ticketAssigned(mockTicketNew, assignee);

      expect(result.htmlContent).toContain('&lt;script&gt;');
      expect(result.htmlContent).not.toContain('<script>alert');
    });
  });

  describe('ticketStatusChanged', () => {
    it('should generate correct email content', () => {
      const result = emailTemplates.ticketStatusChanged(
        mockTicketNew,
        TicketStatus.NEW,
        TicketStatus.IN_PROGRESS
      );

      expect(result.subject).toBe('[CoTiTra] Changement de statut : Test Ticket New');
      expect(result.htmlContent).toContain('Changement de statut du ticket');
      expect(result.htmlContent).toContain('Test Ticket New');
      expect(result.htmlContent).toContain('NEW');
      expect(result.htmlContent).toContain('IN_PROGRESS');
      expect(result.htmlContent).toContain('http://localhost:3000/tickets/1');
      expect(result.textContent).toContain('NEW');
      expect(result.textContent).toContain('IN_PROGRESS');
    });
  });

  describe('commentAdded', () => {
    it('should generate correct email content', () => {
      const result = emailTemplates.commentAdded(mockTicketNew, mockComment1);

      expect(result.subject).toBe('[CoTiTra] Nouveau commentaire : Test Ticket New');
      expect(result.htmlContent).toContain('Nouveau commentaire sur le ticket');
      expect(result.htmlContent).toContain('Test Ticket New');
      expect(result.htmlContent).toContain('Jean Dupont');
      expect(result.htmlContent).toContain('Premier commentaire');
      expect(result.htmlContent).toContain('http://localhost:3000/tickets/1');
    });

    it('should escape HTML in comment content', () => {
      const mockComment: Comment = {
        ...mockComment1,
        content: '<script>alert("XSS")</script>',
      };

      const result = emailTemplates.commentAdded(mockTicketNew, mockComment);

      expect(result.htmlContent).toContain('&lt;script&gt;');
      expect(result.htmlContent).not.toContain('<script>alert');
    });
  });
});
