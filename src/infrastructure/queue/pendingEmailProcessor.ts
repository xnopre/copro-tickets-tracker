import { IEmailService } from '@/domain/services/IEmailService';
import { EmailData } from '@/domain/services/EmailData';
import { PendingEmailModel } from '@/infrastructure/database/schemas/PendingEmailSchema';
import connectDB from '@/infrastructure/database/mongodb';

export async function resetInterruptedEmails(): Promise<void> {
  await connectDB();
  await PendingEmailModel.updateMany({ status: 'processing' }, { status: 'pending' });
}

export async function processPendingEmails(
  emailService: IEmailService
): Promise<{ sent: number; failed: number }> {
  await connectDB();

  const pendingEmails = await PendingEmailModel.find({ status: 'pending' });

  let sent = 0;
  let failed = 0;

  for (const email of pendingEmails) {
    email.status = 'processing';
    await email.save();

    const emailData: EmailData = {
      to: email.to,
      subject: email.subject,
      htmlContent: email.htmlContent,
      textContent: email.textContent,
    };

    try {
      await emailService.send(emailData);
      email.status = 'sent';
      sent++;
    } catch (error) {
      email.status = 'failed';
      email.error = error instanceof Error ? error.message : 'Erreur inconnue';
      failed++;
    }

    email.attempts += 1;
    await email.save();
  }

  return { sent, failed };
}
