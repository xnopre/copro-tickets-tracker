import { IEmailJobQueue } from '@/domain/services/IEmailJobQueue';
import { EmailData } from '@/domain/services/EmailData';
import { PendingEmailModel } from '@/infrastructure/database/schemas/PendingEmailSchema';
import connectDB from '@/infrastructure/database/mongodb';

export class MongoEmailJobQueue implements IEmailJobQueue {
  async enqueue(data: EmailData): Promise<void> {
    await connectDB();
    await PendingEmailModel.create({
      to: data.to,
      subject: data.subject,
      htmlContent: data.htmlContent,
      textContent: data.textContent,
    });
  }
}
