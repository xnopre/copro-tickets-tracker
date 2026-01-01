import { describe, it, expect, beforeEach } from 'vitest';
import { EmailTemplates } from './EmailTemplates';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { Ticket } from '@/domain/entities/Ticket';
import { Comment } from '@/domain/entities/Comment';
import { User } from '@/domain/entities/User';

describe('EmailTemplates', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
  });

  describe('ticketCreated', () => {
    it('should generate correct email content', () => {
      const ticket: Ticket = {
        id: 'ticket_123',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const result = EmailTemplates.ticketCreated(ticket);

      expect(result.subject).toBe('[CoTiTra] Nouveau ticket créé : Test Ticket');
      expect(result.htmlContent).toContain('Nouveau ticket créé');
      expect(result.htmlContent).toContain('Test Ticket');
      expect(result.htmlContent).toContain('Test Description');
      expect(result.htmlContent).toContain('http://localhost:3000/tickets/ticket_123');
      expect(result.textContent).toContain('Test Ticket');
    });

    it('should escape HTML characters to prevent XSS', () => {
      const ticket: Ticket = {
        id: 'ticket_123',
        title: '<script>alert("XSS")</script>',
        description: 'Test & Description with "quotes" and \'apostrophes\'',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const result = EmailTemplates.ticketCreated(ticket);

      expect(result.htmlContent).toContain('&lt;script&gt;');
      expect(result.htmlContent).toContain('&amp;');
      expect(result.htmlContent).toContain('&quot;');
      expect(result.htmlContent).toContain('&#039;');
      expect(result.htmlContent).not.toContain('<script>');
    });
  });

  describe('ticketAssigned', () => {
    it('should generate correct email content', () => {
      const ticket: Ticket = {
        id: 'ticket_123',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const assignee: User = {
        id: 'user_123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
      };

      const result = EmailTemplates.ticketAssigned(ticket, assignee);

      expect(result.subject).toBe('[CoTiTra] Ticket assigné : Test Ticket');
      expect(result.htmlContent).toContain('Un ticket vous a été assigné');
      expect(result.htmlContent).toContain('Bonjour John');
      expect(result.htmlContent).toContain('Test Ticket');
      expect(result.htmlContent).toContain('http://localhost:3000/tickets/ticket_123');
      expect(result.textContent).toContain('John');
    });

    it('should escape HTML in assignee name', () => {
      const ticket: Ticket = {
        id: 'ticket_123',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const assignee: User = {
        id: 'user_123',
        firstName: '<script>alert("XSS")</script>',
        lastName: 'Doe',
        email: 'john@test.com',
      };

      const result = EmailTemplates.ticketAssigned(ticket, assignee);

      expect(result.htmlContent).toContain('&lt;script&gt;');
      expect(result.htmlContent).not.toContain('<script>alert');
    });
  });

  describe('ticketStatusChanged', () => {
    it('should generate correct email content', () => {
      const ticket: Ticket = {
        id: 'ticket_123',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const result = EmailTemplates.ticketStatusChanged(
        ticket,
        TicketStatus.NEW,
        TicketStatus.IN_PROGRESS
      );

      expect(result.subject).toBe('[CoTiTra] Changement de statut : Test Ticket');
      expect(result.htmlContent).toContain('Changement de statut du ticket');
      expect(result.htmlContent).toContain('Test Ticket');
      expect(result.htmlContent).toContain('NEW');
      expect(result.htmlContent).toContain('IN_PROGRESS');
      expect(result.htmlContent).toContain('http://localhost:3000/tickets/ticket_123');
      expect(result.textContent).toContain('NEW');
      expect(result.textContent).toContain('IN_PROGRESS');
    });
  });

  describe('commentAdded', () => {
    it('should generate correct email content', () => {
      const ticket: Ticket = {
        id: 'ticket_123',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const comment: Comment = {
        id: 'comment_123',
        ticketId: 'ticket_123',
        content: 'This is a test comment',
        author: 'John Doe',
        createdAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      const result = EmailTemplates.commentAdded(ticket, comment);

      expect(result.subject).toBe('[CoTiTra] Nouveau commentaire : Test Ticket');
      expect(result.htmlContent).toContain('Nouveau commentaire sur le ticket');
      expect(result.htmlContent).toContain('Test Ticket');
      expect(result.htmlContent).toContain('John Doe');
      expect(result.htmlContent).toContain('This is a test comment');
      expect(result.htmlContent).toContain('http://localhost:3000/tickets/ticket_123');
      expect(result.textContent).toContain('John Doe');
      expect(result.textContent).toContain('This is a test comment');
    });

    it('should escape HTML in comment content', () => {
      const ticket: Ticket = {
        id: 'ticket_123',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const comment: Comment = {
        id: 'comment_123',
        ticketId: 'ticket_123',
        content: '<script>alert("XSS")</script>',
        author: 'John Doe',
        createdAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      const result = EmailTemplates.commentAdded(ticket, comment);

      expect(result.htmlContent).toContain('&lt;script&gt;');
      expect(result.htmlContent).not.toContain('<script>alert');
    });
  });
});
