import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GmailEmailService } from './GmailEmailService';
import { EmailServiceError } from '@/domain/errors/EmailServiceError';

const mockSendMail = vi.fn();

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: mockSendMail,
    })),
  },
}));

describe('GmailEmailService', () => {
  beforeEach(() => {
    vi.stubEnv('GMAIL_USER', 'test@gmail.com');
    vi.stubEnv('GMAIL_APP_PASSWORD', 'test_app_password');
    vi.stubEnv('FROM_EMAIL', 'noreply@test.com');
    mockSendMail.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('constructor', () => {
    it('should throw error if GMAIL_USER is missing', () => {
      vi.stubEnv('GMAIL_USER', '');

      expect(() => new GmailEmailService()).toThrow(
        "GMAIL_USER, GMAIL_APP_PASSWORD et FROM_EMAIL doivent être configurés dans les variables d'environnement"
      );
    });

    it('should throw error if GMAIL_APP_PASSWORD is missing', () => {
      vi.stubEnv('GMAIL_APP_PASSWORD', '');

      expect(() => new GmailEmailService()).toThrow(
        "GMAIL_USER, GMAIL_APP_PASSWORD et FROM_EMAIL doivent être configurés dans les variables d'environnement"
      );
    });

    it('should throw error if FROM_EMAIL is missing', () => {
      vi.stubEnv('FROM_EMAIL', '');

      expect(() => new GmailEmailService()).toThrow(
        "GMAIL_USER, GMAIL_APP_PASSWORD et FROM_EMAIL doivent être configurés dans les variables d'environnement"
      );
    });

    it('should create instance with valid environment variables', () => {
      expect(() => new GmailEmailService()).not.toThrow();
    });
  });

  describe('send', () => {
    it('should send email successfully', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'email_123' });

      const service = new GmailEmailService();

      await service.send({
        to: [{ email: 'user@test.com', name: 'Test User' }],
        subject: 'Test Email',
        htmlContent: '<p>Test</p>',
        textContent: 'Test',
      });

      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'noreply@test.com',
        to: ['user@test.com'],
        subject: 'Test Email',
        html: '<p>Test</p>',
        text: 'Test',
      });
    });

    it('should send email to multiple recipients', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'email_123' });

      const service = new GmailEmailService();

      await service.send({
        to: [
          { email: 'user1@test.com', name: 'User 1' },
          { email: 'user2@test.com', name: 'User 2' },
        ],
        subject: 'Test Email',
        htmlContent: '<p>Test</p>',
        textContent: 'Test',
      });

      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'noreply@test.com',
        to: ['user1@test.com', 'user2@test.com'],
        subject: 'Test Email',
        html: '<p>Test</p>',
        text: 'Test',
      });
    });

    it('should throw EmailServiceError on exception', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP Error'));

      const service = new GmailEmailService();

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
      ).rejects.toThrow("Échec d'envoi d'email: SMTP Error");
    });
  });

  describe('sendSafe', () => {
    it('should return true on sendSafe success', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'email_123' });

      const service = new GmailEmailService();

      const result = await service.sendSafe({
        to: [{ email: 'user@test.com', name: 'Test User' }],
        subject: 'Test Email',
        htmlContent: '<p>Test</p>',
        textContent: 'Test',
      });

      expect(result).toBe(true);
    });

    it('should return false on sendSafe failure without throwing', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP Error'));

      const service = new GmailEmailService();

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
