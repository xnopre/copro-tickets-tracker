import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServiceFactory } from './ServiceFactory';
import { TicketService } from './TicketService';
import { CommentService } from './CommentService';

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

describe('ServiceFactory', () => {
  beforeEach(() => {
    // Reset the singleton instances before each test
    (ServiceFactory as any).ticketService = null;
    (ServiceFactory as any).commentService = null;
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
});
