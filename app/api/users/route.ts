import { NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import connectDB from '@/infrastructure/database/mongodb';

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
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}
