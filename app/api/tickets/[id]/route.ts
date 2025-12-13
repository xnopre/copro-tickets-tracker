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
    const { title, description, status, assignedTo } = body;

    // Validation : au moins un champ requis
    if (
      title === undefined &&
      description === undefined &&
      status === undefined &&
      assignedTo === undefined
    ) {
      return NextResponse.json({ error: 'Au moins un champ doit être fourni' }, { status: 400 });
    }

    // Construire updateData avec seulement les champs fournis
    const updateData: {
      title?: string;
      description?: string;
      status?: TicketStatus;
      assignedTo?: string;
    } = {};

    // Valider et ajouter title si fourni
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json({ error: 'Le titre est requis' }, { status: 400 });
      }
      if (title.trim().length > 200) {
        return NextResponse.json(
          { error: 'Le titre ne doit pas dépasser 200 caractères' },
          { status: 400 }
        );
      }
      updateData.title = title.trim();
    }

    // Valider et ajouter description si fournie
    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim().length === 0) {
        return NextResponse.json({ error: 'La description est requise' }, { status: 400 });
      }
      if (description.trim().length > 5000) {
        return NextResponse.json(
          { error: 'La description ne doit pas dépasser 5000 caractères' },
          { status: 400 }
        );
      }
      updateData.description = description.trim();
    }

    // Valider status si fourni
    if (status !== undefined) {
      if (!Object.values(TicketStatus).includes(status)) {
        return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
      }
      updateData.status = status;
    }

    // Valider assignedTo si fourni
    if (assignedTo !== undefined) {
      if (typeof assignedTo !== 'string' || assignedTo.trim() === '') {
        return NextResponse.json(
          { error: 'Le nom de la personne assignée est obligatoire' },
          { status: 400 }
        );
      }
      updateData.assignedTo = assignedTo.trim();
    }

    const ticketService = ServiceFactory.getTicketService();
    const ticket = await ticketService.updateTicket(id, updateData);

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
