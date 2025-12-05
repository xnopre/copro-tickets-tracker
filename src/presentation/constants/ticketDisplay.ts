import { TicketStatus } from '@/domain/value-objects/TicketStatus';

export const statusColors = {
  [TicketStatus.NEW]: 'bg-blue-100 text-blue-800',
  [TicketStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
  [TicketStatus.RESOLVED]: 'bg-green-100 text-green-800',
  [TicketStatus.CLOSED]: 'bg-gray-100 text-gray-800',
} as const;

export const statusLabels = {
  [TicketStatus.NEW]: 'Nouveau',
  [TicketStatus.IN_PROGRESS]: 'En cours',
  [TicketStatus.RESOLVED]: 'Résolu',
  [TicketStatus.CLOSED]: 'Fermé',
} as const;
