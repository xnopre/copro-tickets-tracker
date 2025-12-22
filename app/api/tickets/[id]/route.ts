import { NextRequest, NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { ValidationError } from '@/domain/errors/ValidationError';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const ticketService = ServiceFactory.getTicketService();
    const ticket = await ticketService.getTicketById(id);

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    if (error instanceof InvalidIdError) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    console.error(
      'Error fetching ticket with ID:',
      id,
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.json(
      { error: 'Erreur lors de la récupération du ticket' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { title, description, status, assignedTo } = body;

    const ticketService = ServiceFactory.getTicketService();
    const ticket = await ticketService.updateTicket(id, {
      title,
      description,
      status,
      assignedTo,
    });

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

    console.error(
      'Error updating ticket with ID:',
      id,
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.json({ error: 'Erreur lors de la mise à jour du ticket' }, { status: 500 });
  }
}
