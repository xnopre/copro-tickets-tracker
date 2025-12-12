import { describe, it, expect } from 'vitest';
import { CommentModel } from './CommentSchema';
import { useTestDB } from '../../../../tests/helpers/useTestDB';

describe('Comment Schema', () => {
  useTestDB();

  describe('Schema Validation', () => {
    it('should create a valid comment with all required fields', async () => {
      const commentData = {
        ticketId: '507f1f77bcf86cd799439011',
        content: 'Test comment content',
        author: 'Jean Dupont',
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment._id).toBeDefined();
      expect(savedComment.ticketId).toBe(commentData.ticketId);
      expect(savedComment.content).toBe(commentData.content);
      expect(savedComment.author).toBe(commentData.author);
      expect(savedComment.createdAt).toBeInstanceOf(Date);
      expect(savedComment.updatedAt).toBeUndefined();
    });

    it('should fail validation if ticketId is missing', async () => {
      const commentData = {
        content: 'Test comment',
        author: 'Jean Dupont',
      };

      const comment = new CommentModel(commentData);

      await expect(comment.save()).rejects.toThrow();
    });

    it('should fail validation if content is missing', async () => {
      const commentData = {
        ticketId: '507f1f77bcf86cd799439011',
        author: 'Jean Dupont',
      };

      const comment = new CommentModel(commentData);

      await expect(comment.save()).rejects.toThrow();
    });

    it('should fail validation if author is missing', async () => {
      const commentData = {
        ticketId: '507f1f77bcf86cd799439011',
        content: 'Test comment',
      };

      const comment = new CommentModel(commentData);

      await expect(comment.save()).rejects.toThrow();
    });

    it('should automatically trim the author field', async () => {
      const commentData = {
        ticketId: '507f1f77bcf86cd799439011',
        content: 'Test comment',
        author: '  Jean Dupont  ',
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment.author).toBe('Jean Dupont');
    });

    it('should preserve content without trimming', async () => {
      const commentData = {
        ticketId: '507f1f77bcf86cd799439011',
        content: '  Indented content  ',
        author: 'Jean Dupont',
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment.content).toBe('  Indented content  ');
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt timestamp', async () => {
      const commentData = {
        ticketId: '507f1f77bcf86cd799439011',
        content: 'Test comment',
        author: 'Jean Dupont',
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment.createdAt).toBeInstanceOf(Date);
      expect(savedComment.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should not have updatedAt timestamp', async () => {
      const commentData = {
        ticketId: '507f1f77bcf86cd799439011',
        content: 'Test comment',
        author: 'Jean Dupont',
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment.updatedAt).toBeUndefined();
    });
  });

  describe('TicketId Field', () => {
    it('should accept valid MongoDB ObjectId format', async () => {
      const validTicketIds = [
        '507f1f77bcf86cd799439011',
        '507f191e810c19729de860ea',
        '5f8d0d55b54764421b7156d9',
      ];

      for (const ticketId of validTicketIds) {
        const commentData = {
          ticketId,
          content: 'Test comment',
          author: 'Jean Dupont',
        };

        const comment = new CommentModel(commentData);
        const savedComment = await comment.save();

        expect(savedComment.ticketId).toBe(ticketId);
      }
    });

    it('should accept any string value as ticketId', async () => {
      const commentData = {
        ticketId: 'any-string-value',
        content: 'Test comment',
        author: 'Jean Dupont',
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment.ticketId).toBe('any-string-value');
    });
  });

  describe('Content Field', () => {
    it('should accept long content', async () => {
      const longContent = 'A'.repeat(1500);
      const commentData = {
        ticketId: '507f1f77bcf86cd799439011',
        content: longContent,
        author: 'Jean Dupont',
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment.content).toBe(longContent);
      expect(savedComment.content.length).toBe(1500);
    });

    it('should accept multiline content', async () => {
      const multilineContent = 'Line 1\nLine 2\nLine 3';
      const commentData = {
        ticketId: '507f1f77bcf86cd799439011',
        content: multilineContent,
        author: 'Jean Dupont',
      };

      const comment = new CommentModel(commentData);
      const savedComment = await comment.save();

      expect(savedComment.content).toBe(multilineContent);
    });
  });
});
