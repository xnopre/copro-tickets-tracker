import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { join } from 'path';
import UserModel from '@/infrastructure/database/schemas/UserSchema';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

async function seedUsers() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Nettoyer les utilisateurs existants
    await UserModel.deleteMany({});
    console.log('Cleared existing users');

    // Lire les utilisateurs depuis le fichier JSON
    // Priorité: users.local.json (non commité) puis users.json
    const localFilePath = join(__dirname, 'users.local.json');
    const defaultFilePath = join(__dirname, 'users.json');

    let usersFilePath: string;
    try {
      readFileSync(localFilePath);
      usersFilePath = localFilePath;
      console.log('📋 Using local file: users.local.json');
    } catch {
      usersFilePath = defaultFilePath;
      console.log('📋 Using default file: users.json');
    }

    const usersData = readFileSync(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);

    console.log(`📋 Loading ${users.length} users from ${usersFilePath}`);

    // Valider les données
    users.forEach((user: any, index: number) => {
      if (!user.firstName || !user.lastName || !user.email) {
        throw new Error(
          `Invalid user at index ${index}: firstName, lastName, and email are required`
        );
      }
    });

    const createdUsers = await UserModel.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users:`);
    createdUsers.forEach(user => {
      console.log(`  - ${user.firstName} ${user.lastName} (${user.email})`);
    });

    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
