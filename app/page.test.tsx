import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TicketModel } from '@/lib/models/Ticket';
import { TicketStatus } from '@/types/ticket';
import { setupTestDB, teardownTestDB, clearDatabase } from '@/tests/helpers/db-setup';

describe('Home Page', () => {
  describe('getTickets function', () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
      mongoServer = await setupTestDB();
      process.env.MONGODB_URI = mongoServer.getUri();
      vi.resetModules();
    });

    afterAll(async () => {
      await teardownTestDB(mongoServer);
    });

    beforeEach(async () => {
      await clearDatabase();
    });

    it('should retrieve and format tickets correctly', async () => {
      await TicketModel.create({
        title: 'Ticket 1',
        description: 'Description 1',
        status: TicketStatus.NEW,
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      await TicketModel.create({
        title: 'Ticket 2',
        description: 'Description 2',
        status: TicketStatus.IN_PROGRESS,
      });

      const { getTickets } = await import('./page');
      const tickets = await getTickets();

      expect(tickets).toHaveLength(2);
      expect(tickets[0]).toMatchObject({
        title: 'Ticket 2',
        description: 'Description 2',
        status: TicketStatus.IN_PROGRESS,
      });
      expect(tickets[0].id).toBeDefined();
      expect(tickets[0].createdAt).toBeInstanceOf(Date);
      expect(tickets[0].updatedAt).toBeInstanceOf(Date);
    });

    it('should return empty array if database is empty', async () => {
      const { getTickets } = await import('./page');
      const tickets = await getTickets();

      expect(tickets).toEqual([]);
    });
  });

  describe('Home component rendering', () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
      mongoServer = await setupTestDB();
      process.env.MONGODB_URI = mongoServer.getUri();
    });

    afterAll(async () => {
      await teardownTestDB(mongoServer);
    });

    it('should display the title "CoTiTra"', async () => {
      const Home = (await import('./page')).default;
      const jsx = await Home();
      render(jsx);

      expect(screen.getByText('CoTiTra')).toBeDefined();
      expect(screen.getByText('Copro Tickets Tracker')).toBeDefined();
    });
  });
});
