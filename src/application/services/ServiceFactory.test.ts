import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ServiceFactory } from './ServiceFactory';
import { TicketService } from './TicketService';
import { CommentService } from './CommentService';
import { MongoEmailJobQueue } from '@/infrastructure/queue/MongoEmailJobQueue';
import { MockEmailJobQueue } from '@/infrastructure/queue/__mocks__/MockEmailJobQueue';

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
      async findByEmail() {
        return null;
      }
      async create() {
        return {};
      }
    },
  };
});

vi.mock('@/infrastructure/queue/MongoEmailJobQueue', () => {
  return {
    MongoEmailJobQueue: vi.fn(),
  };
});

describe('ServiceFactory', () => {
  beforeEach(() => {
    (ServiceFactory as any).ticketService = null;
    (ServiceFactory as any).commentService = null;
    (ServiceFactory as any).authService = null;
    (ServiceFactory as any).emailJobQueue = null;
    (ServiceFactory as any).emailServiceInstance = null;
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

  describe('getAuthService', () => {
    it('should return an AuthService instance', () => {
      const service = ServiceFactory.getAuthService();

      expect(service).toBeDefined();
      expect(service.validateCredentials).toBeDefined();
      expect(typeof service.validateCredentials).toBe('function');
    });

    it('should return the same instance on multiple calls (singleton pattern)', () => {
      const service1 = ServiceFactory.getAuthService();
      const service2 = ServiceFactory.getAuthService();

      expect(service1).toBe(service2);
    });
  });

  describe('getEmailJobQueue', () => {
    it('should return MockEmailJobQueue in test environment', () => {
      vi.stubEnv('NODE_ENV', 'test');

      const queue = ServiceFactory.getEmailJobQueue();

      expect(queue).toBeInstanceOf(MockEmailJobQueue);
    });

    it('should return MongoEmailJobQueue when not in test environment', () => {
      vi.stubEnv('NODE_ENV', 'development');

      const queue = ServiceFactory.getEmailJobQueue();

      expect(MongoEmailJobQueue).toHaveBeenCalled();
      expect(queue).toBeDefined();
    });
  });
});
