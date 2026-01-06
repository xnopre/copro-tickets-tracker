import { NextRequest, NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { ValidationError } from '@/domain/errors/ValidationError';
import { logger } from '@/infrastructure/services/logger';
import { auth } from '@/auth';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const commentService = ServiceFactory.getCommentService();
    const comments = await commentService.getCommentsByTicketId(id);

    return NextResponse.json(comments);
  } catch (error) {
    if (error instanceof InvalidIdError) {
      return NextResponse.json({ error: 'ID de ticket invalide' }, { status: 400 });
    }

    logger.error('Error fetching comments', error, { ticketId: id });

    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commentaires' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { content } = body;

    const commentService = ServiceFactory.getCommentService();
    const comment = await commentService.addComment({
      ticketId: id,
      content,
      authorId: session.user.id,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof InvalidIdError) {
      return NextResponse.json({ error: 'ID de ticket invalide' }, { status: 400 });
    }

    logger.error('Error creating comment', error, { ticketId: id });

    return NextResponse.json(
      { error: 'Erreur lors de la création du commentaire' },
      { status: 500 }
    );
  }
}
