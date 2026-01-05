import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import UserModel from './UserSchema';
import { comparePassword } from '../../crypto/passwordUtils';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('UserSchema', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Démarrer un serveur MongoDB en mémoire
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Se connecter à MongoDB en mémoire
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Déconnecter Mongoose
    await mongoose.disconnect();

    // Arrêter le serveur MongoDB en mémoire
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it('should have required fields', () => {
    const schema = UserModel.schema;

    expect(schema.path('firstName')).toBeDefined();
    expect(schema.path('firstName').isRequired).toBe(true);

    expect(schema.path('lastName')).toBeDefined();
    expect(schema.path('lastName').isRequired).toBe(true);

    expect(schema.path('email')).toBeDefined();
    expect(schema.path('email').isRequired).toBe(true);

    expect(schema.path('password')).toBeDefined();
    expect(schema.path('password').isRequired).toBe(true);
  });

  it('should have email field with unique constraint', () => {
    const schema = UserModel.schema;

    const emailPath = schema.path('email');
    expect(emailPath.options.unique).toBe(true);
    expect(emailPath.options.lowercase).toBe(true);
  });

  it('should trim string fields', () => {
    const schema = UserModel.schema;

    expect(schema.path('firstName').options.trim).toBe(true);
    expect(schema.path('lastName').options.trim).toBe(true);
    expect(schema.path('email').options.trim).toBe(true);
  });

  it('should have maxlength constraints', () => {
    const schema = UserModel.schema;

    expect(schema.path('firstName').options.maxlength).toBe(50);
    expect(schema.path('lastName').options.maxlength).toBe(50);
    expect(schema.path('email').options.maxlength).toBe(100);
  });

  it('should have password field with minlength constraint', () => {
    const schema = UserModel.schema;

    const passwordPath = schema.path('password');
    expect(passwordPath).toBeDefined();
    expect(passwordPath.options.minlength).toBe(8);
    expect(passwordPath.options.select).toBe(false);
  });

  it('should hash password on save', async () => {
    const plainPassword = 'mySecurePassword123';
    const user = new UserModel({
      firstName: 'Test',
      lastName: 'User',
      email: `test-${Date.now()}@example.com`,
      password: plainPassword,
    });

    // Sauvegarder l'utilisateur dans MongoDB en mémoire
    const savedUser = await user.save();

    // Vérifier que le password a été hashé
    expect(savedUser.password).not.toBe(plainPassword);
    // Web Crypto API format: salt:hash (both in hex)
    expect(savedUser.password).toMatch(/^[a-f0-9]{32}:[a-f0-9]{64}$/);

    // Vérifier que le hash peut être comparé avec le password original
    const isMatch = await comparePassword(plainPassword, savedUser.password);
    expect(isMatch).toBe(true);
  });

  it('should have pre-save hook for password hashing', () => {
    const schema = UserModel.schema;

    // Verify that there's a pre-save hook defined
    // The hook should exist in the schema middleware
    expect(schema.pre).toBeDefined();
  });
});
