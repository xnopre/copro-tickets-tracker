import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServiceFactory } from './ServiceFactory';
import { TicketService } from './TicketService';

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

describe('ServiceFactory', () => {
  beforeEach(() => {
    // Reset the singleton instance before each test
    (ServiceFactory as any).ticketService = null;
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
});
