import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';
import { TicketModel } from '@/infrastructure/database/schemas/TicketSchema';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { useTestDB } from '../../../tests/helpers/useTestDB';

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: mockAuth,
}));

describe('POST /api/tickets', () => {
  useTestDB();

  beforeEach(() => {
    mockAuth.mockResolvedValue({ user: { id: '1', email: 'test@example.com' } } as any);
  });

  const createRequest = (body: unknown) => {
    return new NextRequest('http://localhost:3000/api/tickets', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  describe('Successful creation', () => {
    it('should create a ticket successfully', async () => {
      const request = createRequest({
        title: 'Test Ticket',
        description: 'Test Description',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.id).toBeDefined();
      expect(data.title).toBe('Test Ticket');
      expect(data.description).toBe('Test Description');
      expect(data.status).toBe(TicketStatus.NEW);
      expect(data.createdAt).toBeDefined();
      expect(data.updatedAt).toBeDefined();

      // Verify ticket was saved in database
      const ticketsInDb = await TicketModel.find();
      expect(ticketsInDb).toHaveLength(1);
      expect(ticketsInDb[0].title).toBe('Test Ticket');
    });

    it('should trim title and description before saving', async () => {
      const request = createRequest({
        title: '  Spaced Title  ',
        description: '  Spaced Description  ',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe('Spaced Title');
      expect(data.description).toBe('Spaced Description');
    });

    it('should accept title with exactly 200 characters', async () => {
      const title = 'A'.repeat(200);
      const request = createRequest({ title, description: 'Test description' });

      const response = await POST(request);

      expect(response.status).toBe(201);

      const ticketsInDb = await TicketModel.find();
      expect(ticketsInDb[0].title).toBe(title);
    });

    it('should accept description with exactly 5000 characters', async () => {
      const description = 'A'.repeat(5000);
      const request = createRequest({ title: 'Test title', description });

      const response = await POST(request);

      expect(response.status).toBe(201);

      const ticketsInDb = await TicketModel.find();
      expect(ticketsInDb[0].description).toBe(description);
    });
  });

  describe('Title validation', () => {
    it('should return 400 when title is missing', async () => {
      const request = createRequest({ description: 'Test description' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('title');
      expect(data.details[0].message).toBe('Le titre est requis');

      const ticketsInDb = await TicketModel.find();
      expect(ticketsInDb).toHaveLength(0);
    });

    it('should return 400 when title is not a string', async () => {
      const request = createRequest({ title: 123, description: 'Test description' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('title');
    });

    it('should return 400 when title is only whitespace', async () => {
      const request = createRequest({ title: '   ', description: 'Test description' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('title');
      expect(data.details[0].message).toBe('Le titre est requis');
    });

    it('should return 400 when title exceeds 200 characters', async () => {
      const longTitle = 'A'.repeat(201);
      const request = createRequest({ title: longTitle, description: 'Test description' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('title');
      expect(data.details[0].message).toBe('Le titre ne doit pas dépasser 200 caractères');

      const ticketsInDb = await TicketModel.find();
      expect(ticketsInDb).toHaveLength(0);
    });
  });

  describe('Description validation', () => {
    it('should return 400 when description is missing', async () => {
      const request = createRequest({ title: 'Test title' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('description');
      expect(data.details[0].message).toBe('La description est requise');

      const ticketsInDb = await TicketModel.find();
      expect(ticketsInDb).toHaveLength(0);
    });

    it('should return 400 when description is not a string', async () => {
      const request = createRequest({ title: 'Test title', description: 123 });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('description');
    });

    it('should return 400 when description is empty string', async () => {
      const request = createRequest({ title: 'Test title', description: '' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('description');
      expect(data.details[0].message).toBe('La description est requise');
    });

    it('should return 400 when description is only whitespace', async () => {
      const request = createRequest({ title: 'Test title', description: '   ' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('description');
      expect(data.details[0].message).toBe('La description est requise');
    });

    it('should return 400 when description exceeds 5000 characters', async () => {
      const longDescription = 'A'.repeat(5001);
      const request = createRequest({ title: 'Test title', description: longDescription });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('description');
      expect(data.details[0].message).toBe('La description ne doit pas dépasser 5000 caractères');

      const ticketsInDb = await TicketModel.find();
      expect(ticketsInDb).toHaveLength(0);
    });

    it('should return 400 when both title and description are invalid', async () => {
      const request = createRequest({ title: '', description: '' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(2);
    });
  });
});
