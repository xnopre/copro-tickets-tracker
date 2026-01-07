import { NextRequest, NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { ValidationError } from '@/domain/errors/ValidationError';
import { logger } from '@/infrastructure/services/logger';
import { auth } from '@/auth';
import { IdParamSchema, UpdateTicketSchema } from '@/infrastructure/api/schemas/ticket.schemas';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const validation = IdParamSchema.safeParse({ id });
  if (!validation.success) {
    return NextResponse.json({ error: 'ID de ticket invalide' }, { status: 400 });
  }

  try {
    const ticketService = ServiceFactory.getTicketService();
    const ticket = await ticketService.getTicketById(validation.data.id);

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    if (error instanceof InvalidIdError) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    logger.error('Error fetching ticket', error, { ticketId: id });

    return NextResponse.json(
      { error: 'Erreur lors de la récupération du ticket' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const idValidation = IdParamSchema.safeParse({ id });
  if (!idValidation.success) {
    return NextResponse.json({ error: 'ID de ticket invalide' }, { status: 400 });
  }

  try {
    const body = await request.json();

    const validation = UpdateTicketSchema.safeParse(body);
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
    const ticket = await ticketService.updateTicket(idValidation.data.id, validation.data);

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof InvalidIdError) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    logger.error('Error updating ticket', error, { ticketId: id });

    return NextResponse.json({ error: 'Erreur lors de la mise à jour du ticket' }, { status: 500 });
  }
}
