import { NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import {
  resetInterruptedEmails,
  processPendingEmails,
} from '@/infrastructure/queue/pendingEmailProcessor';

export async function POST() {
  await resetInterruptedEmails();
  const emailService = ServiceFactory.getEmailService();
  const result = await processPendingEmails(emailService);
  return NextResponse.json(result);
}
