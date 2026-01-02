import { NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import connectDB from '@/infrastructure/database/mongodb';
import { logger } from '@/infrastructure/services/logger';

/**
 * GET /api/users
 * Récupère la liste de tous les utilisateurs
 */
export async function GET() {
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
