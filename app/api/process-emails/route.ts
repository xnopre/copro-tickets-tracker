import { NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import {
  resetInterruptedEmails,
  processPendingEmails,
} from '@/infrastructure/queue/pendingEmailProcessor';

export async function POST() {
  try {
    await resetInterruptedEmails();
    const result = await processPendingEmails(ServiceFactory.getEmailService());
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Email processing failed' }, { status: 500 });
  }
}
