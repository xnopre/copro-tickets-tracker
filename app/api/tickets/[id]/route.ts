import { NextRequest, NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { status, assignedTo } = body;

    // Validation côté serveur
    if (!status || !Object.values(TicketStatus).includes(status)) {
      return NextResponse.json({ error: 'Statut invalide ou manquant' }, { status: 400 });
    }

    if (!assignedTo || typeof assignedTo !== 'string' || assignedTo.trim() === '') {
      return NextResponse.json(
        { error: 'Le nom de la personne assignée est obligatoire' },
        { status: 400 }
      );
    }

    const ticketService = ServiceFactory.getTicketService();
    const ticket = await ticketService.updateTicket(id, {
      status,
      assignedTo: assignedTo.trim(),
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
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
