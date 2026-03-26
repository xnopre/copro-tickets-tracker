import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';

const { mockResetInterruptedEmails, mockProcessPendingEmails, mockGetEmailService } = vi.hoisted(
  () => ({
    mockResetInterruptedEmails: vi.fn(),
    mockProcessPendingEmails: vi.fn(),
    mockGetEmailService: vi.fn(),
  })
);

vi.mock('@/infrastructure/queue/pendingEmailProcessor', () => ({
  resetInterruptedEmails: mockResetInterruptedEmails,
  processPendingEmails: mockProcessPendingEmails,
}));

vi.mock('@/application/services/ServiceFactory', () => ({
  ServiceFactory: {
    getEmailService: mockGetEmailService,
  },
}));

describe('POST /api/process-emails', () => {
  const mockEmailService = { send: vi.fn(), sendSafe: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetEmailService.mockReturnValue(mockEmailService);
    mockResetInterruptedEmails.mockResolvedValue(undefined);
  });

  it('should reset interrupted emails before processing', async () => {
    mockProcessPendingEmails.mockResolvedValue({ sent: 0, failed: 0 });

    await POST();

    expect(mockResetInterruptedEmails).toHaveBeenCalledOnce();
  });

  it('should return sent and failed counts', async () => {
    mockProcessPendingEmails.mockResolvedValue({ sent: 3, failed: 1 });

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ sent: 3, failed: 1 });
  });

  it('should call processPendingEmails with the email service', async () => {
    mockProcessPendingEmails.mockResolvedValue({ sent: 0, failed: 0 });

    await POST();

    expect(mockProcessPendingEmails).toHaveBeenCalledWith(mockEmailService);
  });
});
