import { Worker } from 'bullmq';
import { EMAIL_QUEUE_NAME } from '@/infrastructure/queue/BullMQEmailJobQueue';
import { GmailEmailService } from '@/infrastructure/services/GmailEmailService';
import { ResendEmailService } from '@/infrastructure/services/ResendEmailService';
import { logger } from '@/infrastructure/services/logger';

import { EmailData } from '@/domain/services/EmailData';

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error('REDIS_URL environment variable is not defined');
}

async function main() {
  const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';
  const emailService =
    emailProvider === 'resend' ? new ResendEmailService(logger) : new GmailEmailService(logger);

  const worker = new Worker<EmailData>(
    EMAIL_QUEUE_NAME,
    async job => {
      await emailService.send(job.data);
    },
    {
      connection: { url: REDIS_URL! },
    }
  );

  worker.on('completed', job => {
    logger.info('Email job completed', { jobId: job.id });
  });

  worker.on('failed', (job, err) => {
    logger.error('Email job failed', err, { jobId: job?.id });
  });

  logger.info('Email worker started');

  process.on('SIGTERM', async () => {
    logger.info('Email worker shutting down...');
    await worker.close();
    process.exit(0);
  });
}

main().catch(err => {
  logger.error('Worker startup failed', err);
  process.exit(1);
});
