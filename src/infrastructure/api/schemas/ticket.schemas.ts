import { z } from 'zod';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';

// Schémas pour les paramètres d'URL
const mongoObjectId = z
  .string()
  .refine(id => /^[0-9a-f]{24}$/i.test(id), 'ID doit être un ObjectId MongoDB valide');

export const IdParamSchema = z.object({
  id: mongoObjectId,
});

const nonEmptyString = (fieldName: string) =>
  z
    .string({ message: `${fieldName} est requis` })
    .refine(val => val.trim().length > 0, `${fieldName} est requis`);

export const CreateTicketSchema = z
  .object({
    title: nonEmptyString('Le titre').max(200, 'Le titre ne doit pas dépasser 200 caractères'),
    description: z
      .string({ message: 'La description est requise' })
      .refine(val => val.trim().length > 0, 'La description est requise')
      .max(5000, 'La description ne doit pas dépasser 5000 caractères'),
  })
  .strict();

export const UpdateTicketSchema = z
  .object({
    title: nonEmptyString('Le titre')
      .max(200, 'Le titre ne doit pas dépasser 200 caractères')
      .optional(),
    description: z
      .string({ message: 'La description est requise' })
      .refine(val => val.trim().length > 0, 'La description est requise')
      .max(5000, 'La description ne doit pas dépasser 5000 caractères')
      .optional(),
    status: z.nativeEnum(TicketStatus, { message: 'Le statut est invalide' }).optional(),
    assignedTo: mongoObjectId.nullish(),
  })
  .strict();

export const AddCommentRequestSchema = z
  .object({
    id: mongoObjectId,
    content: z
      .string({ message: 'Le contenu est requis' })
      .refine(val => val.trim().length > 0, 'Le contenu est requis')
      .max(2000, 'Le contenu ne doit pas dépasser 2000 caractères'),
  })
  .strict();
