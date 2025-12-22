import mongoose, { Schema } from 'mongoose';

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
});

// Note : L'index sur email est créé automatiquement via l'option unique: true

export default mongoose.models.User || mongoose.model('User', UserSchema);
