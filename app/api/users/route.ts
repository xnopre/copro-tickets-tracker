import { NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import connectDB from '@/infrastructure/database/mongodb';
import { logger } from '@/infrastructure/services/logger';
import { auth } from '@/auth';

/**
 * GET /api/users
 * Récupère la liste de tous les utilisateurs
 */
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const userService = ServiceFactory.getUserService();
    const users = await userService.getUsers();

    return NextResponse.json(users);
  } catch (error) {
    logger.error('Error fetching users', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}
