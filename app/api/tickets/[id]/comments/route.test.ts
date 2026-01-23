import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { TicketModel } from '@/infrastructure/database/schemas/TicketSchema';
import { CommentModel } from '@/infrastructure/database/schemas/CommentSchema';
import UserModel from '@/infrastructure/database/schemas/UserSchema';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { useTestDB } from '@tests/helpers/useTestDB';
import { mockUser1, mockUser2 } from '@tests/helpers/mockUsers';

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
    const { id: _, ...mockUser } = mockUser1;
    const user = await UserModel.create({ ...mockUser });
    testUserId = user._id.toString();
    mockAuth.mockResolvedValue({
      user: { ...mockUser1, id: testUserId },
    } as any);
    const ticket = await TicketModel.create({
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
      createdBy: testUserId,
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
      const user2 = await UserModel.create(mockUser2);

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
      expect(data[0].author.firstName).toBe(mockUser1.firstName);
      expect(data[0].author.lastName).toBe(mockUser1.lastName);
      expect(data[1].content).toBe('Deuxième commentaire');
      expect(data[1].author.firstName).toBe(mockUser2.firstName);
      expect(data[1].author.lastName).toBe(mockUser2.lastName);
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
      expect(data.error).toBe('Données invalides');
      expect(data.details).toBeDefined();
      expect(data.details[0].field).toBe('id');
      expect(data.details[0].message).toContain('ObjectId');
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
      expect(data.author.firstName).toBe(mockUser1.firstName);
      expect(data.author.lastName).toBe(mockUser1.lastName);
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

    it('should return 400 when content exceeds 2000 characters', async () => {
      const request = createPostRequest(testTicketId, {
        content: 'A'.repeat(2001),
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
      expect(data.error).toBe('Données invalides');
      expect(data.details).toBeDefined();
      expect(data.details[0].field).toBe('id');
      expect(data.details[0].message).toContain('ObjectId');
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

// [2026-01-09T21:30:35.746Z] [ERROR] Error creating comment {"ticketId":"6961737b53686b48f0b63623","error":"Cast to ObjectId failed for value \"1\" (type string) at path \"_id\" for model \"User\"","stack":"CastError: Cast to ObjectId failed for value \"1\" (type string) at path \"_id\" for model \"User\"" +
// "    at SchemaObjectId.cast (/Users/xnopre/dev/copro-tickets-tracker/node_modules/mongoose/lib/schema/objectId.js:253:11)" +
// "    at SchemaObjectId.SchemaType.applySetters (/Users/xnopre/dev/copro-tickets-tracker/node_modules/mongoose/lib/schemaType.js:1280:12)" +
// "    at SchemaObjectId.SchemaType.castForQuery (/Users/xnopre/dev/copro-tickets-tracker/node_modules/mongoose/lib/schemaType.js:1706:17)" +
// "    at cast (/Users/xnopre/dev/copro-tickets-tracker/node_modules/mongoose/lib/cast.js:386:32)" +
// "    at model.Query.Query.cast (/Users/xnopre/dev/copro-tickets-tracker/node_modules/mongoose/lib/query.js:5025:12)" +
// "    at model.Query.Query._castConditions (/Users/xnopre/dev/copro-tickets-tracker/node_modules/mongoose/lib/query.js:2374:10)" +
// "    at model.Query._findOne (/Users/xnopre/dev/copro-tickets-tracker/node_modules/mongoose/lib/query.js:2704:8)" +
// "    at model.Query.exec (/Users/xnopre/dev/copro-tickets-tracker/node_modules/mongoose/lib/query.js:4637:80)" +
// "    at processTicksAndRejections (node:internal/process/task_queues:105:5)" +
// "    at MongoUserRepository.findById (/Users/xnopre/dev/copro-tickets-tracker/src/infrastructure/repositories/MongoUserRepository.ts:21:18)"}
