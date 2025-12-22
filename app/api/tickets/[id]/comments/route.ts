import { NextRequest, NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { ValidationError } from '@/domain/errors/ValidationError';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const commentService = ServiceFactory.getCommentService();
    const comments = await commentService.getCommentsByTicketId(id);

    return NextResponse.json(comments);
  } catch (error) {
    if (error instanceof InvalidIdError) {
      return NextResponse.json({ error: 'ID de ticket invalide' }, { status: 400 });
    }

    console.error(
      'Error fetching comments for ticket ID:',
      id,
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commentaires' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { content, author } = body;

    const commentService = ServiceFactory.getCommentService();
    const comment = await commentService.addComment({
      ticketId: id,
      content,
      author,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof InvalidIdError) {
      return NextResponse.json({ error: 'ID de ticket invalide' }, { status: 400 });
    }

    console.error(
      'Error creating comment for ticket ID:',
      id,
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.json(
      { error: 'Erreur lors de la création du commentaire' },
      { status: 500 }
    );
  }
}
