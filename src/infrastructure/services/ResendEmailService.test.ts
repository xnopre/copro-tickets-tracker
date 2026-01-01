import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ResendEmailService } from './ResendEmailService';
import { EmailServiceError } from '@/domain/errors/EmailServiceError';

const mockSend = vi.fn();

vi.mock('resend', () => {
  return {
    Resend: class MockResend {
      emails = {
        send: mockSend,
      };
    },
  };
});

describe('ResendEmailService', () => {
  beforeEach(() => {
    vi.stubEnv('RESEND_API_KEY', 'test_api_key');
    vi.stubEnv('FROM_EMAIL', 'noreply@test.com');
    mockSend.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('constructor', () => {
    it('should throw error if RESEND_API_KEY is missing', () => {
      vi.stubEnv('RESEND_API_KEY', '');

      expect(() => new ResendEmailService()).toThrow(
        "RESEND_API_KEY et FROM_EMAIL doivent être configurés dans les variables d'environnement"
      );
    });

    it('should throw error if FROM_EMAIL is missing', () => {
      vi.stubEnv('FROM_EMAIL', '');

      expect(() => new ResendEmailService()).toThrow(
        "RESEND_API_KEY et FROM_EMAIL doivent être configurés dans les variables d'environnement"
      );
    });

    it('should create instance with valid environment variables', () => {
      expect(() => new ResendEmailService()).not.toThrow();
    });
  });

  describe('send', () => {
    it('should send email successfully', async () => {
      mockSend.mockResolvedValue({ id: 'email_123' });

      const service = new ResendEmailService();

      await service.send({
        to: [{ email: 'user@test.com', name: 'Test User' }],
        subject: 'Test Email',
        htmlContent: '<p>Test</p>',
        textContent: 'Test',
      });

      expect(mockSend).toHaveBeenCalledWith({
        from: 'noreply@test.com',
        to: ['user@test.com'],
        subject: 'Test Email',
        html: '<p>Test</p>',
        text: 'Test',
      });
    });

    it('should send email to multiple recipients', async () => {
      mockSend.mockResolvedValue({ id: 'email_123' });

      const service = new ResendEmailService();

      await service.send({
        to: [
          { email: 'user1@test.com', name: 'User 1' },
          { email: 'user2@test.com', name: 'User 2' },
        ],
        subject: 'Test Email',
        htmlContent: '<p>Test</p>',
        textContent: 'Test',
      });

      expect(mockSend).toHaveBeenCalledWith({
        from: 'noreply@test.com',
        to: ['user1@test.com', 'user2@test.com'],
        subject: 'Test Email',
        html: '<p>Test</p>',
        text: 'Test',
      });
    });

    it('should throw EmailServiceError on send failure', async () => {
      mockSend.mockRejectedValue(new Error('API Error'));

      const service = new ResendEmailService();

      await expect(
        service.send({
          to: [{ email: 'user@test.com', name: 'Test User' }],
          subject: 'Test Email',
          htmlContent: '<p>Test</p>',
          textContent: 'Test',
        })
      ).rejects.toThrow(EmailServiceError);

      await expect(
        service.send({
          to: [{ email: 'user@test.com', name: 'Test User' }],
          subject: 'Test Email',
          htmlContent: '<p>Test</p>',
          textContent: 'Test',
        })
      ).rejects.toThrow("Échec d'envoi d'email: API Error");
    });
  });

  describe('sendSafe', () => {
    it('should return true on sendSafe success', async () => {
      mockSend.mockResolvedValue({ id: 'email_123' });

      const service = new ResendEmailService();

      const result = await service.sendSafe({
        to: [{ email: 'user@test.com', name: 'Test User' }],
        subject: 'Test Email',
        htmlContent: '<p>Test</p>',
        textContent: 'Test',
      });

      expect(result).toBe(true);
    });

    it('should return false on sendSafe failure without throwing', async () => {
      mockSend.mockRejectedValue(new Error('API Error'));

      const service = new ResendEmailService();

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await service.sendSafe({
        to: [{ email: 'user@test.com', name: 'Test User' }],
        subject: 'Test Email',
        htmlContent: '<p>Test</p>',
        textContent: 'Test',
      });

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
