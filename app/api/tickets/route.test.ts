import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import { TicketStatus } from '@/types/ticket';

vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/lib/models/Ticket', () => ({
  TicketModel: {
    create: vi.fn(),
  },
}));

import { TicketModel } from '@/lib/models/Ticket';
const mockCreate = TicketModel.create as ReturnType<typeof vi.fn>;

describe('POST /api/tickets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  describe('Title validation', () => {
    it('should return 400 when title is missing', async () => {
      const request = createRequest({ description: 'Test description' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Le titre est requis');
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should return 400 when title is not a string', async () => {
      const request = createRequest({ title: 123, description: 'Test description' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Le titre est requis');
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should return 400 when title is empty string', async () => {
      const request = createRequest({ title: '', description: 'Test description' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Le titre est requis');
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should return 400 when title is only whitespace', async () => {
      const request = createRequest({ title: '   ', description: 'Test description' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Le titre est requis');
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should return 400 when title exceeds 200 characters', async () => {
      const longTitle = 'A'.repeat(201);
      const request = createRequest({ title: longTitle, description: 'Test description' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Le titre ne doit pas dépasser 200 caractères');
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should accept title with exactly 200 characters', async () => {
      const title = 'A'.repeat(200);
      const request = createRequest({ title, description: 'Test description' });

      mockCreate.mockResolvedValue({
        _id: '123',
        title: title.trim(),
        description: 'Test description',
        status: TicketStatus.NEW,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  describe('Description validation', () => {
    it('should return 400 when description is missing', async () => {
      const request = createRequest({ title: 'Test title' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('La description est requise');
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should return 400 when description is not a string', async () => {
      const request = createRequest({ title: 'Test title', description: 123 });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('La description est requise');
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should return 400 when description is empty string', async () => {
      const request = createRequest({ title: 'Test title', description: '' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('La description est requise');
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should return 400 when description is only whitespace', async () => {
      const request = createRequest({ title: 'Test title', description: '   ' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('La description est requise');
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should return 400 when description exceeds 5000 characters', async () => {
      const longDescription = 'A'.repeat(5001);
      const request = createRequest({ title: 'Test title', description: longDescription });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('La description ne doit pas dépasser 5000 caractères');
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should accept description with exactly 5000 characters', async () => {
      const description = 'A'.repeat(5000);
      const request = createRequest({ title: 'Test title', description });

      mockCreate.mockResolvedValue({
        _id: '123',
        title: 'Test title',
        description: description.trim(),
        status: TicketStatus.NEW,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  describe('Successful ticket creation', () => {
    it('should create ticket with valid data', async () => {
      const title = 'Test ticket';
      const description = 'This is a test ticket description';
      const now = new Date();
      const createdTicket = {
        _id: '123',
        title,
        description,
        status: TicketStatus.NEW,
        createdAt: now,
        updatedAt: now,
      };

      mockCreate.mockResolvedValue(createdTicket);

      const request = createRequest({ title, description });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(mockCreate).toHaveBeenCalledWith({
        title: title.trim(),
        description: description.trim(),
        status: TicketStatus.NEW,
      });
      expect(data).toEqual({
        id: '123',
        title,
        description,
        status: TicketStatus.NEW,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
    });

    it('should trim title and description before saving', async () => {
      const title = '  Test ticket  ';
      const description = '  Test description  ';
      const createdTicket = {
        _id: '123',
        title: title.trim(),
        description: description.trim(),
        status: TicketStatus.NEW,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreate.mockResolvedValue(createdTicket);

      const request = createRequest({ title, description });
      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(mockCreate).toHaveBeenCalledWith({
        title: 'Test ticket',
        description: 'Test description',
        status: TicketStatus.NEW,
      });
    });
  });

  describe('Error handling', () => {
    it('should return 500 when database operation fails', async () => {
      mockCreate.mockRejectedValue(new Error('Database error'));

      const request = createRequest({ title: 'Test title', description: 'Test description' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Erreur lors de la création du ticket');
    });
  });
});
