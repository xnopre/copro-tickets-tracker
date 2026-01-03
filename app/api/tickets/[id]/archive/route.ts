import { NextRequest, NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { logger } from '@/infrastructure/services/logger';
import { auth } from '@/auth';

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const ticketService = ServiceFactory.getTicketService();
    const ticket = await ticketService.archiveTicket(id);

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    if (error instanceof InvalidIdError) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    logger.error('Error archiving ticket', error, { ticketId: id });

    return NextResponse.json({ error: "Erreur lors de l'archivage du ticket" }, { status: 500 });
  }
}
