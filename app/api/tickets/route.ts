import { NextRequest, NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import { ValidationError } from '@/domain/errors/ValidationError';
import { logger } from '@/infrastructure/services/logger';
import { auth } from '@/auth';
import { CreateTicketSchema } from '@/infrastructure/api/schemas/ticket.schemas';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();

    const validation = CreateTicketSchema.safeParse(body);
    if (!validation.success) {
      const details = validation.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return NextResponse.json(
        {
          error: 'Données invalides',
          details,
        },
        { status: 400 }
      );
    }

    const ticketService = ServiceFactory.getTicketService();
    const ticket = await ticketService.createTicket(validation.data);

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    logger.error('Error creating ticket', error);

    return NextResponse.json({ error: 'Erreur lors de la création du ticket' }, { status: 500 });
  }
}
