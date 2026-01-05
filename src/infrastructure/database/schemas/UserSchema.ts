import mongoose, { Schema } from 'mongoose';
import { hashPassword } from '../../crypto/passwordUtils';

/**
 * Schéma Mongoose pour l'entité User
 */
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // Pas de select par défaut
  },
});

// Note : L'index sur email est créé automatiquement via l'option unique: true

/**
 * Hook pre-save : Hash automatique du password avec Web Crypto API
 * S'exécute avant chaque save()
 */
UserSchema.pre('save', async function () {
  // Si le password n'a pas été modifié, on skip
  if (!this.isModified('password')) return;

  // Hash avec Web Crypto API (PBKDF2 avec SHA-256)
  this.password = await hashPassword(this.password);
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
