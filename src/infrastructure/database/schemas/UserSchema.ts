import mongoose, { Schema } from 'mongoose';
import bcryptjs from 'bcryptjs';

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
 * Hook pre-save : Hash automatique du password avec bcryptjs
 * S'exécute avant chaque save()
 */
UserSchema.pre('save', async function () {
  // Si le password n'a pas été modifié, on skip
  if (!this.isModified('password')) return;

  // Hash avec bcryptjs (10 rounds = bon compromis sécurité/perf)
  this.password = await bcryptjs.hash(this.password, 10);
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
