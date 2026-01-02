import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockEmailService } from './MockEmailService';
import { ILogger } from '@/domain/services/ILogger';
import { EmailData } from '@/domain/services/IEmailService';

describe('MockEmailService', () => {
  let service: MockEmailService;
  const mockLogger: ILogger = {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  };

  beforeEach(() => {
    service = new MockEmailService(mockLogger);
  });

  describe('send', () => {
    it('should store sent email', async () => {
      const emailData: EmailData = {
        to: [{ email: 'test@example.com', name: 'Test User' }],
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        textContent: 'Test Text',
      };

      await service.send(emailData);

      const sentEmails = service.getSentEmails();
      expect(sentEmails).toHaveLength(1);
      expect(sentEmails[0]).toEqual(emailData);
    });

    it('should store multiple sent emails', async () => {
      const email1: EmailData = {
        to: [{ email: 'test1@example.com', name: 'User 1' }],
        subject: 'Subject 1',
        htmlContent: '<p>HTML 1</p>',
        textContent: 'Text 1',
      };

      const email2: EmailData = {
        to: [{ email: 'test2@example.com', name: 'User 2' }],
        subject: 'Subject 2',
        htmlContent: '<p>HTML 2</p>',
        textContent: 'Text 2',
      };

      await service.send(email1);
      await service.send(email2);

      const sentEmails = service.getSentEmails();
      expect(sentEmails).toHaveLength(2);
      expect(sentEmails[0]).toEqual(email1);
      expect(sentEmails[1]).toEqual(email2);
    });
  });

  describe('sendSafe', () => {
    it('should return true on success', async () => {
      const emailData: EmailData = {
        to: [{ email: 'test@example.com', name: 'Test User' }],
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        textContent: 'Test Text',
      };

      const result = await service.sendSafe(emailData);

      expect(result).toBe(true);
      expect(service.getSentEmails()).toHaveLength(1);
    });
  });

  describe('clearSentEmails', () => {
    it('should clear all sent emails', async () => {
      const emailData: EmailData = {
        to: [{ email: 'test@example.com', name: 'Test User' }],
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        textContent: 'Test Text',
      };

      await service.send(emailData);
      expect(service.getSentEmails()).toHaveLength(1);

      service.clearSentEmails();
      expect(service.getSentEmails()).toHaveLength(0);
    });
  });

  describe('getSentEmails', () => {
    it('should return empty array initially', () => {
      expect(service.getSentEmails()).toEqual([]);
    });
  });
});
