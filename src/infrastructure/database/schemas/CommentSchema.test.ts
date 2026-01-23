import { describe, it, expect, beforeEach } from 'vitest';
import { CommentModel } from './CommentSchema';
import UserModel from './UserSchema';
import { useTestDB } from '@tests/helpers/useTestDB';
import { Types } from 'mongoose';
import { mockUser1 } from '@tests/helpers/mockUsers';

describe('Comment Schema', () => {
  useTestDB();

  let testUserId: Types.ObjectId;

  beforeEach(async () => {
    const user = await UserModel.create({
      firstName: mockUser1.firstName,
      lastName: mockUser1.lastName,
      email: mockUser1.email,
      password: mockUser1.password,
    });
    testUserId = user._id;
  });

  describe('Schema Validation', () => {
    it('should create a valid comment with all required fields', async () => {
      const commentData = {
        ticketId: new Types.ObjectId(),
        content: 'Test comment content',
        authorId: testUserId,
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment._id).toBeDefined();
      expect(savedComment.ticketId).toBe(commentData.ticketId);
      expect(savedComment.content).toBe(commentData.content);
      expect(savedComment.authorId.toString()).toBe(testUserId.toString());
      expect(savedComment.createdAt).toBeInstanceOf(Date);
      expect(savedComment.updatedAt).toBeUndefined();
    });

    it('should fail validation if ticketId is missing', async () => {
      const commentData = {
        content: 'Test comment',
        authorId: testUserId,
      };

      const comment = new CommentModel(commentData);

      await expect(comment.save()).rejects.toThrow();
    });

    it('should fail validation if content is missing', async () => {
      const commentData = {
        ticketId: new Types.ObjectId(),
        authorId: testUserId,
      };

      const comment = new CommentModel(commentData);

      await expect(comment.save()).rejects.toThrow();
    });

    it('should fail validation if authorId is missing', async () => {
      const commentData = {
        ticketId: new Types.ObjectId(),
        content: 'Test comment',
      };

      const comment = new CommentModel(commentData);

      await expect(comment.save()).rejects.toThrow();
    });

    it('should properly store and retrieve authorId', async () => {
      const commentData = {
        ticketId: new Types.ObjectId(),
        content: 'Test comment',
        authorId: testUserId,
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment.authorId.toString()).toBe(testUserId.toString());
    });

    it('should automatically trim the content field', async () => {
      const commentData = {
        ticketId: new Types.ObjectId(),
        content: '  Indented content  ',
        authorId: testUserId,
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment.content).toBe('Indented content');
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt timestamp', async () => {
      const commentData = {
        ticketId: new Types.ObjectId(),
        content: 'Test comment',
        authorId: testUserId,
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment.createdAt).toBeInstanceOf(Date);
      expect(savedComment.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should not have updatedAt timestamp', async () => {
      const commentData = {
        ticketId: new Types.ObjectId(),
        content: 'Test comment',
        authorId: testUserId,
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment.updatedAt).toBeUndefined();
    });
  });

  describe('TicketId Field', () => {
    it('should accept valid MongoDB ObjectId format', async () => {
      const validTicketIds = [new Types.ObjectId(), new Types.ObjectId(), new Types.ObjectId()];

      for (const ticketId of validTicketIds) {
        const commentData = {
          ticketId,
          content: 'Test comment',
          authorId: testUserId,
        };

        const comment = new CommentModel(commentData);
        const savedComment = await comment.save();

        expect(savedComment.ticketId).toBe(ticketId);
      }
    });
  });

  describe('Content Field', () => {
    it('should accept long content', async () => {
      const longContent = 'A'.repeat(1500);
      const commentData = {
        ticketId: new Types.ObjectId(),
        content: longContent,
        authorId: testUserId,
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment.content).toBe(longContent);
      expect(savedComment.content.length).toBe(1500);
    });

    it('should accept multiline content', async () => {
      const multilineContent = 'Line 1\nLine 2\nLine 3';
      const commentData = {
        ticketId: new Types.ObjectId(),
        content: multilineContent,
        authorId: testUserId,
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment.content).toBe(multilineContent);
    });

    it('should fail validation if content exceeds 2000 characters', async () => {
      const tooLongContent = 'A'.repeat(2001);
      const commentData = {
        ticketId: new Types.ObjectId(),
        content: tooLongContent,
        authorId: testUserId,
      };

      const comment = new CommentModel(commentData);

      await expect(comment.save()).rejects.toThrow();
    });

    it('should accept content with exactly 2000 characters', async () => {
      const maxContent = 'A'.repeat(2000);
      const commentData = {
        ticketId: new Types.ObjectId(),
        content: maxContent,
        authorId: testUserId,
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment.content).toBe(maxContent);
      expect(savedComment.content.length).toBe(2000);
    });
  });

  describe('AuthorId Field', () => {
    it('should accept valid user ObjectId as authorId', async () => {
      const commentData = {
        ticketId: new Types.ObjectId(),
        content: 'Test comment',
        authorId: testUserId,
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment.authorId).toBeDefined();
      expect(savedComment.authorId.toString()).toBe(testUserId.toString());
    });

    it('should reference a valid user document', async () => {
      const commentData = {
        ticketId: new Types.ObjectId(),
        content: 'Test comment',
        authorId: testUserId,
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      const populatedComment = await CommentModel.findById(savedComment._id).populate('authorId');
      expect(populatedComment).toBeDefined();
      expect(populatedComment?.authorId).toBeDefined();
    });
  });
});
