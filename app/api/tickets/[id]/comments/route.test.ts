import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { TicketModel } from '@/infrastructure/database/schemas/TicketSchema';
import { CommentModel } from '@/infrastructure/database/schemas/CommentSchema';
import UserModel from '@/infrastructure/database/schemas/UserSchema';
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
  let testUserId: string;

  beforeEach(async () => {
    const user = await UserModel.create({
      firstName: 'Jean',
      lastName: 'Martin',
      email: 'jean@example.com',
      password: 'password123',
    });
    testUserId = user._id.toString();
    mockAuth.mockResolvedValue({
      user: { id: testUserId, email: 'jean@example.com', firstName: 'Jean', lastName: 'Martin' },
    } as any);
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

    it('should get all comments for a ticket with populated author', async () => {
      const user2 = await UserModel.create({
        firstName: 'Marie',
        lastName: 'Dubois',
        email: 'marie@example.com',
        password: 'password123',
      });

      await CommentModel.create({
        ticketId: testTicketId,
        content: 'Premier commentaire',
        authorId: testUserId,
      });
      await CommentModel.create({
        ticketId: testTicketId,
        content: 'Deuxième commentaire',
        authorId: user2._id,
      });

      const request = createGetRequest(testTicketId);
      const response = await GET(request, {
        params: Promise.resolve({ id: testTicketId }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].content).toBe('Premier commentaire');
      expect(data[0].author.firstName).toBe('Jean');
      expect(data[0].author.lastName).toBe('Martin');
      expect(data[1].content).toBe('Deuxième commentaire');
      expect(data[1].author.firstName).toBe('Marie');
      expect(data[1].author.lastName).toBe('Dubois');
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

    it('should create a comment successfully with authorId from session', async () => {
      const request = createPostRequest(testTicketId, {
        content: 'Nouveau commentaire',
      });

      const response = await POST(request, {
        params: Promise.resolve({ id: testTicketId }),
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.id).toBeDefined();
      expect(data.ticketId).toBe(testTicketId);
      expect(data.content).toBe('Nouveau commentaire');
      expect(data.author).toBeDefined();
      expect(data.author.firstName).toBe('Jean');
      expect(data.author.lastName).toBe('Martin');
      expect(data.createdAt).toBeDefined();

      const commentsInDb = await CommentModel.find({ ticketId: testTicketId });
      expect(commentsInDb).toHaveLength(1);
      expect(commentsInDb[0].content).toBe('Nouveau commentaire');
      expect(commentsInDb[0].authorId.toString()).toBe(testUserId);
    });

    it('should trim content', async () => {
      const request = createPostRequest(testTicketId, {
        content: '  Commentaire avec espaces  ',
      });

      const response = await POST(request, {
        params: Promise.resolve({ id: testTicketId }),
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.content).toBe('Commentaire avec espaces');
    });

    it('should return 400 when content is only whitespace', async () => {
      const request = createPostRequest(testTicketId, {
        content: '   ',
      });

      const response = await POST(request, {
        params: Promise.resolve({ id: testTicketId }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('content');
      expect(data.details[0].message).toBe('Le contenu est requis');
    });

    it('should return 400 when content exceeds 5000 characters', async () => {
      const request = createPostRequest(testTicketId, {
        content: 'A'.repeat(5001),
      });

      const response = await POST(request, {
        params: Promise.resolve({ id: testTicketId }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('content');
      expect(data.details[0].message).toBe('Le contenu ne doit pas dépasser 2000 caractères');
    });

    it('should return 400 when missing content field', async () => {
      const request = createPostRequest(testTicketId, {});

      const response = await POST(request, {
        params: Promise.resolve({ id: testTicketId }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('content');
    });

    it('should return 400 for invalid ticket ID', async () => {
      const request = createPostRequest('invalid-id', {
        content: 'Test comment',
      });

      const response = await POST(request, {
        params: Promise.resolve({ id: 'invalid-id' }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('ID de ticket invalide');
    });

    it('should return 401 when not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null);

      const request = createPostRequest(testTicketId, {
        content: 'Test comment',
      });

      const response = await POST(request, {
        params: Promise.resolve({ id: testTicketId }),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });
});
