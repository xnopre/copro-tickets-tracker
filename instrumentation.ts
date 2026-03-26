export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { resetInterruptedEmails, processPendingEmails } =
        await import('@/infrastructure/queue/pendingEmailProcessor');
      const { ServiceFactory } = await import('@/application/services/ServiceFactory');

      await resetInterruptedEmails();
      const emailService = ServiceFactory.getEmailService();
      await processPendingEmails(emailService);
    } catch (error) {
      console.error('Failed to process pending emails at startup:', error);
    }
  }
}
