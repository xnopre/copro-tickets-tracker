import { NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import connectDB from '@/infrastructure/database/mongodb';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { logger } from '@/infrastructure/services/logger';

/**
 * GET /api/users/[id]
 * Récupère un utilisateur par son ID
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const userService = ServiceFactory.getUserService();
    const user = await userService.getUserById(id);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    logger.error('Error fetching user', error);

    if (error instanceof InvalidIdError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'utilisateur" },
      { status: 500 }
    );
  }
}
