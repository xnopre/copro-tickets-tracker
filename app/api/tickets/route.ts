import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TicketModel } from '@/lib/models/Ticket';
import { TicketStatus } from '@/types/ticket';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Le titre est requis' }, { status: 400 });
    }

    if (title.trim().length > 200) {
      return NextResponse.json(
        { error: 'Le titre ne doit pas dépasser 200 caractères' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json({ error: 'La description est requise' }, { status: 400 });
    }

    if (description.trim().length > 5000) {
      return NextResponse.json(
        { error: 'La description ne doit pas dépasser 5000 caractères' },
        { status: 400 }
      );
    }

    await connectDB();

    const ticket = await TicketModel.create({
      title: title.trim(),
      description: description.trim(),
      status: TicketStatus.NEW,
    });

    return NextResponse.json(
      {
        id: ticket._id.toString(),
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      'Error creating ticket:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return NextResponse.json({ error: 'Erreur lors de la création du ticket' }, { status: 500 });
  }
}
