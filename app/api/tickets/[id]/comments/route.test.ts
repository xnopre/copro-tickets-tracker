import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { TicketModel } from '@/infrastructure/database/schemas/TicketSchema';
import { CommentModel } from '@/infrastructure/database/schemas/CommentSchema';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { useTestDB } from '../../../../../tests/helpers/useTestDB';

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: mockAuth,
}));

describe('Comment API Routes', () => {
  useTestDB();

  let testTicketId: string;

  beforeEach(async () => {
    mockAuth.mockResolvedValue({ user: { id: '1', email: 'test@example.com' } } as any);
    const ticket = await TicketModel.create({
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
    });
    testTicketId = ticket._id.toString();
  });

  describe('GET /api/tickets/[id]/comments', () => {
    const createGetRequest = (id: string) => {
      return new NextRequest(`http://localhost:3000/api/tickets/${id}/comments`, {
        method: 'GET',
      });
    };

    it('should get all comments for a ticket', async () => {
      await CommentModel.create({
        ticketId: testTicketId,
        content: 'Premier commentaire',
        author: 'Jean Martin',
      });
      await CommentModel.create({
        ticketId: testTicketId,
        content: 'Deuxième commentaire',
        author: 'Marie Dubois',
      });

      const request = createGetRequest(testTicketId);
      const response = await GET(request, {
        params: Promise.resolve({ id: testTicketId }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].content).toBe('Premier commentaire');
      expect(data[0].author).toBe('Jean Martin');
      expect(data[1].content).toBe('Deuxième commentaire');
      expect(data[1].author).toBe('Marie Dubois');
    });

    it('should return empty array when no comments', async () => {
      const request = createGetRequest(testTicketId);
      const response = await GET(request, {
        params: Promise.resolve({ id: testTicketId }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('should return 400 for invalid ticket ID', async () => {
      const request = createGetRequest('invalid-id');
      const response = await GET(request, {
        params: Promise.resolve({ id: 'invalid-id' }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('ID de ticket invalide');
    });
  });

  describe('POST /api/tickets/[id]/comments', () => {
    const createPostRequest = (id: string, body: unknown) => {
      return new NextRequest(`http://localhost:3000/api/tickets/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    };

    it('should create a comment successfully', async () => {
      const request = createPostRequest(testTicketId, {
        content: 'Nouveau commentaire',
        author: 'Jean Martin',
      });

      const response = await POST(request, {
        params: Promise.resolve({ id: testTicketId }),
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.id).toBeDefined();
      expect(data.ticketId).toBe(testTicketId);
      expect(data.content).toBe('Nouveau commentaire');
      expect(data.author).toBe('Jean Martin');
      expect(data.createdAt).toBeDefined();

      const commentsInDb = await CommentModel.find({ ticketId: testTicketId });
      expect(commentsInDb).toHaveLength(1);
      expect(commentsInDb[0].content).toBe('Nouveau commentaire');
    });

    it('should trim content and author', async () => {
      const request = createPostRequest(testTicketId, {
        content: '  Commentaire avec espaces  ',
        author: '  Jean Martin  ',
      });

      const response = await POST(request, {
        params: Promise.resolve({ id: testTicketId }),
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.content).toBe('Commentaire avec espaces');
      expect(data.author).toBe('Jean Martin');
    });

    it('should return 400 when content is empty', async () => {
      const request = createPostRequest(testTicketId, {
        content: '',
        author: 'Jean Martin',
      });

      const response = await POST(request, {
        params: Promise.resolve({ id: testTicketId }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Le contenu du commentaire est requis');
    });

    it('should return 400 when author is empty', async () => {
      const request = createPostRequest(testTicketId, {
        content: 'Test comment',
        author: '',
      });

      const response = await POST(request, {
        params: Promise.resolve({ id: testTicketId }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("L'auteur du commentaire est requis");
    });

    it('should return 400 when content exceeds 2000 characters', async () => {
      const request = createPostRequest(testTicketId, {
        content: 'A'.repeat(2001),
        author: 'Jean Martin',
      });

      const response = await POST(request, {
        params: Promise.resolve({ id: testTicketId }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Le commentaire ne doit pas dépasser 2000 caractères');
    });

    it('should return 400 when author exceeds 100 characters', async () => {
      const request = createPostRequest(testTicketId, {
        content: 'Test comment',
        author: 'A'.repeat(101),
      });

      const response = await POST(request, {
        params: Promise.resolve({ id: testTicketId }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("L'auteur ne doit pas dépasser 100 caractères");
    });

    it('should return 400 for invalid ticket ID', async () => {
      const request = createPostRequest('invalid-id', {
        content: 'Test comment',
        author: 'Jean Martin',
      });

      const response = await POST(request, {
        params: Promise.resolve({ id: 'invalid-id' }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('ID de ticket invalide');
    });
  });
});
