import mongoose from 'mongoose';
import { TicketModel } from '@/infrastructure/database/schemas/TicketSchema';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    await TicketModel.deleteMany({});
    console.log('Cleared existing tickets');

    const tickets = [
      {
        title: "Fuite d'eau dans le hall",
        description: "Une fuite d'eau a été détectée dans le hall d'entrée au niveau du plafond",
        status: TicketStatus.NEW,
      },
      {
        title: 'Panne ascenseur',
        description: "L'ascenseur principal est en panne depuis ce matin",
        status: TicketStatus.IN_PROGRESS,
      },
      {
        title: 'Ampoule grillée parking',
        description: "L'éclairage au niveau -1 du parking est défectueux",
        status: TicketStatus.RESOLVED,
      },
      {
        title: "Porte d'entrée défectueuse",
        description:
          "La porte d'entrée principale ne se fermait plus correctement. Réparation effectuée et vérifiée",
        status: TicketStatus.CLOSED,
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
