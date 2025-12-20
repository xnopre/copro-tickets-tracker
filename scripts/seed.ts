import mongoose from 'mongoose';
import { TicketModel } from '@/infrastructure/database/schemas/TicketSchema';
import UserModel from '@/infrastructure/database/schemas/UserSchema';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Nettoyer les utilisateurs et tickets existants
    await UserModel.deleteMany({});
    console.log('Cleared existing users');
    await TicketModel.deleteMany({});
    console.log('Cleared existing tickets');

    // Créer des utilisateurs
    const users = [
      {
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean.martin@example.com',
        password: 'password123', // En production, utiliser bcrypt pour hasher
      },
      {
        firstName: 'Marie',
        lastName: 'Dubois',
        email: 'marie.dubois@example.com',
        password: 'password123',
      },
      {
        firstName: 'Pierre',
        lastName: 'Lefebvre',
        email: 'pierre.lefebvre@example.com',
        password: 'password123',
      },
      {
        firstName: 'Sophie',
        lastName: 'Bernard',
        email: 'sophie.bernard@example.com',
        password: 'password123',
      },
    ];

    const createdUsers = await UserModel.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // Créer des tickets avec référence aux utilisateurs
    const tickets = [
      {
        title: "Fuite d'eau dans le hall",
        description: "Une fuite d'eau a été détectée dans le hall d'entrée au niveau du plafond",
        status: TicketStatus.NEW,
        assignedTo: null,
      },
      {
        title: 'Panne ascenseur',
        description: "L'ascenseur principal est en panne depuis ce matin",
        status: TicketStatus.IN_PROGRESS,
        assignedTo: createdUsers[0]._id, // Jean Martin
      },
      {
        title: 'Ampoule grillée parking',
        description: "L'éclairage au niveau -1 du parking est défectueux",
        status: TicketStatus.RESOLVED,
        assignedTo: createdUsers[1]._id, // Marie Dubois
      },
      {
        title: "Porte d'entrée défectueuse",
        description:
          "La porte d'entrée principale ne se fermait plus correctement. Réparation effectuée et vérifiée",
        status: TicketStatus.CLOSED,
        assignedTo: createdUsers[2]._id, // Pierre Lefebvre
      },
      {
        title: 'Problème de chauffage',
        description: 'Le chauffage ne fonctionne pas correctement au 3ème étage',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: createdUsers[3]._id, // Sophie Bernard
      },
    ];

    const createdTickets = await TicketModel.insertMany(tickets);
    console.log(`Created ${createdTickets.length} tickets`);

    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
