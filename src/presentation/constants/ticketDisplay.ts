import { TicketStatus } from '@/domain/value-objects/TicketStatus';

export const statusLabels = {
  [TicketStatus.NEW]: 'Nouveau',
  [TicketStatus.IN_PROGRESS]: 'En cours',
  [TicketStatus.RESOLVED]: 'Résolu',
  [TicketStatus.CLOSED]: 'Fermé',
} as const;
