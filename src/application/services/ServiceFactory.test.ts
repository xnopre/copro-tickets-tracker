import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ServiceFactory } from './ServiceFactory';
import { TicketService } from './TicketService';
import { CommentService } from './CommentService';
import { GmailEmailService } from '@/infrastructure/services/GmailEmailService';
import { ResendEmailService } from '@/infrastructure/services/ResendEmailService';
import { MockEmailService } from '@/infrastructure/services/__mocks__/MockEmailService';

vi.mock('@/infrastructure/repositories/MongoTicketRepository', () => {
  return {
    MongoTicketRepository: class MockMongoTicketRepository {
      async findAll() {
        return [];
      }
      async create() {
        return {};
      }
    },
  };
});

vi.mock('@/infrastructure/repositories/MongoCommentRepository', () => {
  return {
    MongoCommentRepository: class MockMongoCommentRepository {
      async findByTicketId() {
        return [];
      }
      async create() {
        return {};
      }
    },
  };
});

vi.mock('@/infrastructure/repositories/MongoUserRepository', () => {
  return {
    MongoUserRepository: class MockMongoUserRepository {
      async findAll() {
        return [];
      }
      async findById() {
        return null;
      }
      async create() {
        return {};
      }
    },
  };
});

describe('ServiceFactory', () => {
  beforeEach(() => {
    // Reset the singleton instances before each test
    (ServiceFactory as any).ticketService = null;
    (ServiceFactory as any).commentService = null;
    (ServiceFactory as any).emailService = null;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('getTicketService', () => {
    it('should return a TicketService instance', () => {
      const service = ServiceFactory.getTicketService();

      expect(service).toBeInstanceOf(TicketService);
    });

    it('should return the same instance on multiple calls (singleton pattern)', () => {
      const service1 = ServiceFactory.getTicketService();
      const service2 = ServiceFactory.getTicketService();

      expect(service1).toBe(service2);
    });

    it('should have getAllTickets and createTicket methods', () => {
      const service = ServiceFactory.getTicketService();

      expect(service.getAllTickets).toBeDefined();
      expect(service.createTicket).toBeDefined();
      expect(typeof service.getAllTickets).toBe('function');
      expect(typeof service.createTicket).toBe('function');
    });
  });

  describe('getCommentService', () => {
    it('should return a CommentService instance', () => {
      const service = ServiceFactory.getCommentService();

      expect(service).toBeInstanceOf(CommentService);
    });

    it('should return the same instance on multiple calls (singleton pattern)', () => {
      const service1 = ServiceFactory.getCommentService();
      const service2 = ServiceFactory.getCommentService();

      expect(service1).toBe(service2);
    });

    it('should have getCommentsByTicketId and addComment methods', () => {
      const service = ServiceFactory.getCommentService();

      expect(service.getCommentsByTicketId).toBeDefined();
      expect(service.addComment).toBeDefined();
      expect(typeof service.getCommentsByTicketId).toBe('function');
      expect(typeof service.addComment).toBe('function');
    });
  });

  describe('getEmailService', () => {
    it('should return MockEmailService in test environment', () => {
      vi.stubEnv('NODE_ENV', 'test');

      const service = ServiceFactory.getEmailService();

      expect(service).toBeInstanceOf(MockEmailService);
    });

    it('should return GmailEmailService when EMAIL_PROVIDER is gmail', () => {
      vi.stubEnv('NODE_ENV', 'development');
      vi.stubEnv('EMAIL_PROVIDER', 'gmail');
      vi.stubEnv('GMAIL_USER', 'test@gmail.com');
      vi.stubEnv('GMAIL_APP_PASSWORD', 'test_password');
      vi.stubEnv('FROM_EMAIL', 'noreply@test.com');

      const service = ServiceFactory.getEmailService();

      expect(service).toBeInstanceOf(GmailEmailService);
    });

    it('should return ResendEmailService when EMAIL_PROVIDER is resend', () => {
      vi.stubEnv('NODE_ENV', 'development');
      vi.stubEnv('EMAIL_PROVIDER', 'resend');
      vi.stubEnv('RESEND_API_KEY', 'test_key');
      vi.stubEnv('FROM_EMAIL', 'noreply@test.com');

      const service = ServiceFactory.getEmailService();

      expect(service).toBeInstanceOf(ResendEmailService);
    });

    it('should default to ResendEmailService when EMAIL_PROVIDER is not set', () => {
      vi.stubEnv('NODE_ENV', 'development');
      vi.stubEnv('RESEND_API_KEY', 'test_key');
      vi.stubEnv('FROM_EMAIL', 'noreply@test.com');

      const service = ServiceFactory.getEmailService();

      expect(service).toBeInstanceOf(ResendEmailService);
    });

    it('should throw error when EMAIL_PROVIDER is invalid', () => {
      vi.stubEnv('NODE_ENV', 'development');
      vi.stubEnv('EMAIL_PROVIDER', 'invalid');

      expect(() => ServiceFactory.getEmailService()).toThrow(
        "EMAIL_PROVIDER invalide: invalid. Valeurs acceptées: 'gmail', 'resend'"
      );
    });
  });
});
