import { NextRequest, NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import { ValidationError } from '@/domain/errors/ValidationError';
import { logger } from '@/infrastructure/services/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description } = body;

    const ticketService = ServiceFactory.getTicketService();
    const ticket = await ticketService.createTicket({ title, description });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    logger.error('Error creating ticket', error);

    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Erreur lors de la création du ticket' }, { status: 500 });
  }
}
